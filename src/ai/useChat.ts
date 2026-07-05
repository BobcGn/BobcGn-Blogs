/**
 * useChat.ts — Preact Custom Hook: state management, LocalStorage persistence,
 * and SSE streaming engine.
 *
 * Consumes ContextManager for page awareness.
 * Pure logic — zero UI rendering concerns.
 */
import { useState, useEffect, useCallback, useRef } from "preact/hooks"
import { getPageContextPrompt } from "./ContextManager"

// ── Types ──

export interface UiMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface UseChatReturn {
  /** Clean messages for rendering in the UI */
  uiMessages: UiMessage[]
  /** True while a request is in-flight (controls button disabled state) */
  isLoading: boolean
  /** Accumulated streaming text (shown during active stream, cleared on finish) */
  streamingContent: string
  /** Send a user message — triggers context assembly, fetch, and SSE parse */
  sendMessage: (text: string) => Promise<void>
  /** Wipe all conversation history from state and LocalStorage */
  clearHistory: () => void
}

// ── Constants ──

const STORAGE_KEY = "quartz_ai_history"
const API_URL = "https://skid-outboard-bounce.ngrok-free.dev/v1/chat/completions"
const COOLDOWN_MS = 3000
const MAX_HISTORY = 20

const THINK_OPEN = "<think>"
const THINK_RE = /<think>[\s\S]*?<\/think>/g

// ── Think-tag Helpers ──

/** Detect whether a <think> block is still open (streaming, not yet closed) */
function hasOpenThink(raw: string): boolean {
  const opens = (raw.match(/<think>/g) ?? []).length
  const closes = (raw.match(/<\/think>/g) ?? []).length
  return opens > closes
}

/** Strip completed and in-progress <think> blocks from display text */
function stripThink(raw: string): string {
  let visible = raw.replace(THINK_RE, "")
  if (hasOpenThink(raw)) {
    const idx = visible.lastIndexOf(THINK_OPEN)
    if (idx !== -1) visible = visible.slice(0, idx)
  }
  return visible.trimEnd()
}

/** Strip trailing \r\n from SSE tokens to prevent vertical layout */
function cleanToken(s: string): string {
  return s.replace(/\r?\n/g, "")
}

// ── LocalStorage Helpers ──

function loadHistory(): UiMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as UiMessage[]) : []
  } catch {
    return []
  }
}

function saveHistory(messages: UiMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // Quota exceeded or private browsing — silently ignore
  }
}

// ── Hook ──

export function useChat(): UseChatReturn {
  // ── State ──
  const [uiMessages, setUiMessages] = useState<UiMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")

  // ── Refs (mutable, no re-render) ──
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cooldownEndRef = useRef(0)

  // ── Lifecycle: hydrate from LocalStorage on client mount ──
  useEffect(() => {
    setUiMessages(loadHistory())
  }, [])

  // ── Lifecycle: persist to LocalStorage on every change ──
  useEffect(() => {
    saveHistory(uiMessages)
  }, [uiMessages])

  // ── Lifecycle: cleanup cooldown timer on unmount ──
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    }
  }, [])

  // ── Core: send message ──
  const sendMessage = useCallback(
    async (userText: string): Promise<void> => {
      const trimmed = userText.trim()
      if (!trimmed) return
      if (isLoading) return
      if (Date.now() < cooldownEndRef.current) return

      // ── 1. Append user message to UI state ──
      const userMsg: UiMessage = { role: "user", content: trimmed }
      setUiMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      setStreamingContent("")

      // ── 2. Assemble API payload with page context ──
      const contextPrompt = getPageContextPrompt()
      const systemContent = contextPrompt
        ? `作为本博客的 AI 助手，请优先且严格基于用户当前正在阅读的页面内容来回答问题。\n\n${contextPrompt}`
        : "你是一个友好的 AI 博客助手。"

      // Send recent history for multi-turn context (strip think tags from past AI replies)
      const historyForApi = [...uiMessages.slice(-MAX_HISTORY), userMsg].map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.role === "assistant" ? stripThink(m.content) : m.content,
      }))

      const apiMessages = [
        { role: "system" as const, content: systemContent },
        ...historyForApi,
      ]

      // ── 3. Fetch with SSE streaming ──
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "default",
            messages: apiMessages,
            stream: true,
          }),
        })

        // ── 429 Circuit Breaker ──
        if (res.status === 429) {
          setUiMessages((prev) => [
            ...prev,
            { role: "system", content: "⚠️ 系统算力正在冷却，请稍后再试。" },
          ])
          cooldownEndRef.current = Date.now() + COOLDOWN_MS
          return
        }

        if (!res.ok) {
          setUiMessages((prev) => [
            ...prev,
            {
              role: "system",
              content: `⚠️ 请求失败 (HTTP ${res.status})，请稍后再试。`,
            },
          ])
          return
        }

        // ── Robust SSE Stream Read ──
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        let fullContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Append the new chunk to our buffer
          buffer += decoder.decode(value, { stream: true })

          // Process all complete messages in the buffer
          let boundary = buffer.indexOf("\n\n")
          while (boundary !== -1) {
            const chunk = buffer.slice(0, boundary)
            buffer = buffer.slice(boundary + 2) // Move buffer past the message and \n\n

            if (chunk.trim()) {
              const line = chunk.trim().slice("data: ".length)

              // Check for the end signal
              if (line === "[DONE]") {
                // Finalize and exit reader loop
                setUiMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: fullContent },
                ])
                setStreamingContent("")
                reader.releaseLock()
                return
              }

              // Safely parse JSON and extract content
              try {
                const parsed = JSON.parse(line)
                const content = parsed.choices?.[0]?.delta?.content
                if (typeof content === "string") {
                  fullContent += content
                  setStreamingContent(stripThink(fullContent))
                }
              } catch (e) {
                // A malformed JSON is not fatal, just log and continue
                console.warn("SSE JSON parse error:", e)
                continue
              }
            }
            boundary = buffer.indexOf("\n\n")
          }
        }

      } catch (e) {
        setUiMessages((prev) => [
          ...prev,
          { role: "system", content: `⚠️ 网络异常，请检查连接后重试。 ${e instanceof Error ? `(${e.message})` : ""}` },
        ])
      } finally {
        setIsLoading(false)
        // Start cooldown countdown
        cooldownEndRef.current = Date.now() + COOLDOWN_MS
      }
    },
    [isLoading, uiMessages],
  )

  // ── Clear history ──
  const clearHistory = useCallback(() => {
    setUiMessages([])
    setStreamingContent("")
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    uiMessages,
    isLoading,
    streamingContent,
    sendMessage,
    clearHistory,
  }
}

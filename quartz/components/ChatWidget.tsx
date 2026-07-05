import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { useChat } from "../../src/ai/useChat"
import type { UiMessage } from "../../src/ai/useChat"

// ── Markdown Renderer (lightweight, no dependencies) ──

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function renderMarkdown(text: string): string {
  // Normalize line endings
  let md = text.replace(/\r\n/g, "\n")

  // Code blocks: ```lang\n...\n```
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang: string, code: string) => {
    return `<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`
  })

  // Split into lines for block-level processing
  const lines = md.split("\n")
  const htmlLines: string[] = []
  let inList = false
  let listType: "ul" | "ol" | null = null

  for (const line of lines) {
    // Skip if inside a pre block (already processed)
    if (htmlLines.length > 0 && htmlLines[htmlLines.length - 1].includes("<pre>")) {
      if (!line.includes("</pre>")) {
        htmlLines.push(escapeHtml(line))
        continue
      }
    }

    // Unordered list
    const ulMatch = line.match(/^[\s]*[-*]\s+(.*)/)
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) htmlLines.push(`</${listType}>`)
        htmlLines.push("<ul>")
        inList = true
        listType = "ul"
      }
      htmlLines.push(`<li>${inlineMarkdown(ulMatch[1])}</li>`)
      continue
    }

    // Ordered list
    const olMatch = line.match(/^[\s]*\d+\.\s+(.*)/)
    if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) htmlLines.push(`</${listType}>`)
        htmlLines.push("<ol>")
        inList = true
        listType = "ol"
      }
      htmlLines.push(`<li>${inlineMarkdown(olMatch[1])}</li>`)
      continue
    }

    // Close list if we're no longer in one
    if (inList) {
      htmlLines.push(`</${listType}>`)
      inList = false
      listType = null
    }

    // Empty line → paragraph break
    if (line.trim() === "") {
      htmlLines.push("")
      continue
    }

    // Already HTML (pre/code blocks) — pass through
    if (line.startsWith("<pre>") || line.startsWith("</pre>")) {
      htmlLines.push(line)
      continue
    }

    // Regular paragraph line
    htmlLines.push(`<p>${inlineMarkdown(line)}</p>`)
  }

  if (inList) htmlLines.push(`</${listType}>`)

  // Collapse multiple blank lines
  return htmlLines.join("\n").replace(/(\n\s*){2,}/g, "\n")
}

function inlineMarkdown(text: string): string {
  let s = escapeHtml(text)
  // Bold: **text**
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  // Italic: *text*
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
  // Inline code: `code`
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>")
  // Links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  return s
}

// ── Think Tag Parser ──

interface ParsedMessage {
  think: string
  body: string
}

const THINK_RE = /<think>([\s\S]*?)<\/think>/g

function parseAssistantMessage(raw: string): ParsedMessage {
  const thinks: string[] = []
  const body = raw.replace(THINK_RE, (_m, content: string) => {
    thinks.push(content.trim())
    return ""
  }).trim()
  return { think: thinks.join("\n\n"), body }
}

// ── Inline CSS (Quartz variable theme) ──

const chatWidgetCss = `
/* ── Floating Trigger Button ── */
.chat-toggle {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10000;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--secondary);
  color: var(--light);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}
.chat-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.24);
}
.chat-toggle svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

/* ── Chat Panel ── */
.chat-panel {
  position: fixed;
  bottom: 5.5rem;
  right: 1.5rem;
  z-index: 9999;
  width: 380px;
  max-width: calc(100vw - 2rem);
  height: 520px;
  max-height: calc(100vh - 8rem);
  border-radius: 12px;
  background: var(--light);
  border: 1px solid var(--lightgray);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: scale(0.9) translateY(12px);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.chat-panel--open {
  transform: scale(1) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

/* ── Panel Header ── */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--lightgray);
  background: var(--light);
  flex-shrink: 0;
}
.chat-header-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--dark);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.chat-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  color: var(--darkgray);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s ease, color 0.15s ease;
}
.chat-icon-btn:hover {
  background: var(--lightgray);
}
.chat-icon-btn--danger:hover {
  color: #e74c3c;
}
.chat-icon-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* ── Messages Area ── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

/* ── Message Bubbles ── */
.chat-msg {
  max-width: 85%;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.88rem;
  line-height: 1.55;

  /* Defensive styles for robust layout */
  min-width: 2rem;
  min-height: 1.5rem;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere; /* Stricter than break-word */
}
.chat-msg--user {
  align-self: flex-end;
  background: var(--secondary);
  color: var(--light);
  border-bottom-right-radius: 3px;
}
.chat-msg--assistant {
  align-self: flex-start;
  background: var(--lightgray);
  color: var(--darkgray);
  border-bottom-left-radius: 3px;
  /* This is the key: allow the bubble to size to its content */
  width: fit-content;
}
.chat-msg--assistant .chat-msg-body p {
  margin: 0.3em 0;
}
.chat-msg--assistant .chat-msg-body p:first-child {
  margin-top: 0;
}
.chat-msg--assistant .chat-msg-body p:last-child {
  margin-bottom: 0;
}
.chat-msg--assistant .chat-msg-body code {
  background: rgba(0,0,0,0.08);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: var(--codeFont, monospace);
}
.chat-msg--assistant .chat-msg-body pre {
  background: rgba(0,0,0,0.06);
  padding: 0.5rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.4em 0;
}
.chat-msg--assistant .chat-msg-body pre code {
  background: none;
  padding: 0;
}
.chat-msg--assistant .chat-msg-body a {
  color: var(--secondary);
  text-decoration: underline;
}
.chat-msg--assistant .chat-msg-body ul,
.chat-msg--assistant .chat-msg-body ol {
  margin: 0.3em 0;
  padding-left: 1.2em;
}
.chat-msg--assistant .chat-msg-body strong {
  font-weight: 600;
}
.chat-msg--system {
  align-self: center;
  background: transparent;
  color: var(--darkgray);
  font-size: 0.82rem;
  opacity: 0.8;
  text-align: center;
  font-style: italic;
}

/* ── Think Block (collapsible) ── */
.chat-think {
  margin-bottom: 0.5rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  overflow: hidden;
}
.chat-think summary {
  padding: 0.3rem 0.6rem;
  font-size: 0.78rem;
  color: var(--darkgray);
  opacity: 0.7;
  cursor: pointer;
  user-select: none;
  background: rgba(0,0,0,0.03);
}
.chat-think summary:hover {
  opacity: 1;
}
.chat-think-body {
  padding: 0.4rem 0.6rem;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--darkgray);
  opacity: 0.75;
  white-space: pre-wrap;
  border-top: 1px solid var(--lightgray);
  max-height: 200px;
  overflow-y: auto;
}

/* ── Streaming Cursor ── */
.chat-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--darkgray);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: chat-blink 0.8s step-end infinite;
}
@keyframes chat-blink {
  50% { opacity: 0; }
}

/* ── Input Area ── */
.chat-input-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border-top: 1px solid var(--lightgray);
  background: var(--light);
  flex-shrink: 0;
}
.chat-input {
  flex: 1;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--darkgray);
  background: var(--light);
  outline: none;
  transition: border-color 0.15s ease;
}
.chat-input:focus {
  border-color: var(--secondary);
}
.chat-input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.chat-send {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--secondary);
  color: var(--light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;
  padding: 0;
}
.chat-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chat-send:not(:disabled):hover {
  opacity: 0.85;
}
.chat-send svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* ── Mobile Adjustments ── */
@media (max-width: 800px) {
  .chat-toggle {
    bottom: 1rem;
    right: 1rem;
    width: 46px;
    height: 46px;
  }
  .chat-panel {
    bottom: 4.5rem;
    right: 0.5rem;
    width: calc(100vw - 1rem);
    max-width: 380px;
    height: 60vh;
  }
}
`.trim()

// ── SVG Icons (inlined for zero network requests) ──

const IconChat = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
  </svg>
)

const IconBrain = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
)

const IconClose = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)

const IconTrash = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
)

const IconSend = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
)

// ── Component ──

/** Render a single assistant message: think block (collapsible) + markdown body */
function renderAssistantMsg(raw: string): preact.ComponentChildren {
  const { think, body } = parseAssistantMessage(raw)
  const children: preact.ComponentChildren[] = []

  if (think) {
    children.push(
      <details class="chat-think" key="think">
        <summary>💭 思考过程 ({think.length} 字)</summary>
        <div class="chat-think-body">{think}</div>
      </details>,
    )
  }

  if (body) {
    children.push(
      <div
        class="chat-msg-body"
        key="body"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />,
    )
  }

  return children.length > 0 ? children : null
}

const ChatWidget: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  const {
    uiMessages,
    isLoading,
    streamingContent,
    sendMessage,
    clearHistory,
  } = useChat()

  // ── Event Handlers ──

  const handleToggle = (): void => {
    const panel = document.querySelector<HTMLElement>(".chat-panel")
    panel?.classList.toggle("chat-panel--open")
    if (panel?.classList.contains("chat-panel--open")) {
      const input = panel.querySelector<HTMLInputElement>(".chat-input")
      input?.focus()
    }
  }

  const handleClose = (): void => {
    document.querySelector<HTMLElement>(".chat-panel")?.classList.remove("chat-panel--open")
  }

  const handleSend = (): void => {
    const input = document.querySelector<HTMLInputElement>(".chat-input")
    if (input?.value) {
      sendMessage(input.value)
      input.value = ""
    }
  }

  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Render ──

  return (
    <>
      {/* ── Floating Trigger ── */}
      <button
        class={classNames(displayClass, "chat-toggle")}
        aria-label="Open AI Chat"
        onClick={handleToggle}
      >
        {IconChat}
      </button>

      {/* ── Chat Panel ── */}
      <div class={classNames(displayClass, "chat-panel")}>
        {/* Header */}
        <div class="chat-header">
          <span class="chat-header-title">
            <span style={{ display: "flex", alignItems: "center", color: "var(--secondary)" }}>
              {IconBrain}
            </span>
            AI 助手
          </span>
          <div class="chat-header-actions">
            <button
              class="chat-icon-btn chat-icon-btn--danger"
              aria-label="Clear history"
              title="清除对话记忆"
              onClick={clearHistory}
            >
              {IconTrash}
            </button>
            <button class="chat-icon-btn" aria-label="Close chat" onClick={handleClose}>
              {IconClose}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div class="chat-messages">
          {uiMessages.map((msg: UiMessage, i: number) => (
            <div key={i} class={`chat-msg chat-msg--${msg.role}`}>
              {msg.role === "assistant"
                ? renderAssistantMsg(msg.content)
                : msg.content}
            </div>
          ))}
          {/* Active streaming bubble */}
          {streamingContent && (
            <div class="chat-msg chat-msg--assistant">
              {renderAssistantMsg(streamingContent)}
              <span class="chat-cursor" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div class="chat-input-area">
          <input
            class="chat-input"
            type="text"
            placeholder={isLoading ? "AI 正在回复…" : "输入消息…"}
            autocomplete="off"
            disabled={isLoading}
            onKeyDown={handleKeydown}
          />
          <button
            class="chat-send"
            aria-label="Send message"
            disabled={isLoading}
            onClick={handleSend}
          >
            {IconSend}
          </button>
        </div>
      </div>
    </>
  )
}

ChatWidget.css = chatWidgetCss

export default (() => ChatWidget) satisfies QuartzComponentConstructor

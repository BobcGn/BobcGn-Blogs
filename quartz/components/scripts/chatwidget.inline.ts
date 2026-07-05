;(() => {
  if (typeof window === "undefined") return

  const API_URL = "https://skid-outboard-bounce.ngrok-free.dev/v1/chat/completions"
  const COOLDOWN_MS = 3000

  // ── State ──
  let isProcessing = false
  let cooldownTimer: ReturnType<typeof setTimeout> | null = null
  let cooldownRemaining = 0
  let cooldownInterval: ReturnType<typeof setInterval> | null = null
  const messages: Array<{ role: string; content: string }> = []

  // ── DOM Refs ──
  let panel: HTMLElement
  let messagesEl: HTMLElement
  let input: HTMLInputElement
  let sendBtn: HTMLButtonElement
  let cooldownEl: HTMLElement

  /** Append a message bubble to the chat */
  function addMessage(role: "user" | "assistant" | "system", content: string): HTMLElement {
    const div = document.createElement("div")
    div.className = `chat-msg chat-msg--${role}`
    div.textContent = content
    messagesEl.appendChild(div)
    messagesEl.scrollTop = messagesEl.scrollHeight
    return div
  }

  /** Set input disabled state + send button */
  function setInputEnabled(enabled: boolean) {
    if (input) {
      input.disabled = !enabled
      input.placeholder = enabled ? "输入消息…" : isProcessing ? "AI 正在回复…" : "冷却中，请稍候…"
    }
    if (sendBtn) sendBtn.disabled = !enabled
  }

  /** Start the 3-second cooldown */
  function startCooldown() {
    cooldownRemaining = COOLDOWN_MS / 1000
    setInputEnabled(false)
    cooldownEl.textContent = `⏳ 冷却中 ${cooldownRemaining}s`
    cooldownEl.style.display = "block"

    cooldownInterval = setInterval(() => {
      cooldownRemaining--
      if (cooldownRemaining <= 0) {
        clearInterval(cooldownInterval!)
        cooldownInterval = null
        cooldownEl.style.display = "none"
        setInputEnabled(true)
      } else {
        cooldownEl.textContent = `⏳ 冷却中 ${cooldownRemaining}s`
      }
    }, 1000)
  }

  /** Clear any running cooldown */
  function clearCooldown() {
    if (cooldownTimer) {
      clearTimeout(cooldownTimer)
      cooldownTimer = null
    }
    if (cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
    cooldownRemaining = 0
    cooldownEl.style.display = "none"
  }

  /** Send the message via SSE streaming */
  async function sendMessage(text: string): Promise<void> {
    if (isProcessing || cooldownRemaining > 0) return
    if (!text.trim()) return

    // Append user message
    messages.push({ role: "user", content: text.trim() })
    addMessage("user", text.trim())
    input.value = ""

    // Acquire lock
    isProcessing = true
    setInputEnabled(false)

    // Create placeholder for streaming response
    const aiBubble = addMessage("assistant", "")
    messages.push({ role: "assistant", content: "" })

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "default",
          messages,
          stream: true,
        }),
      })

      // ── 429 熔断 ──
      if (res.status === 429) {
        aiBubble.textContent = "⚠️ 系统算力正在冷却，请稍后再试。"
        aiBubble.className = "chat-msg chat-msg--system"
        // Remove the empty assistant message from history
        messages.pop()
        isProcessing = false
        setInputEnabled(true)
        return
      }

      if (!res.ok) {
        aiBubble.textContent = `⚠️ 请求失败 (HTTP ${res.status})，请稍后再试。`
        aiBubble.className = "chat-msg chat-msg--system"
        messages.pop()
        isProcessing = false
        setInputEnabled(true)
        return
      }

      // ── SSE 流式读取 ──
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop()! // keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith("data:")) continue

          const data = trimmed.slice(5).trim()
          if (data === "[DONE]") {
            break
          }

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              fullContent += delta
              aiBubble.textContent = fullContent
              messagesEl.scrollTop = messagesEl.scrollHeight
            }
          } catch {
            // skip malformed JSON chunks
          }
        }
      }

      // Update the stored assistant message
      messages[messages.length - 1].content = fullContent
    } catch (err) {
      aiBubble.textContent = "⚠️ 网络异常，请检查连接后重试。"
      aiBubble.className = "chat-msg chat-msg--system"
      messages.pop()
    } finally {
      // Release lock
      isProcessing = false
      // Start cooldown
      startCooldown()
    }
  }

  // ── SPA lifecycle ──
  document.addEventListener("nav", () => {
    panel = document.querySelector(".chat-panel") as HTMLElement
    messagesEl = document.querySelector(".chat-messages") as HTMLElement
    input = document.querySelector(".chat-input") as HTMLInputElement
    sendBtn = document.querySelector(".chat-send") as HTMLButtonElement
    cooldownEl = document.querySelector(".chat-cooldown") as HTMLElement

    if (!panel || !messagesEl || !input || !sendBtn || !cooldownEl) return

    const toggleBtn = document.querySelector(".chat-toggle") as HTMLButtonElement
    const closeBtn = document.querySelector(".chat-close") as HTMLButtonElement

    // Toggle panel
    const togglePanel = () => {
      panel.classList.toggle("chat-panel--open")
      if (panel.classList.contains("chat-panel--open")) {
        input.focus()
      }
    }

    toggleBtn?.addEventListener("click", togglePanel)
    closeBtn?.addEventListener("click", () => panel.classList.remove("chat-panel--open"))
    window.addCleanup(() => toggleBtn?.removeEventListener("click", togglePanel))
    window.addCleanup(() => closeBtn?.removeEventListener("click", () => panel.classList.remove("chat-panel--open")))

    // Send on button click
    const onSend = () => sendMessage(input.value)
    sendBtn.addEventListener("click", onSend)
    window.addCleanup(() => sendBtn.removeEventListener("click", onSend))

    // Send on Enter
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage(input.value)
      }
    }
    input.addEventListener("keydown", onKeydown)
    window.addCleanup(() => input.removeEventListener("keydown", onKeydown))
  })
})()

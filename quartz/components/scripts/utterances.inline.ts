;(() => {
  if (typeof window === "undefined") return

  const changeTheme = (e: CustomEventMap["themechange"]) => {
    const iframe = document.querySelector("iframe.utterances-frame") as HTMLIFrameElement
    if (!iframe?.contentWindow) {
      return
    }

    iframe.contentWindow.postMessage(
      {
        type: "set-theme",
        theme: e.detail.theme === "dark" ? "github-dark" : "github-light",
      },
      "https://utteranc.es",
    )
  }

  document.addEventListener("nav", () => {
    const utterancesContainer = document.querySelector(".utterances")
    if (!utterancesContainer) {
      return
    }

    // Remove any existing utterances iframe (SPA navigation)
    const existing = utterancesContainer.querySelector("iframe.utterances-frame")
    if (existing) {
      existing.remove()
    }

    const script = document.createElement("script")
    script.src = "https://utteranc.es/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("repo", utterancesContainer.getAttribute("data-repo") ?? "")
    script.setAttribute(
      "issue-term",
      utterancesContainer.getAttribute("data-issue-term") ?? "title",
    )
    const label = utterancesContainer.getAttribute("data-label")
    if (label) {
      script.setAttribute("label", label)
    }

    // Resolve preferred-color-scheme to actual theme for current state
    const themeAttr = utterancesContainer.getAttribute("data-theme") ?? "preferred-color-scheme"
    if (themeAttr === "preferred-color-scheme") {
      const current = document.documentElement.getAttribute("saved-theme")
      script.setAttribute("theme", current === "dark" ? "github-dark" : "github-light")
    } else {
      script.setAttribute("theme", themeAttr)
    }

    utterancesContainer.appendChild(script)

    document.addEventListener("themechange", changeTheme)
    window.addCleanup(() => document.removeEventListener("themechange", changeTheme))
  })
})()

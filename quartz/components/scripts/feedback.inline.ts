;(() => {
  if (typeof window === "undefined") return

  const changeTheme = (e: CustomEventMap["themechange"]) => {
    const iframe = document.querySelector(".feedback-card iframe.giscus-frame") as HTMLIFrameElement
    if (!iframe?.contentWindow) return

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: e.detail.theme === "dark" ? "dark" : "light",
          },
        },
      },
      "https://giscus.app",
    )
  }

  document.addEventListener("nav", () => {
    const giscusContainer = document.querySelector(".feedback-card .giscus") as HTMLElement
    if (!giscusContainer) return

    // SPA 导航时移除旧 iframe
    giscusContainer.querySelector("iframe.giscus-frame")?.remove()

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("data-loading", "lazy")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-repo", giscusContainer.dataset.repo ?? "")
    script.setAttribute("data-repo-id", giscusContainer.dataset.repoId ?? "")
    script.setAttribute("data-category", giscusContainer.dataset.category ?? "General")
    script.setAttribute("data-category-id", giscusContainer.dataset.categoryId ?? "")
    script.setAttribute("data-mapping", giscusContainer.dataset.mapping ?? "title")
    script.setAttribute("data-strict", giscusContainer.dataset.strict ?? "1")
    script.setAttribute("data-reactions-enabled", giscusContainer.dataset.reactionsEnabled ?? "1")
    script.setAttribute("data-input-position", giscusContainer.dataset.inputPosition ?? "bottom")
    script.setAttribute("data-lang", giscusContainer.dataset.lang ?? "zh-CN")

    const theme = document.documentElement.getAttribute("saved-theme")
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light")

    giscusContainer.appendChild(script)

    document.addEventListener("themechange", changeTheme)
    window.addCleanup(() => document.removeEventListener("themechange", changeTheme))
  })
})()

/**
 * ContextManager.ts — Pure DOM parser for page context extraction.
 * Zero Preact dependency. Only browser APIs.
 *
 * Responsibility: parse the current Quartz page DOM and produce
 * a structured context prompt for the AI system message.
 */

// ── Types ──

export interface PageContext {
  /** Article title extracted from <article> h1 */
  title: string
  /** Tag list extracted from tag links */
  tags: string[]
  /** Current page URL */
  url: string
  /** Cleaned article body text (noise removed, truncated) */
  bodyText: string
}

// ── Constants ──

const MAX_BODY_CHARS = 6000

/** CSS selectors for elements to strip from article body */
const NOISE_SELECTORS = [
  "nav",
  ".toc",
  ".table-of-contents",
  ".backlinks",
  ".graph",
  ".page-header",
  ".page-footer",
  ".desktop-only",
  ".sidebar",
  "script",
  "style",
  ".comments",
  ".feedback-card",
  ".chat-toggle",
  ".chat-panel",
].join(", ")

// ── Core Functions ──

/**
 * Extract structured page context from the current DOM.
 * Safe to call on any page — returns empty strings for missing fields.
 */
export function getPageContext(): PageContext {
  // Title: first h1 inside article
  const title =
    document.querySelector<HTMLElement>("article h1")?.textContent?.trim() ?? ""

  // Tags: all <a> inside .tags or .content-meta containers
  const tagEls = document.querySelectorAll<HTMLElement>(
    ".tags a, .content-meta .tags a, .tag-list a",
  )
  const tags = Array.from(tagEls)
    .map((el) => el.textContent?.trim() ?? "")
    .filter(Boolean)

  // URL
  const url = window.location.href

  // Article body — clone & strip noise
  let bodyText = ""
  const article = document.querySelector<HTMLElement>("article")
  if (article) {
    const clone = article.cloneNode(true) as HTMLElement
    // Remove noise elements to avoid polluting context
    clone.querySelectorAll(NOISE_SELECTORS).forEach((el) => el.remove())
    // innerText preserves line breaks from <pre><code> blocks
    bodyText = clone.innerText ?? ""
  }

  // Truncate to prevent token overflow
  if (bodyText.length > MAX_BODY_CHARS) {
    bodyText = bodyText.slice(0, MAX_BODY_CHARS) + "…"
  }

  return { title, tags, url, bodyText }
}

/**
 * Build a natural-language context prompt string for the AI system message.
 * Returns empty string if no meaningful context is available (e.g. on the index page).
 */
export function getPageContextPrompt(): string {
  const ctx = getPageContext()
  const parts: string[] = []

  if (ctx.title) {
    parts.push(`文章标题：${ctx.title}`)
  }
  if (ctx.tags.length > 0) {
    parts.push(`标签：${ctx.tags.join("、")}`)
  }
  parts.push(`URL：${ctx.url}`)

  if (ctx.bodyText) {
    parts.push(`\n当前页面正文内容：\n【${ctx.bodyText}】`)
  }

  return parts.join("\n")
}

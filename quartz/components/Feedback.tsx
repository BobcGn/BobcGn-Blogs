import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/feedback.inline"

const feedbackCss = `
.feedback-card {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  background-color: var(--light);
}
.feedback-guide {
  margin-bottom: 1rem;
}
.feedback-title {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
}
.feedback-desc {
  margin: 0 0 1rem;
  color: var(--gray);
  font-size: 0.92rem;
  line-height: 1.6;
}
.feedback-btn {
  display: inline-block;
  padding: 0.55rem 1.2rem;
  background-color: var(--secondary);
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: opacity 0.2s;
}
.feedback-btn:hover {
  opacity: 0.85;
}
.feedback-divider {
  border: none;
  border-top: 1px solid var(--lightgray);
  margin: 1.5rem 0;
}
`.trim()

type Options = {
  repo: `${string}/${string}`
  repoId: string
  issueUrl?: string
  category?: string
  categoryId?: string
}

const defaultOptions: Options = {
  repo: "OWNER/REPO",
  repoId: "",
  category: "General",
  categoryId: "",
}

export default ((opts?: Partial<Options>) => {
  const options = { ...defaultOptions, ...opts }

  const Feedback: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    const issueHref = options.issueUrl ?? `https://github.com/${options.repo}/issues/new/choose`

    return (
      <div class={classNames(displayClass, "feedback-card")}>
        {/* ── 引导区 ── */}
        <div class="feedback-guide">
          <h3 class="feedback-title">💬 互动与反馈</h3>
          <p class="feedback-desc">
            如果您发现了文章错误、有新功能建议，或者想探讨架构问题，推荐通过 Issue
            追踪。如果是日常交流，可以直接在下方留言。
          </p>
          <a class="feedback-btn" href={issueHref} target="_blank" rel="noopener noreferrer">
            🚀 前往 GitHub 提交结构化 Issue
          </a>
        </div>

        {/* ── 分割线 ── */}
        <hr class="feedback-divider" />

        {/* ── Giscus 评论区 ── */}
        <div
          class="giscus"
          data-repo={options.repo}
          data-repo-id={options.repoId}
          data-category={options.category}
          data-category-id={options.categoryId}
          data-mapping="pathname"
          data-strict="1"
          data-reactions-enabled="1"
          data-input-position="bottom"
          data-theme="light"
          data-lang="zh-CN"
          data-loading="lazy"
        ></div>
      </div>
    )
  }

  Feedback.css = feedbackCss
  Feedback.afterDOMLoaded = script

  return Feedback
}) satisfies QuartzComponentConstructor<Options | undefined>

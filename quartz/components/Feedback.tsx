import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

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
`.trim()

type Options = {
  repo: `${string}/${string}`
  issueUrl?: string
}

const defaultOptions: Options = {
  repo: "OWNER/REPO",
}

export default ((opts?: Partial<Options>) => {
  const options = { ...defaultOptions, ...opts }

  const Feedback: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const disableFeedback: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableFeedback) {
      return <></>
    }

    const issueHref = options.issueUrl ?? `https://github.com/${options.repo}/issues/new/choose`

    return (
      <div class={classNames(displayClass, "feedback-card")}>
        <div class="feedback-guide">
          <h3 class="feedback-title">💬 互动与反馈</h3>
          <p class="feedback-desc">
            为了保持最高的技术信噪比，本站未开启常规评论区。如果您发现了文章错漏、有新功能建议，或者想探讨架构问题，欢迎通过提交结构化
            Issue 与我交流。
          </p>
          <a class="feedback-btn" href={issueHref} target="_blank" rel="noopener noreferrer">
            🚀 前往 GitHub 提交结构化 Issue
          </a>
        </div>
      </div>
    )
  }

  Feedback.css = feedbackCss

  return Feedback
}) satisfies QuartzComponentConstructor<Options | undefined>

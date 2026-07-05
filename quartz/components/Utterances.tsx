import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/utterances.inline"

type Options = {
  repo: `${string}/${string}`
  issueTerm?: "pathname" | "url" | "title" | "og:title"
  label?: string
  theme?: string
}

const defaultOptions: Options = {
  repo: "BobcGn/quartz-myblogs",
  issueTerm: "title",
  theme: "preferred-color-scheme",
}

export default ((opts?: Options) => {
  const options = { ...defaultOptions, ...opts }

  const Utterances: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div
        class={classNames(displayClass, "utterances")}
        data-repo={options.repo}
        data-issue-term={options.issueTerm}
        data-label={options.label ?? ""}
        data-theme={options.theme}
      ></div>
    )
  }

  Utterances.afterDOMLoaded = script

  return Utterances
}) satisfies QuartzComponentConstructor<Options | undefined>

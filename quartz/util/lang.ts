export function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

export function classNames(...args: (string | undefined | null | false)[]): string {
  return args.filter(Boolean).join(" ")
}

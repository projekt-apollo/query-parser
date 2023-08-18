type RegExpGroups<
  TCapture extends string,
  TMaybeCapture extends string = string,
> =
  | (RegExpMatchArray & {
      groups?:
        | {[name in TCapture]: string}
        | {[name in TMaybeCapture]?: string}
        | {[key: string]: string}
    })
  | null

export function captureMatch<
  TCapture extends string,
  TMaybeCapture extends string = string,
>(re: RegExp, input: string) {
  const match: RegExpGroups<TCapture, TMaybeCapture> = input.match(re)

  if (!match) {
    throw new Error(`${input} did not match ${re}`)
  }

  if (!match.groups) {
    throw new Error(`${input} matched none of capture groups from ${re}`)
  }

  return match.groups
}

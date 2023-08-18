import {tokenize} from './tokenize'
import {build} from './build'

export function parse(input: string) {
  const tokens = tokenize(input)
  return build(tokens)
}

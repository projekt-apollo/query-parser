import {captureMatch} from './helpers'

type CommaDelimiter = {
  type: 'CommaDelimiter'
  value: string
}

type ExactTerm = {
  type: 'ExactTerm'
  value: string
}

type ColonFilter = {
  type: 'ColonFilter'
  filter: string
  value: string
}

type KeywordTerm = {
  type: 'KeywordTerm'
  value: string
}

export type Token = CommaDelimiter | ExactTerm | ColonFilter | KeywordTerm
type TokenType<TToken extends {type: string}> = TToken['type']

type Re = [RegExp, TokenType<Token> | null]

// the order matters!
const res: Re[] = [
  // Whitespace(s)
  [/^\s+/, null],

  // Comma Delimiter
  [/^,/, 'CommaDelimiter'],

  // Exact String
  [/^(?<quote>['"])(.*?)\k<quote>/, 'ExactTerm'],

  // Colon Filter
  [/^[^\s^:]+:((?<quote>['"])(.*?)\k<quote>|[^\s^,^"^']*)/, 'ColonFilter'],

  // String
  [/^[^\s^,^"^']+/, 'KeywordTerm'],

  // Unmatched Quotes
  [/^["']/, null],
]

export function tokenize(input: string) {
  let cursor = 0
  const tokens: Token[] = []

  // "foo".length = 3
  //  012
  while (cursor < input.length) {
    const string = input.slice(cursor)

    // error on none of RegExps matching
    let hasMatchedBefore = false

    for (const [re, tokenType] of res) {
      const token = (string.match(re) ?? [])[0]

      // did not match, check next one
      if (!token) continue

      // will reach here if at least one match
      hasMatchedBefore = true

      cursor += token.length

      // string should be ignored (e.g. whitespace)
      if (!tokenType) continue

      switch (tokenType) {
        case 'CommaDelimiter': {
          tokens.push({
            type: 'CommaDelimiter',
            value: token,
          })
          break
        }
        case 'ExactTerm': {
          const {exactTerm} = captureMatch<'exactTerm'>(
            /^(?<quote>['"])(?<exactTerm>.*?)\k<quote>/,
            token,
          )
          tokens.push({
            type: 'ExactTerm',
            value: exactTerm,
          })
          break
        }
        case 'ColonFilter': {
          const {filter, quoteValue, stringValue} = captureMatch<
            'filter',
            'quoteValue' | 'stringValue'
          >(
            /^(?<filter>[^\s^:]+):(((?<quote>['"])(?<quoteValue>.*?)\k<quote>)|(?<stringValue>[^\s^,^"^']*))/,
            token,
          )
          const value = quoteValue ?? stringValue ?? ''
          tokens.push({
            type: 'ColonFilter',
            filter,
            value,
          })
          break
        }
        case 'KeywordTerm': {
          tokens.push({
            type: 'KeywordTerm',
            value: token,
          })
          break
        }
        default: {
          throw new Error()
        }
      }

      // matched and pushed to tokens, skip to next bit of string
      break
    }

    if (!hasMatchedBefore) {
      throw new Error(`None of the RegExp matched ${string}`)
    }
  }

  return tokens
}

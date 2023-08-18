type TokenType = 'String' | 'ExactString' | 'ColonFilter' | 'CommaDelimiter'
export type Token = {
  type: TokenType
  value: string
}
export type Tokens = Token[]

type Re = [RegExp, TokenType | null]

// the order matters!
const res: Re[] = [
  // Whitespace(s)
  [/^\s+/, null],

  // CommaDelimiter
  [/^,/, 'CommaDelimiter'],

  // ExactString
  [/^(?<quote>['"])(.*?)\k<quote>/, 'ExactString'],

  // ColonFilter
  [/^[^\s^:]+:((?<quote>['"])(.*?)\k<quote>|[^\s^,]*)/, 'ColonFilter'],

  // String
  [/^[^\s^,^"^']+/, 'String'],

  // Unmatched Quotes
  [/^["']/, null],
]

export class Tokenizer {
  private input: string = ''
  private cursor: number = 0
  private tokens: Tokens = []

  public init(input: string) {
    this.input = input
    this.cursor = 0
    this.tokens = []
  }

  public getTokens() {
    return this.tokens
  }

  public tokenize() {
    // "foo".length = 3
    //  012
    while (this.cursor < this.input.length) {
      const string = this.input.slice(this.cursor)

      // error on none of RegExps matching
      let hasMatchedBefore = false

      for (const [re, tokenType] of res) {
        const match = string.match(re)

        if (!match) {
          continue
        }

        hasMatchedBefore = true

        // advance cursor
        this.cursor += match[0].length

        if (tokenType) {
          this.tokens.push({
            type: tokenType,
            value: match[0],
          })
          break
        } else {
          continue
        }
      }

      if (!hasMatchedBefore) {
        throw new Error(
          `Tokenizer Error: None of the RegExp matched when matching ${string}`,
        )
      }
    }
  }
}

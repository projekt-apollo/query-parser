import {type Token, type Tokens} from './tokenizer'

export type RegExpGroups<T extends string, U extends string = string> =
  | (RegExpMatchArray & {
      groups?:
        | {[name in T]: string}
        | {[name in U]?: string}
        | {[key: string]: string}
    })
  | null

type ColonFilter = {
  type: 'ColonFilter'
  filter: string
  value: string
}
type KeywordTerm = {
  type: 'KeywordTerm'
  value: string
}
type ExactString = {
  type: 'ExactString'
  value: string
}
type CommaDelimiter = {
  type: 'CommaDelimiter'
  value: string
}
type QueryOperator = ColonFilter | KeywordTerm | CommaDelimiter | ExactString
export type Ast = QueryOperator[]

export class Parser {
  private tokens: Tokens = []
  private token: Token | null = null
  private ast: Ast = []

  public init(tokens: Tokens) {
    this.tokens = tokens
    this.ast = []

    // prime initial token
    this.pop()
  }

  public getAst() {
    return this.ast
  }

  public parse() {
    this.ast = this.QueryOperatorList()
  }

  /**
   * QueryOperatorList
   *  : QueryOperator
   *  | QueryOperatorList QueryOperator
   */
  private QueryOperatorList() {
    const queryOperatorList: QueryOperator[] = []

    while (this.token) {
      const queryOperator = this.QueryOperator()
      if (queryOperator) {
        queryOperatorList.push(queryOperator)
      }
    }

    return queryOperatorList
  }

  /**
   * QueryOperator
   *  : KeywordTerm
   *  | ColonFilter
   *  | CommaDelimiter
   */
  private QueryOperator(): QueryOperator | null {
    if (!this.token) {
      return null
    }

    switch (this.token.type) {
      case 'String':
        return this.KeywordTerm()
      case 'ColonFilter':
        return this.ColonFilter()
      case 'CommaDelimiter':
        return this.CommaDelimiter()
      case 'ExactString':
        return this.ExactString()
      default:
        throw new Error('Cannot reach this part of code')
    }
  }

  /**
   * KeywordTerm
   *  : STRING
   */
  private KeywordTerm(): KeywordTerm | null {
    if (!this.token) {
      return null
    }

    const {value} = this.token
    this.pop()

    return {
      type: 'KeywordTerm',
      value,
    }
  }

  /**
   * ExactString
   *  : '"' STRING '"'
   */
  private ExactString(): ExactString | null {
    if (!this.token) {
      return null
    }

    const {value: exactString} = this.token
    const match: RegExpGroups<'string' | 'quote'> = exactString.match(
      /^(?<quote>['"])(?<string>.*?)\k<quote>/,
    )

    if (!match?.groups) {
      throw new Error('Cannot reach this part of code')
    }

    const string = match.groups.string
    this.pop()

    return {type: 'ExactString', value: string}
  }

  /**
   * ColonFilter
   *  : STRING ':' STRING
   *  | STRING ':'
   *  | STRING ':"' STRING '"'
   */
  private ColonFilter(): ColonFilter | null {
    if (!this.token) {
      return null
    }

    const {value: string} = this.token
    this.pop()

    const match: RegExpGroups<
      'filter' | 'quote',
      'quoteValue' | 'stringValue'
    > = string.match(
      /^(?<filter>[^\s^:]+):(((?<quote>['"])(?<quoteValue>.*?)\k<quote>)|(?<stringValue>[^\s^,]*))/,
    )

    if (!match?.groups) {
      throw new Error('Cannot reach this part of code')
    }

    const {filter, quoteValue, stringValue} = match.groups

    const value = quoteValue ?? stringValue ?? ''

    return {
      type: 'ColonFilter',
      filter,
      value,
    }
  }

  /**
   * CommaDelimiter
   *  : ','
   */
  private CommaDelimiter(): CommaDelimiter | null {
    if (!this.token) {
      return null
    }

    const {value} = this.token
    this.pop()

    return {
      type: 'CommaDelimiter',
      value,
    }
  }

  private pop() {
    this.token = this.tokens.shift() ?? null
  }
}

import {type Token, type Tokens} from './tokenizer'

type ColonFilter = {
  type: 'ColonFilter'
  filter: string
  value: string
}
type KeywordTerm = {
  type: 'KeywordTerm'
  value: string
}
type CommaDelimeter = {
  type: 'CommaDelimeter'
  value: string
}
type QueryOperator = ColonFilter | KeywordTerm | CommaDelimeter
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
   *  | CommaDelimeter
   */
  private QueryOperator(): KeywordTerm | ColonFilter | CommaDelimeter | null {
    if (!this.token) {
      return null
    }

    switch (this.token.type) {
      case 'String':
        return this.KeywordTerm()
      case 'ColonFilter':
        return this.ColonFilter()
      case 'CommaDelimeter':
        return this.CommaDelimeter()
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
   * ColonFilter
   *  : STRING ':' STRING
   *  : STRING ':'
   */
  private ColonFilter(): ColonFilter | null {
    if (!this.token) {
      return null
    }

    const {value: string} = this.token
    this.pop()

    const [, filter] = string.match(/([^\s^:]+):/) ?? []
    const [, value] = string.match(/:([^\s]*)/) ?? []

    return {
      type: 'ColonFilter',
      filter,
      value,
    }
  }

  /**
   * CommaDelimeter
   *  : ','
   */
  private CommaDelimeter(): CommaDelimeter | null {
    if (!this.token) {
      return null
    }

    const {value} = this.token
    this.pop()

    return {
      type: 'CommaDelimeter',
      value,
    }
  }

  private pop() {
    this.token = this.tokens.shift() ?? null
  }
}

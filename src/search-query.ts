import {Tokenizer} from './tokenizer'
import {Parser, type Ast} from './parser'
import {Builder, type Query} from './builder'

export class SearchQuery {
  private tokenizer: Tokenizer
  private parser: Parser
  private builder: Builder

  private ast: Ast | null
  private query: Query | null

  public constructor(input?: string) {
    this.tokenizer = new Tokenizer()
    this.parser = new Parser()
    this.builder = new Builder()

    this.ast = null
    this.query = null

    if (typeof input === 'string') {
      this.parse(input)
    }
  }

  public parse(input: string) {
    this.tokenizer.init(input)
    this.tokenizer.tokenize()
    const tokens = this.tokenizer.getTokens()
    this.parser.init(tokens)
    this.parser.parse()
    this.ast = this.parser.getAst()
    this.builder.init(this.ast)
    this.builder.build()
    this.query = this.builder.getQuery()
  }

  public getAst() {
    if (!this.ast) {
      throw new Error('Must parse input first')
    }

    return this.ast
  }

  public getQuery() {
    if (!this.query) {
      throw new Error('Must parse input first')
    }

    return this.query
  }
}

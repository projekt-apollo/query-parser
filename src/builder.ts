import {type Ast} from './parser'

type QueryFilter = {
  filter: 'keyword' | string
  value: string
}
export type Query = QueryFilter[]

export class Builder {
  private ast: Ast = []
  private query: Query = []

  public init(ast: Ast) {
    this.ast = ast
    this.query = []
  }

  public getQuery() {
    return this.query
  }

  public build() {
    let separateNextKeyword = true

    for (const node of this.ast) {
      switch (node.type) {
        case 'CommaDelimiter':
          separateNextKeyword = true
          break
        case 'ColonFilter':
          this.query.push({
            // all filter operators are lowercased
            filter: node.filter.toLowerCase(),
            value: node.value,
          })
          separateNextKeyword = true
          break
        case 'ExactString':
          this.query.push({
            filter: 'exact',
            value: node.value,
          })
          separateNextKeyword = true
          break
        case 'KeywordTerm':
          if (separateNextKeyword) {
            this.query.push({
              filter: 'keyword',
              value: node.value,
            })
          } else {
            this.appendToLastKeyword(node.value)
          }
          separateNextKeyword = false
          break
        default:
          throw new Error('Cannot reach this part of code')
      }
    }
  }

  private appendToLastKeyword(keyword: string) {
    for (const queryFilter of this.query.reverse()) {
      if (queryFilter.filter === 'keyword') {
        queryFilter.value += ` ${keyword}`
        break
      }
    }
  }
}

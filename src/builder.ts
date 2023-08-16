import {type QueryOperator} from './parser'

export type QueryFilter = {
  filter: 'keyword' | string
  value: string
}

export class Builder {
  private ast: QueryOperator[] = []
  private query: QueryFilter[] = []

  public init(ast: QueryOperator[]) {
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
        case 'CommaDelimeter':
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

import {type Tokens} from './tokenize'

export type QueryFilter = {
  filter: 'keyword' | 'exact' | string
  value: string
}

export type Query = QueryFilter[]

// warning: function has side effects
function appendToLastKeyword(query: Query, keyTerm: string) {
  for (const queryFilter of query.reverse()) {
    if (queryFilter.filter === 'keyword') {
      queryFilter.value += ` ${keyTerm}`
      break
    }
  }
}

export function build(tokens: Tokens) {
  const query: Query = []
  let separateNextKeyword = true

  for (const token of tokens) {
    switch (token.type) {
      case 'CommaDelimiter': {
        separateNextKeyword = true
        break
      }
      case 'ExactTerm': {
        query.push({
          filter: 'exact',
          value: token.value,
        })
        separateNextKeyword = true
        break
      }
      case 'ColonFilter': {
        query.push({
          filter: token.filter.toLowerCase(),
          value: token.value,
        })
        separateNextKeyword = true
        break
      }
      case 'KeywordTerm': {
        if (separateNextKeyword) {
          query.push({
            filter: 'keyword',
            value: token.value,
          })
        } else {
          appendToLastKeyword(query, token.value)
        }
        separateNextKeyword = false
        break
      }
      default: {
        throw new Error('Cannot reach this part of code')
      }
    }
  }

  return query
}

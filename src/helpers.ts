import {SearchQuery} from './search-query'

export function getAst(input: string) {
  const sq = new SearchQuery(input)
  return sq.getAst()
}

export function getQuery(input: string) {
  const sq = new SearchQuery(input)
  return sq.getQuery()
}

import {type Ast} from '../src/parser'
import {type Query} from '../src/builder'
import {SearchQuery} from '../src/search-query'

test('generate ast and query from input', () => {
  const input = `tag:japan tea, maccha "green"`
  const ast: Ast = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'CommaDelimiter', value: ','},
    {type: 'KeywordTerm', value: 'maccha'},
    {type: 'ExactString', value: 'green'},
  ]
  const query: Query = [
    {filter: 'tag', value: 'japan'},
    {filter: 'keyword', value: 'tea'},
    {filter: 'keyword', value: 'maccha'},
    {filter: 'exact', value: 'green'},
  ]

  const sq = new SearchQuery()
  sq.parse(input)

  expect(sq.getAst()).toEqual(ast)
  expect(sq.getQuery()).toEqual(query)
})

test('lifecycle for constructor without input', () => {
  const input1 = 'japan'
  const ast1: Ast = [{type: 'KeywordTerm', value: 'japan'}]
  const query1: Query = [{filter: 'keyword', value: 'japan'}]
  const input2 = 'project:apollo'
  const ast2: Ast = [{type: 'ColonFilter', filter: 'project', value: 'apollo'}]
  const query2: Query = [{filter: 'project', value: 'apollo'}]

  const sq = new SearchQuery()
  sq.parse(input1)
  expect(sq.getAst()).toEqual(ast1)
  expect(sq.getQuery()).toEqual(query1)
  sq.parse(input2)
  expect(sq.getAst()).toEqual(ast2)
  expect(sq.getQuery()).toEqual(query2)
})

test('lifecycle for constructor input', () => {
  const input1 = 'japan'
  const ast1: Ast = [{type: 'KeywordTerm', value: 'japan'}]
  const query1: Query = [{filter: 'keyword', value: 'japan'}]
  const input2 = 'project:apollo'
  const ast2: Ast = [{type: 'ColonFilter', filter: 'project', value: 'apollo'}]
  const query2: Query = [{filter: 'project', value: 'apollo'}]

  const sq = new SearchQuery(input1)
  expect(sq.getAst()).toEqual(ast1)
  expect(sq.getQuery()).toEqual(query1)
  sq.parse(input2)
  expect(sq.getAst()).toEqual(ast2)
  expect(sq.getQuery()).toEqual(query2)
})

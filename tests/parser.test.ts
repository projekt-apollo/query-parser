import {Parser, type Token, type QueryOperator} from '../src/parser'

test('parse empty input', () => {
  const input: Token[] = []
  const result: QueryOperator[] = []

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse keyword term', () => {
  const input: Token[] = [{type: 'String', value: 'tea'}]
  const result: QueryOperator[] = [{type: 'KeywordTerm', value: 'tea'}]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse colon filter', () => {
  const input: Token[] = [{type: 'ColonFilter', value: 'tag:japan'}]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
  ]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse empty colon filter', () => {
  const input: Token[] = [{type: 'ColonFilter', value: 'tag:'}]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: ''},
  ]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse colon filter with colon value', () => {
  const input: Token[] = [{type: 'ColonFilter', value: 'tag::japan'}]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: ':japan'},
  ]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse comma delimeter', () => {
  const input: Token[] = [{type: 'CommaDelimeter', value: ','}]
  const result: QueryOperator[] = [{type: 'CommaDelimeter', value: ','}]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse sequence of keyword terms', () => {
  const input: Token[] = [
    {type: 'String', value: 'tea'},
    {type: 'String', value: 'maccha'},
  ]
  const result: QueryOperator[] = [
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'KeywordTerm', value: 'maccha'},
  ]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse sequence of colon filter and keyword term', () => {
  const input: Token[] = [
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'String', value: 'tea'},
  ]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'tea'},
  ]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

test('parse sequence of colon filter, keyword term, comma delimeter, and keyword term', () => {
  const input: Token[] = [
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'String', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'String', value: 'maccha'},
  ]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'KeywordTerm', value: 'maccha'},
  ]

  const parser = new Parser()
  parser.init(input)

  expect(parser.parse()).toEqual(result)
})

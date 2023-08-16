import {type Token} from '../src/tokenizer'
import {Parser, type QueryOperator} from '../src/parser'

function parse(input: Token[]) {
  const parser = new Parser()
  parser.init(input)
  parser.parse()
  return parser.getAst()
}

test('parse empty input', () => {
  const input: Token[] = []
  const result: QueryOperator[] = []

  expect(parse(input)).toEqual(result)
})

test('parse string', () => {
  const input: Token[] = [{type: 'String', value: 'tea'}]
  const result: QueryOperator[] = [{type: 'KeywordTerm', value: 'tea'}]

  expect(parse(input)).toEqual(result)
})

test('parse colon filter', () => {
  const input: Token[] = [{type: 'ColonFilter', value: 'tag:japan'}]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
  ]

  expect(parse(input)).toEqual(result)
})

test('parse empty colon filter', () => {
  const input: Token[] = [{type: 'ColonFilter', value: 'tag:'}]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: ''},
  ]

  expect(parse(input)).toEqual(result)
})

test('parse colon filter with colon value', () => {
  const input: Token[] = [{type: 'ColonFilter', value: 'tag::japan'}]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: ':japan'},
  ]

  expect(parse(input)).toEqual(result)
})

test('parse comma delimeter', () => {
  const input: Token[] = [{type: 'CommaDelimeter', value: ','}]
  const result: QueryOperator[] = [{type: 'CommaDelimeter', value: ','}]

  expect(parse(input)).toEqual(result)
})

test('parse sequence of strings', () => {
  const input: Token[] = [
    {type: 'String', value: 'tea'},
    {type: 'String', value: 'maccha'},
  ]
  const result: QueryOperator[] = [
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'KeywordTerm', value: 'maccha'},
  ]

  expect(parse(input)).toEqual(result)
})

test('parse sequence of colon filter and string', () => {
  const input: Token[] = [
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'String', value: 'tea'},
  ]
  const result: QueryOperator[] = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'tea'},
  ]

  expect(parse(input)).toEqual(result)
})

test('parse sequence of colon filter, string, comma delimeter, and string', () => {
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

  expect(parse(input)).toEqual(result)
})

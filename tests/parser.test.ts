import {type Tokens} from '../src/tokenizer'
import {Parser, type Ast} from '../src/parser'

function parse(input: Tokens) {
  const parser = new Parser()
  parser.init(input)
  parser.parse()
  return parser.getAst()
}

test('parse empty input', () => {
  const input: Tokens = []
  const result: Ast = []

  expect(parse(input)).toEqual(result)
})

test('parse string', () => {
  const input: Tokens = [{type: 'String', value: 'tea'}]
  const result: Ast = [{type: 'KeywordTerm', value: 'tea'}]

  expect(parse(input)).toEqual(result)
})

test('parse colon filter', () => {
  const input: Tokens = [{type: 'ColonFilter', value: 'tag:japan'}]
  const result: Ast = [{type: 'ColonFilter', filter: 'tag', value: 'japan'}]

  expect(parse(input)).toEqual(result)
})

test('parse empty colon filter', () => {
  const input: Tokens = [{type: 'ColonFilter', value: 'tag:'}]
  const result: Ast = [{type: 'ColonFilter', filter: 'tag', value: ''}]

  expect(parse(input)).toEqual(result)
})

test('parse colon filter with colon value', () => {
  const input: Tokens = [{type: 'ColonFilter', value: 'tag::japan'}]
  const result: Ast = [{type: 'ColonFilter', filter: 'tag', value: ':japan'}]

  expect(parse(input)).toEqual(result)
})

test('parse comma delimeter', () => {
  const input: Tokens = [{type: 'CommaDelimeter', value: ','}]
  const result: Ast = [{type: 'CommaDelimeter', value: ','}]

  expect(parse(input)).toEqual(result)
})

test('parse sequence of strings', () => {
  const input: Tokens = [
    {type: 'String', value: 'tea'},
    {type: 'String', value: 'maccha'},
  ]
  const result: Ast = [
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'KeywordTerm', value: 'maccha'},
  ]

  expect(parse(input)).toEqual(result)
})

test('parse sequence of colon filter and string', () => {
  const input: Tokens = [
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'String', value: 'tea'},
  ]
  const result: Ast = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'tea'},
  ]

  expect(parse(input)).toEqual(result)
})

test('parse sequence of colon filter, string, comma delimeter, and string', () => {
  const input: Tokens = [
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'String', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'String', value: 'maccha'},
  ]
  const result: Ast = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'KeywordTerm', value: 'maccha'},
  ]

  expect(parse(input)).toEqual(result)
})

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

test('parse exact string', () => {
  const input: Tokens = [{type: 'ExactString', value: `"typescript"`}]
  const result: Ast = [{type: 'ExactString', value: 'typescript'}]

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

test('parse empty colon filter with whitespace delimited value', () => {
  const input: Tokens = [{type: 'ColonFilter', value: `tag:"ux design"`}]
  const result: Ast = [{type: 'ColonFilter', filter: 'tag', value: `ux design`}]

  expect(parse(input)).toEqual(result)
})

test('parse colon filter with colon value', () => {
  const input: Tokens = [{type: 'ColonFilter', value: 'tag::japan'}]
  const result: Ast = [{type: 'ColonFilter', filter: 'tag', value: ':japan'}]

  expect(parse(input)).toEqual(result)
})

test('parse comma delimiter', () => {
  const input: Tokens = [{type: 'CommaDelimiter', value: ','}]
  const result: Ast = [{type: 'CommaDelimiter', value: ','}]

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

test('parse sequence of colon filter, string, comma delimiter, and string', () => {
  const input: Tokens = [
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'String', value: 'tea'},
    {type: 'CommaDelimiter', value: ','},
    {type: 'String', value: 'maccha'},
  ]
  const result: Ast = [
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'CommaDelimiter', value: ','},
    {type: 'KeywordTerm', value: 'maccha'},
  ]

  expect(parse(input)).toEqual(result)
})

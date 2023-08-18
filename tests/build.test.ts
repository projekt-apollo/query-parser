import {type Tokens} from '../src/tokenize'
import {build, type Query} from '../src/build'

test('build empty tokens', () => {
  const input: Tokens = []
  const result: Query = []

  expect(build(input)).toEqual(result)
})

test('ignore comma delimiter', () => {
  const input: Tokens = [{type: 'CommaDelimiter', value: `,`}]
  const result: Query = []

  expect(build(input)).toEqual(result)
})

test('build exact term', () => {
  const input: Tokens = [{type: 'ExactTerm', value: `regex`}]
  const result: Query = [{filter: `exact`, value: `regex`}]

  expect(build(input)).toEqual(result)
})

test('build colon filter', () => {
  const input: Tokens = [
    {type: 'ColonFilter', filter: `tag`, value: `typescript`},
  ]
  const result: Query = [{filter: `tag`, value: `typescript`}]

  expect(build(input)).toEqual(result)
})

test('build keyword term', () => {
  const input: Tokens = [{type: 'KeywordTerm', value: `tea`}]
  const result: Query = [{filter: `keyword`, value: `tea`}]

  expect(build(input)).toEqual(result)
})

test('build multiple keyword terms', () => {
  const input: Tokens = [
    {type: 'KeywordTerm', value: `tea`},
    {type: 'KeywordTerm', value: `maccha`},
  ]
  const result: Query = [{filter: `keyword`, value: `tea maccha`}]

  expect(build(input)).toEqual(result)
})

test('build keyword terms delimited by comma delimiter', () => {
  const input: Tokens = [
    {type: 'KeywordTerm', value: `tea`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'KeywordTerm', value: `maccha`},
  ]
  const result: Query = [
    {filter: `keyword`, value: `tea`},
    {filter: `keyword`, value: `maccha`},
  ]

  expect(build(input)).toEqual(result)
})

test('build sequence of keyword term, colon filter, keyword term, followed by exact term delimited by comma delimiters', () => {
  const input: Tokens = [
    {type: 'KeywordTerm', value: `regex`},
    {type: 'ColonFilter', filter: `language`, value: `javascript`},
    {type: 'KeywordTerm', value: `class`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ExactTerm', value: `types`},
  ]
  const result: Query = [
    {filter: `keyword`, value: `regex`},
    {filter: `language`, value: `javascript`},
    {filter: `keyword`, value: `class`},
    {filter: `exact`, value: `types`},
  ]

  expect(build(input)).toEqual(result)
})

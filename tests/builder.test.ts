import {type Ast} from '../src/parser'
import {Builder, type Query} from '../src/builder'

function build(input: Ast) {
  const builder = new Builder()
  builder.init(input)
  builder.build()
  return builder.getQuery()
}

test('build empty ast', () => {
  const input: Ast = []
  const result: Query = []

  expect(build(input)).toEqual(result)
})

test('build colon filter', () => {
  const input: Ast = [{type: 'ColonFilter', filter: 'tag', value: 'japan'}]
  const result: Query = [{filter: 'tag', value: 'japan'}]

  expect(build(input)).toEqual(result)
})

test('build colon filter and lowercase filter', () => {
  const input: Ast = [{type: 'ColonFilter', filter: 'TAG', value: 'japan'}]
  const result: Query = [{filter: 'tag', value: 'japan'}]

  expect(build(input)).toEqual(result)
})

test('build keyword term', () => {
  const input: Ast = [{type: 'KeywordTerm', value: 'tea'}]
  const result: Query = [{filter: 'keyword', value: 'tea'}]

  expect(build(input)).toEqual(result)
})

test('build multiple keyword terms', () => {
  const input: Ast = [
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'KeywordTerm', value: 'maccha'},
  ]
  const result: Query = [{filter: 'keyword', value: 'tea maccha'}]

  expect(build(input)).toEqual(result)
})

test('builder keyword terms delimeted by comma', () => {
  const input: Ast = [
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'KeywordTerm', value: 'maccha'},
  ]
  const result: Query = [
    {filter: 'keyword', value: 'tea'},
    {filter: 'keyword', value: 'maccha'},
  ]

  expect(build(input)).toEqual(result)
})

test('builder keyword terms delimeted by colon filter', () => {
  const input: Ast = [
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'maccha'},
  ]
  const result: Query = [
    {filter: 'keyword', value: 'tea'},
    {filter: 'tag', value: 'japan'},
    {filter: 'keyword', value: 'maccha'},
  ]

  expect(build(input)).toEqual(result)
})

test('builder keyword terms delimeted by commas and colon filter', () => {
  const input: Ast = [
    {type: 'CommaDelimeter', value: ','},
    {type: 'KeywordTerm', value: 'green'},
    {type: 'KeywordTerm', value: 'tea'},
    {type: 'ColonFilter', filter: 'tag', value: 'japan'},
    {type: 'KeywordTerm', value: 'maccha'},
  ]
  const result: Query = [
    {filter: 'keyword', value: 'green tea'},
    {filter: 'tag', value: 'japan'},
    {filter: 'keyword', value: 'maccha'},
  ]

  expect(build(input)).toEqual(result)
})

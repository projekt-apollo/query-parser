import {Tokenizer, type Token} from '../src/tokenizer'

function tokenize(input: string) {
  const tokenizer = new Tokenizer()
  tokenizer.init(input)
  tokenizer.tokenize()
  return tokenizer.getTokens()
}

test('tokenize empty input', () => {
  const input = ''
  const result: Token[] = []

  expect(tokenize(input)).toEqual(result)
})

test('tokenize whitespace', () => {
  const input = '  '
  const result: Token[] = []

  expect(tokenize(input)).toEqual(result)
})

test('tokenize comma delimeter', () => {
  const input = ','
  const result: Token[] = [{type: 'CommaDelimeter', value: ','}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize string', () => {
  const input = 'tea'
  const result: Token[] = [{type: 'String', value: 'tea'}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize string post-colon', () => {
  const input = ':tag'
  const result: Token[] = [{type: 'String', value: ':tag'}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize string surrounded by whitespace', () => {
  const input = '  tea  '
  const result: Token[] = [{type: 'String', value: 'tea'}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize strings delimeted by colon', () => {
  const input = ',tea, maccha'
  const result: Token[] = [
    {type: 'CommaDelimeter', value: ','},
    {type: 'String', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'String', value: 'maccha'},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter', () => {
  const input = 'tag:japan'
  const result: Token[] = [{type: 'ColonFilter', value: 'tag:japan'}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter with colon value', () => {
  const input = 'tag::japan'
  const result: Token[] = [{type: 'ColonFilter', value: 'tag::japan'}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter surrounded by whitespace', () => {
  const input = '  tag:japan  '
  const result: Token[] = [{type: 'ColonFilter', value: 'tag:japan'}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filters delimeted by colon', () => {
  const input = ',tag:japan tag:drinks,'
  const result: Token[] = [
    {type: 'CommaDelimeter', value: ','},
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'ColonFilter', value: 'tag:drinks'},
    {type: 'CommaDelimeter', value: ','},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize sequence of colon filters, string, comma delimeter, followed by string', () => {
  const input = 'tag:japan tag:drinks tea, maccha'
  const result: Token[] = [
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'ColonFilter', value: 'tag:drinks'},
    {type: 'String', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'String', value: 'maccha'},
  ]

  expect(tokenize(input)).toEqual(result)
})

import {Tokenizer, type Token} from '../src/tokenizer'

function tokenize(input: string) {
  const tokenizer = new Tokenizer()
  tokenizer.init(input)
  tokenizer.tokenize()
  return tokenizer.getTokens()
}

test('tokenize empty input', () => {
  const input = ``
  const result: Token[] = []

  expect(tokenize(input)).toEqual(result)
})

test('ignore whitespace', () => {
  const input = `  `
  const result: Token[] = []

  expect(tokenize(input)).toEqual(result)
})

test('tokenize comma delimiter', () => {
  const input = `,`
  const result: Token[] = [{type: 'CommaDelimiter', value: `,`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize string', () => {
  const input = `tea`
  const result: Token[] = [{type: 'String', value: `tea`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize string post-colon', () => {
  const input = `:tag`
  const result: Token[] = [{type: 'String', value: `:tag`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize string surrounded by whitespace', () => {
  const input = `  tea  `
  const result: Token[] = [{type: 'String', value: `tea`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize unmatching exact string as string', () => {
  const input = `"typescript'`
  const result: Token[] = [{type: 'String', value: `"typescript'`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact string', () => {
  const input = `"typescript"`
  const result: Token[] = [{type: 'ExactString', value: `"typescript"`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact string containing whitespace', () => {
  const input = `"hello world"`
  const result: Token[] = [{type: 'ExactString', value: `"hello world"`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact string surrounded by space', () => {
  const input = `  "javascript"  `
  const result: Token[] = [{type: 'ExactString', value: `"javascript"`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter', () => {
  const input = `tag:japan`
  const result: Token[] = [{type: 'ColonFilter', value: `tag:japan`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter with exact string value', () => {
  const input = `tag:"software development"`
  const result: Token[] = [
    {type: 'ColonFilter', value: `tag:"software development"`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter with colon value', () => {
  const input = `tag::japan`
  const result: Token[] = [{type: 'ColonFilter', value: `tag::japan`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter surrounded by whitespace', () => {
  const input = `  tag:japan  `
  const result: Token[] = [{type: 'ColonFilter', value: `tag:japan`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize strings delimited by colon', () => {
  const input = `,tea, maccha`
  const result: Token[] = [
    {type: 'CommaDelimiter', value: `,`},
    {type: 'String', value: `tea`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'String', value: `maccha`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact strings delimited by colon', () => {
  const input = `,"typescript", "javascript"`
  const result: Token[] = [
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ExactString', value: `"typescript"`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ExactString', value: `"javascript"`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filters delimited by colon', () => {
  const input = `,tag:japan tag:drinks,`
  const result: Token[] = [
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ColonFilter', value: `tag:japan`},
    {type: 'ColonFilter', value: `tag:drinks`},
    {type: 'CommaDelimiter', value: `,`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize sequence of colon filters, exact string, comma delimiter, followed by string', () => {
  const input = `tag:japan tag:drinks "tea", maccha`
  const result: Token[] = [
    {type: 'ColonFilter', value: `tag:japan`},
    {type: 'ColonFilter', value: `tag:drinks`},
    {type: 'ExactString', value: `"tea"`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'String', value: `maccha`},
  ]

  expect(tokenize(input)).toEqual(result)
})

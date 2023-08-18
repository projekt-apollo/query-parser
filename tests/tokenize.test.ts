import {tokenize, type Token} from '../src/tokenize'

test('tokenize empty input', () => {
  const input = ``
  const result: Token[] = []

  expect(tokenize(input)).toEqual(result)
})

test('ignore whitespace', () => {
  const input = ``
  const result: Token[] = []

  expect(tokenize(input)).toEqual(result)
})

test('ignore unmatching quote', () => {
  const input = `'`
  const result: Token[] = []

  expect(tokenize(input)).toEqual(result)
})

test('tokenize comma delimiter', () => {
  const input = `,`
  const result: Token[] = [{type: 'CommaDelimiter', value: `,`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize keyword term', () => {
  const input = `tea`
  const result: Token[] = [{type: 'KeywordTerm', value: `tea`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize keyword term surrounded by whitespace', () => {
  const input = `  tea  `
  const result: Token[] = [{type: 'KeywordTerm', value: `tea`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize keyword term following colon', () => {
  const input = `:tea`
  const result: Token[] = [{type: 'KeywordTerm', value: `:tea`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize keyword term following unmatching quote', () => {
  const input = `"typescript`
  const result: Token[] = [{type: 'KeywordTerm', value: `typescript`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize keyword term surrounded by unmatching quotes', () => {
  const input = `"typescript'`
  const result: Token[] = [{type: 'KeywordTerm', value: `typescript`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact term', () => {
  const input = `"typescript"`
  const result: Token[] = [{type: 'ExactTerm', value: `typescript`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact term followed by keyword term', () => {
  const input = `"typescript"language`
  const result: Token[] = [
    {type: 'ExactTerm', value: `typescript`},
    {type: 'KeywordTerm', value: `language`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact term following keyword term', () => {
  const input = `language"typescript"`
  const result: Token[] = [
    {type: 'KeywordTerm', value: `language`},
    {type: 'ExactTerm', value: `typescript`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact term containing single quote', () => {
  const input = `"single'quote"`
  const result: Token[] = [{type: 'ExactTerm', value: `single'quote`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact term containing space', () => {
  const input = `"hello world"`
  const result: Token[] = [{type: 'ExactTerm', value: `hello world`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact term surrounded by whitespace', () => {
  const input = `  "typescript"  `
  const result: Token[] = [{type: 'ExactTerm', value: `typescript`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter', () => {
  const input = `tag:japan`
  const result: Token[] = [{type: 'ColonFilter', filter: `tag`, value: `japan`}]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter with exact term value', () => {
  const input = `tag:"software development"`
  const result: Token[] = [
    {type: 'ColonFilter', filter: `tag`, value: `software development`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter with colon value', () => {
  const input = `tag::smile:`
  const result: Token[] = [
    {type: 'ColonFilter', filter: `tag`, value: `:smile:`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter following unmatching exact term', () => {
  const input = `tag:"japan'`
  const result: Token[] = [
    {type: 'ColonFilter', filter: `tag`, value: ``},
    {type: 'KeywordTerm', value: `japan`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filter surrounded by whitespace', () => {
  const input = `  tag:javascript  `
  const result: Token[] = [
    {type: 'ColonFilter', filter: `tag`, value: `javascript`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize keyword terms delimited by comma delimiters', () => {
  const input = `,tea, maccha`
  const result: Token[] = [
    {type: 'CommaDelimiter', value: `,`},
    {type: 'KeywordTerm', value: `tea`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'KeywordTerm', value: `maccha`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize exact terms delimited by comma delimiters', () => {
  const input = `,"typescript", "javascript"`
  const result: Token[] = [
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ExactTerm', value: `typescript`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ExactTerm', value: `javascript`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize colon filters delimited by comma delimiters', () => {
  const input = `,tag:japan, tag:drinks,`
  const result: Token[] = [
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ColonFilter', filter: `tag`, value: `japan`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ColonFilter', filter: `tag`, value: `drinks`},
    {type: 'CommaDelimiter', value: `,`},
  ]

  expect(tokenize(input)).toEqual(result)
})

test('tokenize sequence of colon filters, exact term, followed by keyword terms delimited by comma delimiters', () => {
  const input = `language:javascript tag:regex, "escape" character, class`
  const result: Token[] = [
    {type: 'ColonFilter', filter: `language`, value: `javascript`},
    {type: 'ColonFilter', filter: `tag`, value: `regex`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'ExactTerm', value: `escape`},
    {type: 'KeywordTerm', value: `character`},
    {type: 'CommaDelimiter', value: `,`},
    {type: 'KeywordTerm', value: `class`},
  ]

  expect(tokenize(input)).toEqual(result)
})

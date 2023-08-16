import {Tokenizer, type Token} from '../src/tokenizer'

test('tokenize empty input', () => {
  const input = ''
  const result: Token[] = []

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize whitespace', () => {
  const input = '  '
  const result: Token[] = []

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize comma delimeter', () => {
  const input = ','
  const result: Token[] = [{type: 'CommaDelimeter', value: ','}]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize string', () => {
  const input = 'tea'
  const result: Token[] = [{type: 'String', value: 'tea'}]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize string post-colon', () => {
  const input = ':tag'
  const result: Token[] = [{type: 'String', value: ':tag'}]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize string surrounded by whitespace', () => {
  const input = '  tea  '
  const result: Token[] = [{type: 'String', value: 'tea'}]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize strings delimeted by colon', () => {
  const input = ',tea, maccha'
  const result: Token[] = [
    {type: 'CommaDelimeter', value: ','},
    {type: 'String', value: 'tea'},
    {type: 'CommaDelimeter', value: ','},
    {type: 'String', value: 'maccha'},
  ]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize colon filter', () => {
  const input = 'tag:japan'
  const result: Token[] = [{type: 'ColonFilter', value: 'tag:japan'}]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize colon filter with colon value', () => {
  const input = 'tag::japan'
  const result: Token[] = [{type: 'ColonFilter', value: 'tag::japan'}]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize colon filter surrounded by whitespace', () => {
  const input = '  tag:japan  '
  const result: Token[] = [{type: 'ColonFilter', value: 'tag:japan'}]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

test('tokenize colon filters delimeted by colon', () => {
  const input = ',tag:japan tag:drinks,'
  const result: Token[] = [
    {type: 'CommaDelimeter', value: ','},
    {type: 'ColonFilter', value: 'tag:japan'},
    {type: 'ColonFilter', value: 'tag:drinks'},
    {type: 'CommaDelimeter', value: ','},
  ]

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
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

  const tokenizer = new Tokenizer()
  tokenizer.init(input)

  expect(tokenizer.tokenize()).toEqual(result)
})

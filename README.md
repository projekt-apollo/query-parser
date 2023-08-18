# query-parser

A lightweight TypeScript library for parsing simple search syntax into a
structured AST and query object, inspired by Gmail, GitHub, and Discord query
systems.

## Installation

```bash
npm install @projekt-apollo/query-parser
```

## Usage

```ts
import {parse} from '@projekt-apollo/query-parser'

const query = parse(`tag:language "typescript" regex, class`)
/* => [
  {filter: 'tag', value: 'language'},
  {filter: 'exact', value: 'typescript'},
  {filter: 'keyword', value: 'regex'},
  {filter: 'keyword', value: 'class'},
] */
```

### `tokenize(input: string): Tokens`

```ts
const tokens = tokenize(`tag:language "typescript" regex, class`)
/* => [
  { type: 'ColonFilter', filter: 'tag', value: 'language' },
  { type: 'ExactTerm', value: 'typescript' },
  { type: 'KeywordTerm', value: 'regex' },
  { type: 'CommaDelimiter', value: ',' },
  { type: 'KeywordTerm', value: 'class' },
];
] */
```

### `build(tokens: Tokens): Query`

```ts
const query = build(tokens)
/* => [
  {filter: 'tag', value: 'language'},
  {filter: 'exact', value: 'typescript'},
  {filter: 'keyword', value: 'regex'},
  {filter: 'keyword', value: 'class'},
] */
```

### `parse(input: string): Query`

Combines the `tokenize` and `build` functions. Accepts a string and returns a
`Query` array.

### Syntax

The `Query` object is an array of `QueryFilter` objects. Each `QueryFilter`
represents a filter constraint for a particular query on some property. For
example this is a `QueryFilter` that filters on a property of `language` with
the value `typescript`:

```
{filter: 'language', value: 'typescript'}
```

The `QueryFilter` above is represented using the following syntax:

```
language:typescript
```

A query syntax without the colon operator is a shorthand for a `QueryFilter`
with the filter value set to `keyword`:

```
javascript => {filter: 'keyword', value: 'javascript'}
```

Likewise, a query syntax that surrounds a string with single or double quotes is
a shorthand for a `QueryFilter` with the filter value set to `exact`:

```
"regex" => {filter: 'exact', value: 'regex'}
```

This quote syntax can also be used for a filter value containing whitespace(s):

```
tag:"ux design" => {filter: 'tag', value: 'ux design'}
```

## Contributing

This project is not currently open to pull requests. But for bugs and
suggestions, please feel free to open an issue.

## Acknowledgment

Thank you to the authors of the following libraries for inspiration.

- [search-query-parser](https://github.com/nepsilon/search-query-parser)
- [n-search-parser](https://github.com/Financial-Times/n-search-parser)

## License

MIT

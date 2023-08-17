# query-parser

A lightweight TypeScript library for parsing simple search syntax into a
structured AST and query object, inspired by Gmail, GitHub, and Discord query
systems.

## Installation

```bash
npm install @projekt-apollo/query-parser
```

## Usage

### Object-Oriented Usage (OOP)

```ts
import {SearchQuery} from '@projekt-apollo/query-parser'

const sq = new SearchQuery('tag:japan tea, maccha')

const ast = sq.getAst()
/* => [
  {type: 'ColonFilter', filter: 'tag', value: 'japan'},
  {type: 'KeywordTerm', value: 'tea'},
  {type: 'CommaDelimiter', value: ','},
  {type: 'KeywordTerm', value: 'maccha'},
] */

const query = sq.getQuery()
/* => [
  {filter: 'tag', value: 'japan'},
  {filter: 'keyword', value: 'tea'},
  {filter: 'keyword', value: 'maccha'},
] */
```

### Functional Usage

```ts
import {getAst, getQuery} from '@projekt-apollo/query-parser'

const ast = getAst('tag:japan tea, maccha')
/* => [
  {type: 'ColonFilter', filter: 'tag', value: 'japan'},
  {type: 'KeywordTerm', value: 'tea'},
  {type: 'CommaDelimiter', value: ','},
  {type: 'KeywordTerm', value: 'maccha'},
] */

const query = getQuery('tag:japan tea, maccha')
/* => [
  {filter: 'tag', value: 'japan'},
  {filter: 'keyword', value: 'tea'},
  {filter: 'keyword', value: 'maccha'},
] */
```

## Roadmap

- **Exact Match**: Add support for exact match keywords with double quotation
  marks similar to Google Search.
- **Space Delimited Filter Value**: Currently, a colon filter only supports non
  whitespace delimited strings. Support these values with double quotation
  marks.

## Contributing

The project is not currently open to pull requests. But for bugs and
suggestions, please feel free to open an issue.

## Acknowledgment

Thank you to the authors of the following libraries for inspiration.

- [search-query-parser](https://github.com/nepsilon/search-query-parser)
- [n-search-parser](https://github.com/Financial-Times/n-search-parser)

## License

MIT

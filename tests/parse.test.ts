import {type Query} from '../src/build'
import {parse} from '../src/parse'

test('parse query from input', () => {
  const input = `tag:japan "green" tea,  maccha`
  const result: Query = [
    {filter: `tag`, value: `japan`},
    {filter: `exact`, value: `green`},
    {filter: `keyword`, value: `tea`},
    {filter: `keyword`, value: `maccha`},
  ]

  expect(parse(input)).toEqual(result)
})

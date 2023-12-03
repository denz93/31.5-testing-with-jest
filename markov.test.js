/** @typedef {typeof import('jest')} */

import { MarkovMachine } from "./markov.js";

describe('markov', () => {
  /** @type {MarkovMachine} */
  let mm = null 
  beforeEach(() => {
    mm = new MarkovMachine("a b C d a b")
  })
  test('makeText', () => {
    expect(mm.makeText(1)).toBe('C d')
    expect(mm.makeText(2)).toBe('C d')
    expect(mm.makeText(3)).toBe('C d a')
    expect(mm.makeText(4)).toBe('C d a b')
    expect(['C d a b', 'C d a b C'].includes(mm.makeText(5))).toBeTruthy()

  })

  test('makeTextIterator', () => {
    let iterator = mm.makeTextIterator(1)
    expect(iterator.next().value).toBe('C d')

    iterator = mm.makeTextIterator(2)
    expect(iterator.next().value).toBe('C d')

    iterator = mm.makeTextIterator(3)
    expect(iterator.next().value).toBe('C d')
    expect(iterator.next().value).toBe('a')

    iterator = mm.makeTextIterator(4)
    expect(iterator.next().value).toBe('C d')
    expect(iterator.next().value).toBe('a')
    expect(iterator.next().value).toBe('b')

  })
})


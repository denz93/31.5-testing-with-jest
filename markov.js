/** Textual markov chain generator */
import {PerformanceObserver, performance} from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name} took ${entry.duration}ms`);
  })
  
  performance.clearMarks();
});
obs.observe({ type: 'measure' });

export class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    /** @type {Map<string, Array<string>>} */
    this.wordMap = new Map()
    for (let i = 0; i < this.words.length-1; i++) {
      let word1 = this.words[i];
      let word2 = this.words[i + 1] || null;
      let next = this.words[i + 2] || null;
      const bigram = `${word1} ${word2}`;

      if (this.wordMap.has(bigram)) {
        this.wordMap.get(bigram).push(next);
      } else {
        this.wordMap.set(bigram, [next]);
      }
    }
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    const starterBigram = [...this.wordMap.keys()].filter(bigram => {
      return bigram[0].match(/[A-Z]/)
    })
    const randomIdx = Math.floor(Math.random() * (starterBigram.length-1))
    let bigram = starterBigram[randomIdx];
    let words = [...bigram.split(" ")];
    while (words.length < numWords) {
      let next = this.wordMap.get(bigram);
      if (next === undefined) {
        break;
      }
      const word = next[Math.floor(Math.random() * (next.length - 1))];
      words.push(word);
      bigram = words.slice(-2).join(" ");
    }

    const lastPeriodWordIdx = [...words].reverse().findIndex(w => w.endsWith('.'));

    if (lastPeriodWordIdx > 0) {
      words = words.slice(0, words.length - lastPeriodWordIdx);
    }
    return words.join(" ");
  }

  *makeTextIterator(numWords = 100) {
    const starterBigram = [...this.wordMap.keys()].filter(bigram => {
      return bigram[0].match(/[A-Z]/)
    })
    const randomIdx = Math.floor(Math.random() * (starterBigram.length-1))
    let bigram = starterBigram[randomIdx];
    let words = [...bigram.split(" ")];
    yield bigram
    while (words.length < numWords) {
      let next = this.wordMap.get(bigram);
      if (next === undefined) {
        break;
      }
      const word = next[Math.floor(Math.random() * (next.length - 1))];
      words.push(word);
      bigram = words.slice(-2).join(" ");
      yield word
    }
  }
}
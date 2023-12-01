import { MarkovMachine } from "./markov.js";
import axios from 'axios';
import fs from 'fs';

async function getFromWeb(url) {
  const res = await axios.get(url);
  if (res.status === 200) {
    return res.data;
  }
  throw new Error(res.statusText);
}

async function getFromFile(path) {
  const content = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
  return content
}

/**
 * @param {string[]} args
*/
function parseArgs(args) {
  const strippedArgs = args.slice(2);
  const FILE_SIGNATURE = 'file'
  const URL_SIGNATURE = 'url'
  const urls = []
  const files = []

  for(let i = 0; i < strippedArgs.length; i++) {
    const arg = strippedArgs[i];
    if (arg === FILE_SIGNATURE) {
      while (++i < strippedArgs.length) {
        let file = strippedArgs[i];
        if (file === URL_SIGNATURE) {
          i--;
          break;
        }
        files.push(file)
      }
    } else if (arg === URL_SIGNATURE) {
     while(++i < strippedArgs.length) {
        let url = strippedArgs[i];
        if (url === FILE_SIGNATURE) {
          i--;
          break;
        }
        urls.push(url)
      }
    }
  }
  return {
    urls,
    files
  }
}

async function sleep(ms=1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
  const { urls, files } = parseArgs(process.argv);
  let text = ''
  await Promise.all(files.map(async (file) => {
    text += await getFromFile(file) + '\n'
  }))
  await Promise.all(urls.map(async (url) => {
    text += await getFromWeb(url) + '\n'
  }))
  
  let mm = new MarkovMachine(text);
  console.log(mm.makeText());

  console.log('======= Generate word by word =======')
  const iterator = mm.makeTextIterator();
  let next = iterator.next();
  while(!next.done) {
    process.stdout.write(next.value + ' ');
    next = iterator.next();
    await sleep(100)
  }
  process.stdout.write('\r\n')
}

main()
import { generate as generateTS } from './generation/ts-generator';
import { generate as generateJS } from './generation/js-generator';
import { fetchMeta } from './generation/utils';

export { Nimble } from './nimble';
export { Delete, Get, Patch, Post, Put, Service } from '../../shared/decorators';

function log(url: string) {
  fetchMeta(url)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
}

if(process.argv.length > 2) {
  const cmd = process.argv[2];
  const url = process.argv[3];
  const dirPath = process.argv[4];

  if(cmd === 'log') {
    log(url);
  } else if(cmd === 'generate') {
    generateTS(url, dirPath);
  } else if(cmd === 'generate-js') {
    generateJS(url, dirPath);
  }
}
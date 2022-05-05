import axios from 'axios';
import * as fs from 'fs';
import { fileContentFrom, indexFileContentFrom } from './generator';
export { Nimble } from './nimble';

async function fetchMeta(url: string) {
  return (await axios.get(`${url}/api/meta`)).data;
} 

function log(url: string) {
  fetchMeta(url)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
}

function generate(url: string, dirPath: string) {
  fetchMeta(url)
    .then(data => {
      console.log(data);
      if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, { recursive: true });
      }
      data.forEach(service => {
        fs.writeFileSync(dirPath + `/${service.name}.ts`, fileContentFrom(service));
      });

      // const indexContent = data.map(s => `export { ${s.name} } from './${s.name}';`).join('\n');
      const indexContent = indexFileContentFrom(data, url);
      fs.writeFileSync(dirPath + `/index.ts`, indexContent);
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
    generate(url, dirPath);
  }
}
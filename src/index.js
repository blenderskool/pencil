import fs from 'fs';
import showdown from 'showdown';

import recursiveRead from './core/functions/recurRead';
import createFile from './core/functions/create';

const basePath = process.env.PWD;
const dir = 'content/'
const converter = new showdown.Converter({
  noHeaderId: true
})

export default function() {

  global.__base = basePath;

  recursiveRead(dir, {
    include: 'md'
  }, (err, filePath) => {

    fs.readFile(filePath, (err, fileBuf) => {
      const file = Buffer.from(fileBuf);
      const markdown = file.toString();
  
      const html = converter.makeHtml(markdown);
  
      const fullPath = basePath + '/docs/' + filePath.replace(dir, '');
      
      createFile(fullPath, html, { to: '.html' }, err => {
        console.log(err)
      })
  
    })
  });
}
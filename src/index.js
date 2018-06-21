import fs from 'fs';
import showdown from 'showdown';

import recursiveRead from './core/functions/recurRead';
import createFile from './core/functions/create';
import copyStatic from "./core/functions/copydir";

const basePath = process.env.PWD;
const dir = 'content/';
const converter = new showdown.Converter({
  ghCompatibleHeaderId: true
});

export default function() {

  global.__base = basePath;

  recursiveRead(dir, {
    include: 'md',
    ignore: ['sidebar.md']
  }, (err, filePath) => {

    fs.readFile(filePath, (err, fileBuf) => {
      const file = Buffer.from(fileBuf);
      const markdown = file.toString();
  
      const html = converter.makeHtml(markdown);
  
      const fullPath = basePath + '/docs/' + filePath.replace(dir, '');
      
      createFile(fullPath, html, { to: '.html' }, err => {
        console.log(err);
      });
  
    });
  });

  copyStatic(err => {
    console.log(err);
  })
}
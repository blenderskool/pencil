import fs from 'fs';
import showdown from 'showdown';

import recursiveRead from './core/functions/recurRead';
import createFile from './core/functions/create';
import copyStatic from "./core/functions/copydir";

const basePath = process.env.PWD;
const dir = 'content/';

/**
 * Showdown extension that is used to make h1, h2, h3 elements anchored links
 */
showdown.extension('heading-anchor', function() {
  return [{
    type: 'html',
    regex: /(<h([1-3]) id="([^"]+?)">)(.*<\/h\2>)/g,
    replace: '$1<a class="anchor" href="#$3" aria-hidden="true">$4</a>'
  }];
});

const converter = new showdown.Converter({
  ghCompatibleHeaderId: true,
  extensions: ['heading-anchor'],
  metadata: true
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
      const metaData = converter.getMetadata();
  
      const fullPath = basePath + '/docs/' + filePath.replace(dir, '');
      
      createFile(fullPath, {html, meta: metaData}, { to: '.html' }, err => {
        console.log(err);
      });
  
    });
  });

  copyStatic(err => {
    console.log(err);
  })
}
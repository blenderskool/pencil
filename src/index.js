import fs from 'fs';
import showdown from 'showdown';

import recursiveRead from './core/functions/recurRead';
import createHTML from './core/functions/createHTML';
import copyStatic from './core/functions/copydir';
import styles from './core/functions/templates/styles';

const basePath = process.env.PWD;
const dir = 'content/';

/**
 * Showdown extension that is used to make h1, h2, h3 elements anchored links
 */
showdown.extension('heading-anchor', function() {
  return [{
    type: 'html',
    regex: /(<h([1-3]) id="([^"]+?)">)(.*)(<\/h\2>)/g,
    replace: '$1<a class="anchor" href="#$3" aria-hidden="true">$4</a>$5'
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
  
      const fullPath = basePath + '/dist/' + filePath.replace(dir, '');
      
      createHTML(fullPath, {html, meta: metaData}, { to: '.html' }, err => {
        console.log(err);
      });


      fs.writeFile(__base+'/dist/styles.css', styles(), err => {
        if (err) console.log(err);
      });
  
    });
  });

  copyStatic(err => {
    console.log(err);
  })
}
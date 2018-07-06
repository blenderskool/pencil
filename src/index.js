import fs from 'fs';
import path from 'path';
import showdown from 'showdown';
import matter from 'gray-matter';

import recursiveRead from './core/functions/recurRead';
import createHTML from './core/functions/createHTML';
import copyStatic from './core/functions/copydir';
import styles from './core/functions/templates/styles';
import scripts from './core/functions/templates/javascript';

const basePath = process.env.PWD;
const dir = 'src/';

/**
 * Showdown extension that is used to make h1, h2, h3 elements anchored links
 */
showdown.extension('heading-anchor', () =>
  [{
    type: 'html',
    regex: /(<h([1-3]) id="([^"]+?)">)(.*)(<\/h\2>)/g,
    replace: '$1<a class="anchor" href="#$3" aria-hidden="true" tabindex="-1">$4</a>$5'
  }]
);

const converter = new showdown.Converter({
  ghCompatibleHeaderId: true,
  extensions: ['heading-anchor'],
  emoji: true
});

export default function() {

  global.__base = basePath;

  recursiveRead('dist/', {
    includeDir: true
  }, (err, filePath) => {
    if (err) return; //console.log(err);

    fs.unlink(filePath, err => {
      if (err) {
        // Error due to directory
        if (err.errno === -21) {
          fs.rmdir(filePath, err => {
            if (err) return console.log(err);
          });
        }
        else return console.log(err);
      }
    });

  }, () => {
    recursiveRead(dir, {
      include: 'md',
      ignore: ['sidebar.md']
    }, (err, filePath) => {

      fs.readFile(filePath, (err, fileBuf) => {
        const file = Buffer.from(fileBuf);
        const markdown = file.toString();
    
        const content = matter(markdown);
        const html = converter.makeHtml(content.content);
    
        const fullPath = path.join(__base, 'dist', filePath.replace(dir, ''));
        
        createHTML(fullPath, {html, frontMatter: content.data}, { to: '.html' }, err => {
          console.log(err);
        });

      });
    }, () => {

      // If dist folder does not exist, then create it
      const distPath = path.join(__base, 'dist/');
      if (!fs.existsSync(distPath))
        fs.mkdirSync(distPath);

      // Create a bundled styles file
      fs.writeFile(path.join(__base, 'dist/styles.css'), styles(), err => {
        if (err) console.log(err);
      });

      // Create scripts file
      fs.writeFile(path.join(__base, 'dist/script.js'), scripts(), err => {
        if (err) console.log(err);
      });

    });

    // Copy the files from the static folder to the final build as is
    copyStatic(err => {
      console.log(err);
    });

  });

}
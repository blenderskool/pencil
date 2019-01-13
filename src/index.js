import fs from 'fs';
import path from 'path';
import showdown from 'showdown';
import matter from 'gray-matter';
import showdownEmoji from 'showdown-emoji';
import recursive from 'recursive-readdir';
import rimraf from 'rimraf';

import createHTML from './core/functions/createHTML';
import copyStatic from './core/functions/copydir';
import styles from './core/functions/templates/styles';
import scripts from './core/functions/templates/javascript';
import loadHook from './core/utils/loadHook';

/**
 * Showdown extension that is used to make h1, h2, h3
 * elements anchored links
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
  extensions: ['heading-anchor', showdownEmoji],
});

/**
 * Sets the custom functions in String prototype
 */
String.prototype.loadHook = loadHook;


/**
 * Main build function
 * @param {Object} options
 * deployDir: String - the directory to output the built files,
 * dev: Boolean - run in dev mode,
 * basePath: String - Path to the root of the project
 */
export default function(options) {

  return new Promise((resolve, reject) => {

    const basePath = options.basePath || process.cwd();
    const deployPath = path.join(basePath, options.deployDir || 'dist');
    const srcDir = options.src || 'src';

    /**
     * Global read only variables are set here
     */
    global.__base = basePath;
    global.__config = path.join(__base, 'docbook.config');
    global.__deploy = deployPath;

    /**
     * Remove the old deploy files
     */
    rimraf(__deploy, err => {

      /**
       * Recursively read the src directory to build the files
       */
      recursive(path.join(__base, srcDir), (err, files) => {
        files.forEach(filePath => {
          if (path.extname(filePath) !== '.md') return;

          fs.readFile(filePath, (err, fileBuf) => {
            const file = Buffer.from(fileBuf);
            const markdown = file.toString();
        
            const content = matter(markdown);
            const html = converter.makeHtml(content.content);
        
            const fullPath = path.join(__deploy, filePath.replace(path.join(__base, srcDir), ''));
            
            createHTML(fullPath, {html, frontMatter: content.data}, { to: '.html', devMode: options.dev })
            .catch(reject);
          });
        });

        // If output folder does not exist, then create it
        if (!fs.existsSync(deployPath))
          fs.mkdirSync(deployPath);

        // Create a bundled styles file
        styles()
        .then(cssData => {
          fs.writeFile(path.join(deployPath, 'styles.css'), cssData, err => {
            if (err) reject(err);
          });
        })
        .catch(reject);
        
        // Create scripts file
        scripts()
        .then(scriptData => {
          fs.writeFile(path.join(deployPath, 'script.js'), scriptData, err => {
            if (err) reject(err);
          });
        })
        .catch(reject);


      });

      /**
       * Copy the files from the static folder to the final build.
       * Since the static folder is optional, the error is ignored
       */
      copyStatic(path.join(__base, 'static'), deployPath)
      .then(() => {
        // Remove the cached config file
        delete require.cache[require.resolve(__config)];

        // Callback for completion of build process
        resolve();
      })
      .catch(reject);

    });

  });
}
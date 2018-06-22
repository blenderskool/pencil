import fs from 'fs';
import pathMod from 'path';
import mkdirp from 'mkdirp';

import prepareTemplate from './template';
import injectPlugins from './parsePlugin';

/**
 * Writes a file to the specified path. If the parent folder does not
 * exist, it is created. Options include a 'to' property which saves
 * the file in the specified format
 */
export default function createFile(path, data, options, callback) {
  mkdirp(pathMod.dirname(path), err => {
    if (err) callback(err);

    /**
     * We get the required template based on the extension of file it is
     * being converted too
     */
    if (options.to && options.to === '.html') {
      const htmlTemplate = prepareTemplate(options.to, data.meta);
      /**
       * Merge the data into the template
       */
      data = htmlTemplate.replace('{{ content }}', data.html);
    }

    /**
     * Additional plugins that are being used are injected here
     */
    data = injectPlugins(data);

    fs.writeFile(path.replace(/\.[^/.]+$/, options.to), data.html, err => {
      if (err) callback(err);
    });

    let cssTemplate = prepareTemplate('.css');
    cssTemplate += ' '+data.css;
    fs.writeFile(__base+'/docs/styles.css', cssTemplate, err => {
      if (err) callback(err);
    });

  });
}
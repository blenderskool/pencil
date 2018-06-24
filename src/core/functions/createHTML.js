import fs from 'fs';
import pathMod from 'path';
import mkdirp from 'mkdirp';
import { minify } from "html-minifier";

import templateHTML from './templates/html';
import injectPlugins from './plugins/parser';

/**
 * Writes a file to the specified path. If the parent folder does not
 * exist, it is created. Options include a 'to' property which saves
 * the file in the specified format
 */
export default function(path, data, options, callback) {
  mkdirp(pathMod.dirname(path), err => {
    if (err) callback(err);

    /**
     * We get the required template based on the extension of file it is
     * being converted too
     */
    if (options.to && options.to === '.html') {
      const htmlTemplate = templateHTML(data.meta);

      // Merge the data into the template
      data = htmlTemplate.replace('{{ content }}', data.html);
    }

    // Additional plugins that are being used are injected here
    data = injectPlugins(data);

    // Minify the html
    data = minify(data, {
      collapseWhitespace: true,
      removeComments: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      useShortDoctype: true
    });

    fs.writeFile(path.replace(/\.[^/.]+$/, options.to), data, err => {
      if (err) callback(err);
    });
  });
}
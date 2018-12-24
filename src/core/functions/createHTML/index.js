import fs, { link } from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import { minify } from "html-minifier";

import sb from './sidebar';
import templateHTML from '../templates/html';
import indexGen from '../templates/html/content';
import injectPlugins from '../plugins/parser';

let sidebar;

/**
 * Writes a file to the specified path. If the parent folder does not
 * exist, it is created. Options include a 'to' property which saves
 * the file in the specified format
 */
export default function(filePath, data, options) {

  if (!sidebar) sidebar = new sb(__config);

  return new Promise((resolve, reject) => {

    mkdirp(path.dirname(filePath), err => {
      if (err) return reject(err);


      const links = sidebar.getLinks(path.relative(__deploy, filePath));

      /**
       * We get the required template based on the extension of file it is
       * being converted too
       */
      if (options.to && options.to === '.html') {
        const htmlTemplate = templateHTML(data.frontMatter);

        // Merge the data into the template
        data.html = htmlTemplate.loadHook('content', data.html, links.length > 2 && data.frontMatter.pageNav !== false);
      }

      /**
       * Add the page footer navigation that adds neighbouring page links
       * This can be disabled using the front matter
       */
      if (data.frontMatter.pageNav !== false) {
        data.html = data.html.loadHook('content', () => {
          let content = `<div class="page-nav">{{ links }}</div>`;

          links.forEach((link, i) => {
            // Skip the current link
            if (i === 1) return;

            content = content.loadHook('links',
            `<div>
              ${ link.link ?
                `<a href="${link.link}" aria-label="Link to ${link.name}${ link.parent ? ' in '+link.parent : '' }">
                ${i === 0 ? '<i class="icon ion-md-arrow-back"></i>' : ''}
                ${link.name}
                ${i === 2 ? '<i class="icon ion-md-arrow-forward"></i>' : ''}
                <div class="parent">${ link.parent || '' }</div>
                </a>`
                : ''
              }
            </div>`, i < links.length-1);
          });

          return content;
        });
      }
      
      // Additional plugins that are being used are injected
      data.html = injectPlugins(data);

      // Contents sidebar is added
      data = indexGen(data);

      // Minify the html
      data = minify(data, {
        collapseWhitespace: true,
        removeComments: !options.devMode,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        useShortDoctype: true
      });

      // Change the file extension and write it to the path
      fs.writeFile(filePath.replace(/\.[^/.]+$/, options.to), data, err => {
        if (err) reject(err);
      });

    });
  });
}
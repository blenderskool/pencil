import path from 'path';
import { minify } from "html-minifier";

import sb from './sidebar';
import templateHTML from '../templates/html';
import indexGen from '../templates/html/content';
import injectPlugins from '../plugins/parser';

let sidebar;

/**
 * Generates minified HTML data with content loaded in the template
 * @param {String} filePath Path where the file will be saved
 * @param {String} data The HTML data which would be loaded in the template
 * @param {Object} options Additional options
 */
export default function(filePath, data, options) {

  if (!sidebar) sidebar = new sb(__config);

  return new Promise((resolve, reject) => {
    const links = sidebar.getLinks(path.relative(__deploy, filePath));

    /**
     * We get the required HTML template
     */
    const htmlTemplate = templateHTML(data.frontMatter);

    // Merge the data into the template
    data.html = htmlTemplate.loadHook('content', data.html, {
      keepHook: links.length > 2 && data.frontMatter.pageNav !== false
    });

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
          </div>`, {
            keepHook: i < links.length-1
          });
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
    resolve(data);
  });
}
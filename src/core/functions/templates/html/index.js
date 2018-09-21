import fs from 'fs';
import path from 'path';
import addAttributes from '../../../utils/attributes';

/**
 * Creates the Navigation for the page.
 * 
 * @param {Array} nav Data for creating the navigation
 * @param {String} type Defines the type of navigation. (sub | footer | (default: nav))
 * @param {Boolean} aria Toggle the ARIA labels for the items in navigation
 * @param {Number} recurLevel Defines the recursion depth to limit drop menu depths
 */
function navCreator(nav, type, aria, recurLevel = 1) {
  let tags = '';

  if (Array.isArray(nav)) {
    nav.forEach(item => {

      if (typeof item === 'string')
        return tags += `<span ${aria ? 'role="menuitem"' : ''}>${item}</span>`;

      const name = item[0];
      const val = item[1];

      if (typeof val === 'string') {
        return tags += addAttributes('a', {
          href: val,
          ...(aria && {role: 'menuitem'})
        }) + name+'</a>';
      }

      if (!val)
        return tags += `<span ${aria ? 'role="menuitem"' : ''}>${name}</span>`;

      if (Array.isArray(val) && recurLevel < 3) {
        /**
         * Drop down menu is setup
         */
        return tags += `<span tabindex="0" aria-haspopup="true" aria-expanded="false">${name}
          <i class="icon ion-ios-arrow-${type === 'footer' ? 'up' : 'down'}"></i>
          <div class="drop-menu" role="menu">
            ${navCreator(val, 'sub', true, ++recurLevel)}
          </div>
          </span>`;
      }

      if (typeof val === 'object') {
        /**
         * If the link is supposed to open in a new tab
         */
        return tags += addAttributes('a', {
          href: val.link,
          target: val.newTab ? '_blank' : '',
          ...(aria && {role: 'menuitem'})
        }) + name+'</a>';
      }

    });
  }

  return tags;
}

/**
 * Prepares the main template with the config, frontMatter data for the actual
 * content to be added
 * 
 * @param {Object} frontMatter Additional options for each page
 */
export default function(frontMatter) {
  const config = require(__base+'/docbook.config');

  // Gets the HTML template
  let template = '';
  template = fs.readFileSync(path.join(__dirname, '../../../templates/html.html')).toString();

  // lang of the page is set here
  if (frontMatter.lang)
    template = template.replace('lang="en"', `lang="${frontMatter.lang}"`);


  // If title is present in meta data for the page, then use it
  if (frontMatter.title)
    template = template.loadHook('title', frontMatter.title);
  else
    template = template.loadHook('title', config.head ?
    config.head.title ?
    config.head.title :
    'DocBook site' :
    'DocBook site');

  /**
   * Adds the theme-color meta tag based on following order
   *  - Front matter themeColor
   *  - Front matter meta tag
   *  - Config themeColor
   *  - Fallback
   */
  let tags = `<meta name="theme-color" content="${(() => {
    const meta = frontMatter.meta;
    
    if (frontMatter.themeColor)
      return frontMatter.themeColor;
    else if (meta && meta['theme-color'])
        return meta['theme-color'];
    else if (config.themeColor)
      return config.themeColor;
    else
      return '#287BE1';
  })()}">`;

  /**
   * Creates the <head> section of the site
   */
  if (config.head && typeof config.head === 'object') {
    Object.keys(config.head).forEach(tag => {
      // If the property is not of Array type
      if (!Array.isArray(config.head[tag])) return;

      if (tag === 'meta') {
        return config.head.meta.forEach(metaInfo => {

          // Page meta data overrides the global meta data
          if (frontMatter.meta) {
            if (frontMatter.meta.hasOwnProperty(metaInfo.name))
              metaInfo.content = frontMatter.meta[metaInfo.name];
              delete frontMatter.meta[metaInfo.name];
          }

          tags += addAttributes('meta', metaInfo);
        });
      }

      config.head[tag].forEach(tagInfo => tags += addAttributes(tag, tagInfo));

    });
  }

  // Additional page meta data is added here
  if (frontMatter.meta) {
    for (let metaName in frontMatter.meta) {
      tags += addAttributes('meta', {
        name: metaName,
        content: frontMatter.meta[metaName]
      });
    }
  }
  // Injects the head tags in the template
  template = template.loadHook('head', tags);


  // Header
  if ((config.navigation ||
    config.logo ||
    (config.darkTheme && config.darkTheme.toggle))
    && frontMatter.header != 'disable'
  ) {
    template = template.loadHook('header',
      `<header>${config.logo ?
      `<a href="/" class="brand"><img alt="${config.head ?
      config.head.title :
      'Docbook site'}" src=${config.logo}></a>` :
      ''}<nav>{{ nav }}</nav></header>`
    );
    // Adds a class to the container to accomodate for the fixed header height
    template = template.replace('<div class="container">', '<div class="container fixed-head">');
  }
  else
    template = template.loadHook('header', '');

  
  // Navigation
  tags = navCreator(config.navigation);
  
  // If dark theme toggle button is enabled, then add it to the navBar
  if (config.darkTheme && typeof config.darkTheme === 'object' && config.darkTheme.toggle)
    tags += `<button class="theme-toggle" aria-label="Toggle dark theme" onclick="toggleDark(this)">
    <i class="icon ion-ios-${config.darkTheme.default ? 'sunny' : 'moon'}"></i>
    </button>`;

  template = template.loadHook('nav', tags);


  /**
   * Additional body section hook for future use
   */
  template = template.loadHook('body', '');


  /**
   * Bundles script file is linked.
   * In the future, custom scripts linking may be added.
   */
  tags = '<script src="/script.js"></script>';
  template = template.loadHook('scripts', tags);


  // Sidebar
  tags = '';
  if (Array.isArray(config.sidebar) && frontMatter.sidebar != 'disable') {
    for (let item of config.sidebar) {
      const name = item[0];
      const val = item[1];

      if (config.plugins && typeof config.plugins === 'object' && config.plugins.hasOwnProperty(name)) {
        // This section adds plugin support to the sidebar
        if (val && typeof val === 'object')
          tags += addAttributes(name, val)+`${val.children ? val.children : ''}</${name}>`;
        else
          tags += `<${name}>${val}</${name}>`;
      }
      else if (val && typeof val === 'object') {
        tags += `<div class="page">${ name }</div>`
        for (let subName in val) {
          tags += `<div class="indent">${addAttributes('a', {
            href: val[subName]
          }) + subName + '</a>'}</div>`;
        }
      }
      else {
        tags += `<div class="page">${addAttributes('a', {
          href: val
        }) + name + '</a>'}</div>`;
      }

    }
  }
  template = template.loadHook('sidebar', tags);

  // Enable the dark theme if set true for default
  if ((config.darkTheme === true ||
      (config.darkTheme && config.darkTheme.default) ||
      frontMatter.darkTheme) && frontMatter.darkTheme !== false)
    template = template.replace('<body', '<body class="dark"');


  // Footer
  template = template.loadHook('footer', navCreator(config.footer, 'footer'));

  return template;
}
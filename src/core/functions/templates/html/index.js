import fs from 'fs';
import path from 'path';
import addAttributes from '../../../utils/attributes';

function navCreator(nav, type, recurLevel = 1) {
  let tags = '';

  if (Array.isArray(nav)) {
    nav.forEach(item => {

      if (typeof item === 'string')
        return tags += `<span>${item}</span>`;

      const name = item[0];
      const val = item[1];

      if (typeof val === 'string') {
        return tags += addAttributes('a', {
          href: val
        }) + name+'</a>';
      }

      if (!val)
        return tags += `<span>${name}</span>`;

      if (Array.isArray(val) && recurLevel < 3) {
        /**
         * Drop down menu is setup
         */
        return tags += `<span tabindex="0">${name}
          <i class="icon ion-ios-arrow-${type === 'footer' ? 'up' : 'down'}"></i>
          <div class="drop-menu">
            ${navCreator(val, 'sub', ++recurLevel)}
          </div>
          </span>`;
      }

      if (typeof val === 'object') {
        /**
         * If the link is supposed to open in a new tab
         */
        return tags += addAttributes('a', {
          href: val.link, target: val.newTab ? '_blank' : ''
        }) + name+'</a>';
      }

    });
  }

  return tags;
}

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
    template = template.replace('{{ title }}', frontMatter.title);
  else
    template = template.replace('{{ title }}', config.head ?
    config.head.title ?
    config.head.title :
    'DocBook site' :
    'DocBook site');

  /**
   * Adds the theme-color meta tag if themeColor was added in the config file
   * before adding meta tags defined in the config file
   */
  let tags = `<meta name="theme-color" content="${config.themeColor ? config.themeColor : '#287BE1'}">`;

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
  template = template.replace('{{ head }}', tags);


  // Header
  if ((config.navigation ||
    config.logo ||
    (config.darkTheme && config.darkTheme.toggle))
    && frontMatter.header != 'disable'
  ) {
    template = template.replace('{{ header }}',
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
    template = template.replace('{{ header }}', '');

  
  // Navigation
  tags = navCreator(config.navigation);
  
  // If dark theme toggle button is enabled, then add it to the navBar
  if (config.darkTheme && typeof config.darkTheme === 'object' && config.darkTheme.toggle)
    tags += `<button class="theme-toggle" aria-label="Toggle dark theme" onclick="toggleDark(this)">
    <i class="icon ion-ios-${config.darkTheme.default ? 'sunny' : 'moon'}"></i>
    </button>`;

  template = template.replace('{{ nav }}', tags);

  // Scripts for the body section
  tags = '<script src="/script.js"></script>';
  if (Array.isArray(config.scripts))
    config.scripts.forEach(scriptInfo => tags += addAttributes('script', scriptInfo)+'</script>');

  template = template.replace('{{ body }}', tags);


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
  template = template.replace('{{ sidebar }}', tags);

  // Enable the dark theme if set true for default
  if ((config.darkTheme === true ||
      (config.darkTheme && config.darkTheme.default) ||
      frontMatter.darkTheme) && frontMatter.darkTheme !== false)
    template = template.replace('<body', '<body class="dark"');


  // Footer
  template = template.replace('{{ footer }}', navCreator(config.footer, 'footer'));

  return template;
}
import fs from 'fs';
import path from 'path';
import addAttributes from '../../utils/attributes';

export default function(frontMatter) {
  const config = require(__base+'/docbook.config');

  let template = '';
  template = fs.readFileSync(path.join(__dirname, '../../templates/html.html')).toString();

  // lang of the page is set here
  if (frontMatter.lang)
    template = template.replace('lang="en"', `lang="${frontMatter.lang}"`);

  /**
   * 'meta', 'link' data is taken from the config file and added to the
   * html template
   */

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
  let tags = config.themeColor ? `<meta name="theme-color" content="${config.themeColor}">` : '';
  if (Array.isArray(config.head.meta)) {
    config.head.meta.forEach(metaInfo => {

      // Page meta data overrides the global meta data
      if (frontMatter.meta) {
        if (frontMatter.meta.hasOwnProperty(metaInfo.name))
          metaInfo.content = frontMatter.meta[metaInfo.name];
          delete frontMatter.meta[metaInfo.name];
      }

      tags += addAttributes('meta', metaInfo)+'\n'
    });
  }

  // Additional page meta data is added here
  if (frontMatter.meta) {
    for (let metaName in frontMatter.meta) {
      tags += addAttributes('meta', {
        name: metaName,
        content: frontMatter.meta[metaName]
      })+'\n';
    }
  }
  template = template.replace('{{ meta }}', tags);

  // Link tags
  tags = '';
  if (Array.isArray(config.head.link))
    config.head.link.forEach(linkInfo => tags += addAttributes('link', linkInfo)+'\n');

  template = template.replace('{{ link }}', tags);


  // Header
  if (config.navigation || config.logo) {
    template = template.replace('{{ header }}',
      `<header>${config.logo ? `<a href="/" class="brand"><img alt="${config.head ? config.head.title : 'Docbook site'}" src=${config.logo}></a>` : ''}<nav>{{ nav }}</nav></header>`
    );
    // Adds a class to the container to accomodate for the fixed header height
    template = template.replace('<div class="container">', '<div class="container fixed-head">');
  }
  else
    template = template.replace('{{ header }}', '');

  
  // Navigation
  tags = '';
  if (config.navigation) {
    for (let name in config.navigation) {
      const val = config.navigation[name];

      if (typeof val === 'string') {
        tags += addAttributes('a', {
          href: val
        }) + name+'</a>';
      }
      else if (!val) {
        tags += `<span>${name}</span>`;
      }
      else if (typeof val === 'object') {
        // If the link is supposed to open in a new tab
        if (val.newTab && val.link) {
          tags += addAttributes('a', {
            href: val.link, target: '_blank'
          }) + name+'</a>';
        }

        // TODO: Implement dropdown menu
      }
    }
  }
  template = template.replace('{{ nav }}', tags);

  // Scripts for the body section
  tags = '<script src="/script.js"></script>\n';
  if (Array.isArray(config.scripts))
    config.scripts.forEach(scriptInfo => tags += addAttributes('script', scriptInfo)+'</script>\n');

  template = template.replace('{{ body }}', tags);


  // Sidebar
  tags = '';
  if (config.sidebar && typeof config.sidebar === 'object') {
    for (let name in config.sidebar) {
      const val = config.sidebar[name];

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

  // Footer
  tags = '';
  if (config.footer) {
    for (let name in config.footer) {
      const val = config.footer[name];

      if (typeof val === 'string') {
        tags += addAttributes('a', {
          href: val
        }) + name+'</a>';
      }
      else if (!val) {
        tags += `<span>${name}</span>`;
      }
    }
  }
  template = template.replace('{{ footer }}', tags);

  return template;
}
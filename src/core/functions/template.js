import fs from 'fs';
import path from 'path';
import addAttributes from '../utils/attributes';
import bundler from '../utils/bundler';


export default function(ext, meta) {
  const config = require(__base+'/docbook.config');

  let template = '';

  if (ext === '.html') {

    template = fs.readFileSync(path.join(__dirname, '../templates/html.html')).toString();

    /**
     * 'meta', 'link' data is taken from the config file and added to the
     * html template
     */

    // If title is present in meta data for the page, then use it
    if (meta.title) {
      template = template.replace('{{ title }}', meta.title);
      delete meta.title;
    }
    else
      template = template.replace('{{ title }}', config.head ? config.head.title ? config.head.title : 'Docbook site' : 'Docbook site');

    let tags = '';
    if (Array.isArray(config.head.meta)) {
      config.head.meta.forEach(metaInfo => {

        // Page meta data overrides the global meta data
        if (meta) {
          if (meta.hasOwnProperty(metaInfo.name))
            metaInfo.content = meta[metaInfo.name];
            delete meta[metaInfo.name];
        }

        tags += addAttributes('meta', metaInfo)+'\n'
      });
    }

    // Additional page meta data is added here
    if (meta) {
      for (let metaName in meta) {
        tags += addAttributes('meta', { name: metaName, content: meta[metaName] })+'\n';
      }
    }

    template = template.replace('{{ meta }}', tags);

    tags = '';
    if (Array.isArray(config.head.link))
      config.head.link.forEach(linkInfo => tags += addAttributes('link', linkInfo)+'\n');

    template = template.replace('{{ link }}', tags);

    tags = '';
    if (config.navigation) {
      for (let name in config.navigation) {
        const val = config.navigation[name];

        if (typeof val === 'string') {
          tags += addAttributes('a', {
            href: val, ariaHidden: true
          }) + name+'</a>';
        }
        else if (!val) {
          tags += `<span>${name}</span>`;
        }
        else if (typeof val === 'object') {
          if (val.newTab) {
            tags += addAttributes('a', {
              href: val, ariaHidden: true, target: '_blank'
            }) + name+'</a>';
          }

          // TODO: Implement dropdown menu
        }
      }
    }
    template = template.replace('{{ nav }}', tags);

    tags = '';
    if (Array.isArray(config.scripts))
      config.scripts.forEach(scriptInfo => tags += addAttributes('script', scriptInfo)+'</script>\n');

    template = template.replace('{{ body }}', tags);
      
  }
  else if (ext === '.css') {
    /**
     * Bundle the default, external css files into one single file
     */
    const external = Array.isArray(config.styles) ? config.styles : [];

    template = bundler([
      path.join(__dirname, '../templates/css/reset.min.css'),
      path.join(__dirname, '../templates/css/styles.css')
    ].concat(external), err => {
      console.log(err);
    });
  }

  return template;
}
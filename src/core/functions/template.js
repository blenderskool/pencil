import fs from 'fs';
import path from 'path';

function addAttributes(startTag, attributes) {
  for (let attribute in attributes) {
    const kebab = attribute.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    startTag += ` ${kebab}="${attributes[attribute]}"`;
  }

  return startTag += '>';
}

export default function(ext) {
  const config = require(__base+'/docbook.config');

  let template = '';

  if (ext === '.html') {

    template = fs.readFileSync(path.join(__dirname, '../templates/html.html')).toString();
    template = template.replace('{{ title }}', config.head.title);

    /**
     * 'meta', 'link' data is taken from the config file and added to the
     * html template
     */
    let metaTags = '';
    if (Array.isArray(config.head.meta))
      config.head.meta.forEach(metaInfo => metaTags += addAttributes('<meta', metaInfo)+'\n');

    template = template.replace('{{ meta }}', metaTags);

    let linkTags = '';
    if (Array.isArray(config.head.link))
      config.head.link.forEach(linkInfo => linkTags += addAttributes('<link', linkInfo)+'\n');
      
    template = template.replace('{{ link }}', linkTags);
  }

  return template;
}
import fs from 'fs';
import path from 'path';
import addAttributes from '../utils/attributes';


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
      config.head.meta.forEach(metaInfo => metaTags += addAttributes('meta', metaInfo)+'\n');

    template = template.replace('{{ meta }}', metaTags);

    let linkTags = '';
    if (Array.isArray(config.head.link))
      config.head.link.forEach(linkInfo => linkTags += addAttributes('link', linkInfo)+'\n');
      
    template = template.replace('{{ link }}', linkTags);
  }
  else if (ext === '.css') {
    const reset = fs.readFileSync(path.join(__dirname, '../templates/css/reset.min.css')).toString();
    const styles = fs.readFileSync(path.join(__dirname, '../templates/css/styles.css')).toString();

    template = reset+' '+styles;
  }

  return template;
}
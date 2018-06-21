import fs from 'fs';
import path from 'path';
import addAttributes from '../utils/attributes';
import bundler from '../utils/bundler';


export default function(ext) {
  const config = require(__base+'/docbook.config');

  let template = '';

  if (ext === '.html') {

    template = fs.readFileSync(path.join(__dirname, '../templates/html.html')).toString();

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

    let scriptTags = '';
    if (Array.isArray(config.scripts))
      config.scripts.forEach(scriptInfo => scriptTags += addAttributes('script', scriptInfo)+'</script>\n');

    template = template.replace('{{ body }}', scriptTags);
      
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
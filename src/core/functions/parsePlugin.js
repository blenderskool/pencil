import domParser from 'dom-parser';
import pluginLoader from './loadPlugin';
import indexGen from './content';

export default function(data) {
  const config = require(__base + '/docbook.config');
  const plugins = config.plugins;
  if (!plugins) return data;
  
  const parser = new domParser();
  const dom = parser.parseFromString(data);
  let pluginCSS = '';


  for (let tag in plugins) {

    dom.getElementsByTagName(tag).forEach(element => {
      const plugin = pluginLoader(`${__base}/${plugins[tag]}`, element);

      /**
       * Replace the component content with plugin content after it is loaded
       */
      data = data.replace(element.outerHTML, plugin.element);

      if (!pluginCSS.includes(plugin.css))
        pluginCSS += plugin.css;
    });
  }

  /** Contents sidebar will be generated now */
  data = indexGen(data);

  return { html: data, css: pluginCSS };
}
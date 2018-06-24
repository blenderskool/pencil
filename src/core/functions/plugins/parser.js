import domParser from 'dom-parser';
import pluginLoader from './loader';
import indexGen from '../content';

export default function(data) {
  const config = require(__base + '/docbook.config');
  const plugins = config.plugins;
  if (!plugins) return data;
  
  const parser = new domParser();
  const dom = parser.parseFromString(data);

  for (let tag in plugins) {

    dom.getElementsByTagName(tag).forEach(element => {
      const plugin = pluginLoader(`${__base}/${plugins[tag]}`, element);

      /**
       * Replace the component content with plugin content after it is loaded
       */
      data = data.replace(element.outerHTML, plugin);
    });
  }

  // Contents sidebar will be generated and returned
  return indexGen(data);
}
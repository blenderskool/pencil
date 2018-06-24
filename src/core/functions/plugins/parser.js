import domParser from 'dom-parser';
import pluginLoader from './loader';
import indexGen from '../content';

export default function(data) {
  const config = require(__base + '/docbook.config');
  const plugins = config.plugins;


  if (plugins && typeof plugins === 'object') {
    const parser = new domParser();
    const dom = parser.parseFromString(data);

    Object.keys(plugins).forEach(tag => {
      dom.getElementsByTagName(tag).forEach(element => {
        const plugin = pluginLoader(`${__base}/${plugins[tag]}`, element);
        
        /**
         * Replace the component content with plugin content after it is loaded
         */
        data = data.replace(element.outerHTML, plugin);
      });
    })
  }

  // Contents sidebar will be generated and returned
  return indexGen(data);
}
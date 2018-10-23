import domParser from 'dom-parser';
import pluginLoader from './loader';

export default function(data) {
  const config = require(__config);
  const plugins = config.plugins;

  if (plugins && typeof plugins === 'object') {
    const parser = new domParser();
    const dom = parser.parseFromString(data.html);

    Object.keys(plugins).forEach(tag => {
      dom.getElementsByTagName(tag).forEach(element => {
        const plugin = pluginLoader(plugins[tag], element);
        
        /**
         * Replace the component content with plugin content after it is
         * loaded. Styles are appened separately
         */
        data.html = data.html.replace(element.outerHTML, plugin);
      });
    })
  }

  return data.html;
}
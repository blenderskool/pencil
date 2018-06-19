import domParser from 'dom-parser';

export default function(data) {
  const config = require(__base+'/docbook.config');
  const plugins = config.plugins;
  if (!plugins) return data;
  
  const parser = new domParser();
  const dom = parser.parseFromString(data);

  for (let tag in plugins) {
    const mod = require(`../../../${plugins[tag]}`);
    dom.getElementsByTagName(tag).forEach(element => {
      const children = element.innerHTML;
      const options = {
        children,
        attributes: element.attributes
      };

      data = data.replace(element.outerHTML, mod(options));
    })
  }

  return data;
}
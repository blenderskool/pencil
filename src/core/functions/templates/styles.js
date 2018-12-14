import path from 'path';
import bundler from '../../utils/bundler';
import loader from '../plugins/loader';
import cleanCSS from "clean-css";

export default function() {
  /**
   * Bundle the default, external css files into one single file
   */
  return new Promise((resolve, reject) => {
    const config = require(__config);
    const external = Array.isArray(config.styles) ? config.styles : [];

    
    let pluginCSS = '';
    if (config.plugins && typeof config.plugins === "object") {
      for (let tag in config.plugins) {
        pluginCSS += loader(config.plugins[tag], null, 'css');
      }
    }

    bundler([
      path.join(__dirname, '../../templates/css/reset.min.css'),
      path.join(__dirname, '../../templates/css/styles.css'),
      ... config.darkTheme ? [path.join(__dirname, '../../templates/css/dark.css')] : []
    ].concat(external))
    .then(css => {
      css = (css + pluginCSS).replace(/\[theme\]/gi, config.themeColor ? config.themeColor : '#287BE1');
      resolve(new cleanCSS({}).minify(css).styles);
    })
    .catch(reject)
  });
}
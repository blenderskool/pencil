import path, { resolve } from 'path';
import bundler from '../../utils/bundler';

export default function() {
  /**
   * Bundle the default, prism, external js files
   */
  return new Promise((resolve, reject) => {
    const config = require(__config);
    const external = Array.isArray(config.scripts) ? config.scripts : [];

    bundler([
      path.join(__dirname, '../../templates/js/scripts.js'),
      path.join(__dirname, '../../templates/js/prism.js')
    ].concat(external))
    .then(scripts => resolve(scripts))
    .catch(reject);

  });
}
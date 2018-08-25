import path from 'path';
import bundler from '../../utils/bundler';

export default function() {
  /**
   * Bundle the default, prism, external js files
   */
  const config = require(__base+'/docbook.config');
  const external = Array.isArray(config.scripts) ? config.scripts : [];

  return bundler([
    path.join(__dirname, '../../templates/js/scripts.js'),
    path.join(__dirname, '../../templates/js/prism.js')
  ].concat(external), err => {
    console.log(err);
  });
}
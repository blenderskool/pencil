import path from 'path';
import bundler from '../../utils/bundler';

export default function() {
  return bundler([
    path.join(__dirname, '../../templates/js/scripts.js'),
    path.join(__dirname, '../../templates/js/prism.js')
  ], err => {
    console.log(err);
  });
}
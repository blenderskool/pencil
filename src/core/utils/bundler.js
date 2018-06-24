import fs from 'fs';
import concat from './concat'

export default function(paths=[], callback) {

  let data = '';
  for (let path of paths) {
    try {
      const file = fs.readFileSync(path).toString();
      data = concat(data, ' ', file);
    }
    catch (err) {
      callback(err);
    }
  }

  return data;
}
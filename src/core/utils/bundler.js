import fs from 'fs';
import concat from './concat'

export default function(paths=[]) {

  return new Promise((resolve, reject) => {
    let data = '';
    for (let path of paths) {
      try {
        const file = fs.readFileSync(path).toString();
        data = concat(data, ' ', file);
      }
      catch (err) {
        return reject(err);
      }
    }

    resolve(data);
  });
}
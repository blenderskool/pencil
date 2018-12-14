import { ncp } from 'ncp';
import { existsSync } from 'fs';

export default function(srcPath, dstPath) {
  return new Promise((resolve, reject) => {
    if (!existsSync(srcPath)) return reject('Path not found');

    ncp(srcPath, dstPath, err => {
      if (err) {
        return reject(err);
      }
  
      resolve();
    });  
  });
}
import { ncp } from 'ncp';
import { existsSync } from 'fs';

export default function(srcPath, dstPath, callback) {
  if (!existsSync(srcPath)) return callback('Path not found');

  ncp(srcPath, dstPath, err => {
    if (err) {
      return callback(err);
    }

    callback(null);
  });

}
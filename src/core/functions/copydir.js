import path from 'path';
import { ncp } from "ncp";
import { existsSync } from 'fs';

export default function(callback) {
  const staticPath = path.join(__base, 'static');

  if (!existsSync(staticPath)) return callback('Path not found');

  ncp(staticPath, path.join(__base, 'dist'), err => {
    if (err) {
      return callback(err)
    }
  });

}
import path from 'path';
import { ncp } from "ncp";

export default function(callback) {
  const config = require(__base+'/docbook.config');

  if (!config.static) return;

  ncp(path.join(__base, config.static), path.join(__base, 'docs'), err => {
    if (err) {
      return callback(err)
    }
  });

}
import fs from 'fs';
import path from 'path';

export default function() {
  try {
    return fs.readFileSync(path.join(__dirname, '../../templates/scripts.js')).toString();
  }
  catch (err) {
    throw(err);
  }
}
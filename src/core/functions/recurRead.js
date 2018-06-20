import fs from 'fs';

/**
 * Simple recursive file reader. It returns a path to the file at a time to the
 * callback function. Makes use of the async readdir in fs
 */
export default function recursiveRead(dir, options={}, callback) {

  /**
   * TODO: check if necessary build folder exists
   */
  fs.readdir(dir, (err, files) => {
    if (err) return callback(err);

    files.forEach(fileName => {
      /**
       * Ignores certain files that are passed in the options
       */
      if (Array.isArray(options.ignore)) {
        if (options.ignore.includes(fileName)) return;
      }

      const filePath = dir + fileName;

      /**
       * If the path is a directory, then again call this function with the
       * subdirectory
       */
      if (fs.statSync(filePath).isDirectory())
        return recursiveRead(filePath + '/', options, callback);

      if (options.include) {
        options.include.split('|').forEach(extension => {
          if (fileName.endsWith(extension)) return callback(null, filePath);
        })
      }
      else {
        callback(null, filePath);
      }
    })
  })

}
import chalk from 'chalk';

/**
 * Logs a generated file message
 * @param {String} fileName Name of the file that is generated
 * @param {Number} size Size of the file in KB
 */
export function logFile(fileName, size) {

  console.log(`Generated ${fileName}`, chalk.green.bold(`[${size}KB]`));
}
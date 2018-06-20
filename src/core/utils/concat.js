/**
 * This function is used to concatenate multiple strings.
 * It makes use of array join() method which ignores undefined or null
 * values in the arguments passed
 */

export default function(/**/) {
  
  return [...arguments].join('')

}
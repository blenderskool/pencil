/**
 * This function attaches the attributes to the HTML tag for single line
 * elements
 */

export default function(startTag, attributes) {
  startTag = '<'+startTag;
  for (let attribute in attributes) {
    const kebab = attribute.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    startTag += ` ${kebab}="${attributes[attribute]}"`;
  }

  return startTag += '>';
}
import camelKebab from "./camelKebab";

/**
 * This function attaches the attributes to the HTML tag for single line
 * elements
 */

export default function(startTag, attributes) {
  startTag = '<'+startTag;
  for (let attribute in attributes) {
    const kebab = camelKebab(attribute);
    startTag += ` ${kebab}="${attributes[attribute]}"`;
  }

  return startTag += '>';
}
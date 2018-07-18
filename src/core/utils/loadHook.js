/**
 * Replaces the hook in the string with some content
 * 
 * @param {String} hook Name of the hook
 * @param {String} content Content with which hook should be replaced with
 */
export default function(hook, content) {
  const regex = new RegExp(`{{\\s*${hook}\\s*}}`, 'g');

  return this.replace(regex, content);
}
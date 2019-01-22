/**
 * Replaces the hook in the string with some content
 * 
 * @param {String} hook Name of the hook
 * @param {String|Function} content Content with which hook should be replaced with
 * @param {Boolean} keepHook Hook should be present after the content is loaded
 */
export default function(hook, content, keepHook) {
  const regex = new RegExp(`{{\\s*${hook}\\s*}}`, 'g');

  const data = typeof content === 'function' ? content() : content;

  return this.replace(regex, data+(keepHook ? `{{${hook}}}` : ''));
}
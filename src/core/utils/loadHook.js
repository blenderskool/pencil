import showdown from 'showdown';
import showdownEmoji from 'showdown-emoji';

const removePara = {
  type: 'output',
  filter: text => {
    return text.replace(/<\/?p[^>]*>/ig, '');
  }
}
const converter = new showdown.Converter({
  extensions: [showdownEmoji, removePara]
});

/**
 * Replaces the hook in the string with some content
 * 
 * @param {String} hook Name of the hook
 * @param {String|Function} content Content with which hook should be replaced with
 * @param {Object} [options] Additional Options
 * @param {Boolean} options.keepHook Hook should be present after the content is loaded
 * @param {Boolean} options.asText Content should be shown as plain text.
 * @param {Boolean} options.parseMarkdown Parse markdown content as HTML
 */
export default function(hook, content, options={}) {
  const regex = new RegExp(`{{\\s*${hook}\\s*}}`, 'g');

  let data = typeof content === 'function' ? content() : content;
  if (options.asText) {
    data = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  if (options.parseMarkdown) {
    data = converter.makeHtml(data);
  }

  return this.replace(regex, data+(options.keepHook ? `{{${hook}}}` : ''));
}
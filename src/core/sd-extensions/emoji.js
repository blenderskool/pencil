import emojer from 'emojer';
import { map as emojis } from 'github-api-emojis/lib';

/**
 * Converts the emojis in markdown to github emoji images
 */
export function emoji() {
  return [
    {
      type: 'output',
      filter: text => emojer(text, "<img src=\"https://github.githubassets.com/images/icons/emoji/__EMOJI_NAME__.png\" alt=\":__EMOJI_NAME__:\" title=\":__EMOJI_NAME__:\" class=\"emoji-img emoji\">", emojis)
    }
  ];
}
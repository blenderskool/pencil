
/**
 * Removes paragraph tags
 */
export function removePara() {

  return [
    {
      type: 'output',
      filter: text => {
        return text.replace(/<\/?p[^>]*>/ig, '');
      }
    }
  ];
}
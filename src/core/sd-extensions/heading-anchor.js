/**
 * Showdown extension that is used to make h1, h2, h3
 * elements anchored links
 */
export function headingAnchor() {
  return [
    {
      type: 'html',
      regex: /(<h([1-3]) id="([^"]+?)">)(.*)(<\/h\2>)/g,
      replace: '$1<a class="anchor" href="#$3" aria-hidden="true" tabindex="-1">$4</a>$5'
    }
  ];
}
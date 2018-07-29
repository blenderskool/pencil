const regex = /<h([2-3]) id="(.*?)".*?><a.*?>(.*?)<\/a><\/h[2-3]/g;

/**
 * This function is used to generate the contents of the current page, and adds it
 * to the {{ index }} hook of the template
 */
export default function(data) {
  let index = '';
  let matches = [];
  let option = data.frontMatter.contents;
  option = typeof option === 'string' ? option.toLowerCase() : 'dense';

  /**
   * Contents is disabled for the page
   */
  if (option !== 'disable') {
    while ((matches = regex.exec(data.html)) !== null) {

      if (option === 'simple' && matches[1] === '3') continue;
      
      index += `<div${matches[1] === '3' ? ' class="indent"' : ''}>
      <a href="#${matches[2]}">${matches[3]}</a>
      </div>`;
    }

    // This does the check if index of the page, must be shown or not
    if (index)
      index = '<div>Contents</div>' + index;
  }


  return data.html.loadHook('index', index);
}
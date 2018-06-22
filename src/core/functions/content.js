const regex = /<h([2-3]) id="(.*?)".*?><a.*?>(.*?)<\/a><\/h[2-3]/g;

/**
 * This function is used to generate the contents of the current page, and adds it
 * to the {{ index }} hook of the template
 */
export default function(data) {

  let index = '<div>Contents</div>';
  let matches = [];

  while ((matches = regex.exec(data)) !== null) {
    index += `<div${matches[1] === '3' ? ' class="indent"' : ''}>
    <a href="#${matches[2]}" aria-hidden="true">${matches[3]}</a>
    </div>`;
  }

  return data.replace('{{ index }}', index);
}
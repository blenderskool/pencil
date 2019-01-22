import path from 'path';

export default class {

  constructor(conf) {
    const config = require(conf);

    /**
     * Empty objects marks the start and end of the sidebar links
     */
    this.sidebar = [{}, {}];

    if (Array.isArray(config.sidebar) && config.sidebar.length) {
      config.sidebar.forEach(item => {
        /**
         * If the item is of link type and has the 2nd item as well
         */
        if (Array.isArray(item) && item.length >= 2) {
          if (typeof item[1] === 'string') {
            this.addToSidebar(item[0], item[1]);
          }
          else if (item[1] && typeof item[1] === 'object') {
            Object.keys(item[1]).forEach(key => this.addToSidebar(key, item[1][key], { parent: item[0] }));
          }
        }
      });
    }
  }

  /**
   * Adds link to the sidebar array
   * @param {String} name Name of the link as it should be stored
   * @param {String} link Path to the file
   * @param {Object} meta Meta data for the link
   */
  addToSidebar(name, link, meta) {
    const parsed = path.parse(link);

    if (parsed.base === 'index.html') parsed.name = '';

    /**
     * Add the link to the end of the sidebar just before {}
     */
    this.sidebar.splice(this.sidebar.length - 1, 0, {
      name: name,
      link: link,
      // Simplified path is the path with the slashes removed.
      simplified: (parsed.dir + parsed.name).replace(/(\\)|(\/)/g, ''),
      ...meta
    });
  }

  /**
   * Returns an array of neighbouring links for given link
   * @param {String} link Link for which neighbouring links should be found
   */
  getLinks(link) {
    /**
     * Clean the link
     */
    const parsed = path.parse(link);
    if (parsed.base === 'index.md') parsed.name = '';
    const simplified = (parsed.dir + parsed.name).replace(/(\\)|(\/)/g, '');

    /**
     * Find the index of the link in the sidebar array
     */
    const index = this.sidebar.findIndex(item => item.simplified === simplified);

    /**
     * Return a slice of sidebar based on the index
     */
    return this.sidebar.slice(index === 0 ? 0 : index-1, index+2);
  }

}
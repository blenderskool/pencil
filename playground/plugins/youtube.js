module.exports = {
  template: function(element, config) {

    config.darkTheme.toggle = false;

    return {
      tag: 'div',
      attributes: {
        class: 'video-container'
      },
      children: [{
        tag: 'iframe',
        attributes: {
          width: 560,
          height: 315,
          tabindex: -1,
          src: 'https://www.youtube.com/embed/'+element.innerHTML.trim()+'?rel=0',
          frameborder: 0,
          allow: 'autoplay; encrypted-media',
          allowfullscreen: true
        }
      }]
    }
  },
  styles: function() {
    return {
      '.video-container': {
        width: '560px',
        height: '315px',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '30px',
        maxWidth: '100%'
      },
      '.video-container iframe': {
        width: '100%'
      }
    }
  }
}
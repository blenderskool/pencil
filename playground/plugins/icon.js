module.exports = {
	template: function(element) {

    var classList = ['icon'];
    var name = element.innerHTML.trim();

    element.attributes.forEach(function(attribute) {
      if (attribute.name === 'type') {
        if (attribute.value === 'ios')
          classList.push('ion-ios-'+name);
        else if (attribute.value === 'logo')
          classList.push('ion-logo-'+name);
        else
          classList.push('ion-md-'+name);
      }
    });

    if (classList.length === 1) classList.push('ion-md-'+name);
    
    return {
      tag: 'i',
      attributes: {
        class: classList.join(' ')
      }
    }
  }
}
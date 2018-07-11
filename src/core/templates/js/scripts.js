function toggleSidebar() {
  const sidebar = document.getElementsByClassName('sidebar')[0];

  sidebar.classList.toggle('sidebar-active');
}

function toggleDark(ele) {
  document.body.classList.toggle('dark');
  
  /**
   * Change the icon of the button
   */
  ele.innerHTML =  ele.innerHTML === '<i class="icon ion-ios-sunny"></i>' ?
  '<i class="icon ion-ios-moon"></i>' : '<i class="icon ion-ios-sunny"></i>';

  /**
   * Store this in session storage
   */
  sessionStorage.setItem('docbook-data', JSON.stringify({
    darkTheme: document.body.classList.contains('dark')
  }));
}

/**
 * Use the session storage data on page load
 */
(function() {
  const data = JSON.parse(sessionStorage.getItem('docbook-data'));
  if (!data) return;

  const button = document.querySelector('button.theme-toggle');

  if (data.darkTheme) {
    document.body.classList.add('dark');
    button.innerHTML = '<i class="icon ion-ios-sunny"></i>';
  }
  else if (data.darkTheme === false) {
    document.body.classList.remove('dark');
    button.innerHTML = '<i class="icon ion-ios-moon"></i>';
  }

})();
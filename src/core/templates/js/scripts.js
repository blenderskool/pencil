function toggleSidebar() {
  const sidebar = document.getElementsByClassName('sidebar')[0];

  sidebar.classList.toggle('sidebar-active');
}

function toggleDark(ele) {
  document.body.classList.toggle('dark');
  
  ele.innerHTML =  ele.innerHTML === '<i class="icon ion-ios-sunny"></i>' ?
  '<i class="icon ion-ios-moon"></i>' : '<i class="icon ion-ios-sunny"></i>';
}
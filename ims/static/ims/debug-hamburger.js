// Debug script for hamburger menu
document.addEventListener('DOMContentLoaded', function() {
  console.log('Debug script loaded');
  
  // Check if elements exist
  const burgerMenu = document.querySelector('.burger-menu');
  const dropdownMenu = document.getElementById('dropdownMenu');
  
  console.log('Burger menu element:', burgerMenu);
  console.log('Dropdown menu element:', dropdownMenu);
  
  // Add a simple click handler for testing
  if (burgerMenu) {
    burgerMenu.addEventListener('click', function(event) {
      console.log('Burger menu clicked');
      event.preventDefault();
      event.stopPropagation();
      
      if (dropdownMenu) {
        console.log('Current dropdown menu classes:', dropdownMenu.className);
        dropdownMenu.classList.toggle('show');
        console.log('After toggle, dropdown menu classes:', dropdownMenu.className);
      }
    });
  }
});

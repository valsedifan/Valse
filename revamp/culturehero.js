// Initialize Isotope on the grid container
var isoaccomp = new Isotope('.accomplissementss', {
  itemSelector: '.accomplissement', // Select individual grid items
  layoutMode: 'fitRows' // Use the "fitRows" layout (you can change to another if needed)
});

// Bind click events to filter buttons
var accompButtons = document.querySelectorAll('filter-button-accomp li');
accompButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    // Remove "active" class from all buttons
    accompButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });

    // Add "active" class to the clicked button
    this.classList.add('active');

    // Get the filter value from the button's data-filter attribute
    var filterValue = this.getAttribute('data-filter');
    // Apply filter to Isotope
    isoaccomp.arrange({
      filter: filterValue
    });
  });
});

// Initialize Isotope on the grid container
var isoculture = new Isotope('.heroculture', {
  itemSelector: '.cultureitem', // Select individual grid items
  layoutMode: 'fitRows' // Use the "fitRows" layout (you can change to another if needed)
});

// Bind click events to filter buttons
var accompButtons = document.querySelectorAll('filter-button-herocult li');
accompButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    // Remove "active" class from all buttons
    accompButtons.forEach(function(btn) {
      btn.classList.remove('activetwo');
    });

    // Add "active" class to the clicked button
    this.classList.add('activetwo');

    // Get the filter value from the button's data-filter attribute
    var filterValue = this.getAttribute('data-filter');
    // Apply filter to Isotope
    isoculture.arrange({
      filter: filterValue
    });
  });
});

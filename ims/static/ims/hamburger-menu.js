document.addEventListener('DOMContentLoaded', function () {
  console.log('Hamburger menu script loaded');

  // Get the hamburger menu button and dropdown
  const burgerMenu = document.querySelector('.burger-menu');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const body = document.body;
  let menuOpen = false; // Track menu state

  if (!burgerMenu) {
    console.error('Hamburger menu button not found');
    return;
  }

  if (!dropdownMenu) {
    console.error('Dropdown menu not found');
    return;
  }

  console.log('Hamburger menu elements found');

  // Create hamburger icon with three lines if it doesn't have children
  if (burgerMenu.childElementCount === 0) {
    burgerMenu.textContent = ''; // Remove the ☰ character

    // Create three lines for the hamburger icon
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('span');
      line.className = 'burger-line';
      burgerMenu.appendChild(line);
    }
  }

  // Function to show offices list in the sidebar
  const toggleOfficesBtn = document.getElementById('toggleOffices');
  const officeList = document.getElementById('officeList');
  const toggleIcon = toggleOfficesBtn
    ? toggleOfficesBtn.querySelector('.toggle-icon')
    : null;

  if (toggleOfficesBtn && officeList) {
    console.log('Office toggle elements found');

    toggleOfficesBtn.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      console.log('Toggle offices clicked');
      officeList.classList.toggle('hidden');

      // Rotate the toggle icon
      if (toggleIcon) {
        if (officeList.classList.contains('hidden')) {
          toggleIcon.style.transform = 'rotate(0deg)';
        } else {
          toggleIcon.style.transform = 'rotate(180deg)';
        }
      }
    });
  } else {
    console.error('Office toggle elements not found');
  }

  // Function to open the dropdown menu
  function openMenu() {
    dropdownMenu.classList.add('show');
    body.classList.add('menu-open');
    menuOpen = true;
  }

  // Function to close the dropdown menu
  function closeMenu() {
    dropdownMenu.classList.remove('show');
    body.classList.remove('menu-open');
    burgerMenu.classList.remove('active');
    menuOpen = false;
  }

  // Function to toggle the dropdown menu
  function toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent the click from propagating
    console.log('Toggle menu clicked, current state:', menuOpen);

    // Toggle the active class for animation
    burgerMenu.classList.toggle('active');

    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Add click event to the hamburger menu
  burgerMenu.addEventListener('click', toggleMenu);

  // Close the dropdown when clicking outside
  document.addEventListener('click', function (event) {
    // Only handle clicks when the menu is open
    if (menuOpen) {
      // Check if the click is outside the dropdown and not on the burger menu
      if (
        !dropdownMenu.contains(event.target) &&
        !burgerMenu.contains(event.target)
      ) {
        closeMenu();
      }
    }
  });

  // Close the dropdown when pressing Escape key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuOpen) {
      closeMenu();
    }
  });

  // Prevent clicks inside the dropdown from closing it
  dropdownMenu.addEventListener('click', function (event) {
    // Only stop propagation if it's not the logout button
    if (!event.target.closest('button[type="submit"]')) {
      event.stopPropagation();
    }
  });

  // Menu items have been removed

  // Fetch offices data for dropdowns
  fetch('/ims/get-offices/')
    .then((response) => response.json())
    .then((data) => {
      let officeDropdowns = [
        document.getElementById('office_name'),
        document.getElementById('office_name_choice'),
      ];

      officeDropdowns.forEach((dropdown) => {
        if (dropdown) {
          dropdown.innerHTML = ''; // Reset options

          data.offices.forEach((office) => {
            let option = document.createElement('option');
            option.value = office.id; // Store the office ID as value
            option.textContent = office.office_code;
            dropdown.appendChild(option);
          });
        }
      });
    })
    .catch((error) => console.error('Error fetching offices:', error));

  // Add click handlers to office list buttons
  const officeListButtons = document.querySelectorAll('.OfficeListButton');
  let currentFilter = null;

  // Function to extract abbreviation from office name
  function extractOfficeAbbreviation(officeName) {
    // Check if the office name contains an abbreviation in parentheses
    const abbreviationMatch = officeName.match(/\(([A-Z]+)\)/);
    if (abbreviationMatch && abbreviationMatch[1]) {
      return abbreviationMatch[1]; // Return the abbreviation
    }
    return officeName; // Return the original name if no abbreviation found
  }

  // Function to filter members table by office name
  function filterTableByOffice(officeName) {
    console.log('Filtering table by office:', officeName);

    // Only select rows from the main table, not the modal
    const mainTable = document.querySelector('main.content1 > table');
    if (!mainTable) {
      console.error('Main table not found!');
      return;
    }

    const tableRows = mainTable.querySelectorAll('tbody tr');
    console.log('Found table rows:', tableRows.length);

    // Create a filter indicator if it doesn't exist
    let filterIndicator = document.querySelector('.filter-indicator');
    if (!filterIndicator) {
      filterIndicator = document.createElement('div');
      filterIndicator.className = 'filter-indicator';
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer) {
        searchContainer.appendChild(filterIndicator);
      }
    }

    // If officeName is null, clear the filter
    if (officeName === null) {
      tableRows.forEach((row) => {
        row.style.display = '';
      });
      filterIndicator.style.display = 'none';
      return;
    }

    // Extract the abbreviation from the office name (e.g., "BENRO" from "Bulacan Environment and Natural Resources Office (BENRO)")
    const officeAbbreviation = extractOfficeAbbreviation(officeName);
    console.log('Office abbreviation:', officeAbbreviation);

    // Update the filter indicator
    filterIndicator.textContent = `Filtering by: ${officeName}`;
    filterIndicator.style.display = 'block';

    // Add a clear filter button
    if (!filterIndicator.querySelector('.clear-filter')) {
      const clearButton = document.createElement('button');
      clearButton.className = 'clear-filter';
      clearButton.textContent = 'Clear Filter';
      clearButton.addEventListener('click', function () {
        filterTableByOffice(null);
        officeListButtons.forEach((btn) => btn.classList.remove('active'));
        currentFilter = null;
      });
      filterIndicator.appendChild(clearButton);
    }

    let visibleRows = 0;

    tableRows.forEach((row) => {
      // Skip the "No members found" row
      if (row.cells.length === 1 && row.cells[0].colSpan) {
        return;
      }

      try {
        // Get the text content from the office column (third column)
        const officeCell = row.cells[2];
        const office = officeCell ? officeCell.textContent.toLowerCase() : '';

        // Show the row if either the full office name or the abbreviation is found in the office column
        if (
          office.includes(officeName.toLowerCase()) ||
          office.includes(officeAbbreviation.toLowerCase())
        ) {
          row.style.display = '';
          visibleRows++;
        } else {
          row.style.display = 'none';
        }
      } catch (error) {
        console.error('Error processing row:', error);
      }
    });

    // Check if all rows are hidden, show a message
    try {
      // Find or create the "no results" row
      let noResultsRow = mainTable.querySelector('.no-results-row');
      if (visibleRows === 0) {
        console.log('No results found, showing message');
        if (!noResultsRow) {
          noResultsRow = document.createElement('tr');
          noResultsRow.className = 'no-results-row';
          const cell = document.createElement('td');
          cell.colSpan = 6; // Adjust based on your table columns
          cell.textContent = `No members found in ${officeAbbreviation}.`;
          cell.style.textAlign = 'center';
          noResultsRow.appendChild(cell);

          const tbody = mainTable.querySelector('tbody');
          if (tbody) {
            tbody.appendChild(noResultsRow);
          } else {
            console.error('Table body not found');
          }
        } else {
          noResultsRow.querySelector(
            'td'
          ).textContent = `No members found in ${officeAbbreviation}.`;
        }
        noResultsRow.style.display = '';
      } else if (noResultsRow) {
        noResultsRow.style.display = 'none';
      }
    } catch (error) {
      console.error('Error handling no results row:', error);
    }
  }

  officeListButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const officeName = this.textContent.trim();
      console.log('Office selected:', officeName);

      // Clear the search input to avoid conflicts
      const searchInput = document.getElementById('memberSearch');
      if (searchInput) {
        searchInput.value = '';
      }

      // If clicking the same office again, toggle the filter off
      if (currentFilter === officeName) {
        officeListButtons.forEach((btn) => btn.classList.remove('active'));
        filterTableByOffice(null);
        currentFilter = null;
      } else {
        // Highlight the selected office button
        officeListButtons.forEach((btn) => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter the table by the selected office
        filterTableByOffice(officeName);
        currentFilter = officeName;
      }
    });
  });
});

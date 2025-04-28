document.addEventListener('DOMContentLoaded', function () {
  console.log('Search script loaded');
  const searchInput = document.getElementById('memberSearch');

  if (!searchInput) {
    console.error('Search input not found!');
    return;
  }

  console.log('Search input found:', searchInput);

  // Clear any active office filter when searching
  searchInput.addEventListener('focus', function () {
    // Check if there's an active office filter
    const activeOfficeButton = document.querySelector(
      '.OfficeListButton.active'
    );
    if (activeOfficeButton) {
      // Clear the office filter
      const filterIndicator = document.querySelector('.filter-indicator');
      if (filterIndicator && filterIndicator.style.display !== 'none') {
        // Trigger a click on the clear filter button
        const clearFilterBtn = filterIndicator.querySelector('.clear-filter');
        if (clearFilterBtn) {
          clearFilterBtn.click();
        }
      }
    }
  });

  searchInput.addEventListener('input', function () {
    console.log('Search input event triggered');
    const searchTerm = this.value.toLowerCase().trim();
    console.log('Search term:', searchTerm);

    // Only select rows from the main table, not the modal
    const mainTable = document.querySelector('main.content1 > table');
    if (!mainTable) {
      console.error('Main table not found!');
      return;
    }
    const tableRows = mainTable.querySelectorAll('tbody tr');
    console.log('Found table rows:', tableRows.length);

    tableRows.forEach((row) => {
      // Skip the "No members found" row
      if (row.cells.length === 1 && row.cells[0].colSpan) {
        return;
      }

      try {
        // Get the text content from the name column (first column)
        const nameCell = row.cells[0];
        const name = nameCell ? nameCell.textContent.toLowerCase() : '';

        // Get the text content from the office column (third column)
        const officeCell = row.cells[2];
        const office = officeCell ? officeCell.textContent.toLowerCase() : '';

        // Get the text content from the position column (fourth column)
        const positionCell = row.cells[3];
        const position = positionCell
          ? positionCell.textContent.toLowerCase()
          : '';

        const statusCell = row.cells[4];
        const status = statusCell
          ? statusCell.textContent.toLowerCase()
          : '';

        // Show the row if the search term is found in any of the searched fields
        if (
          name.includes(searchTerm) ||
          office.includes(searchTerm) ||
          position.includes(searchTerm) ||
          status.includes(searchTerm)
        ) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      } catch (error) {
        console.error('Error processing row:', error);
      }
    });

    // Check if all rows are hidden, show a message
    try {
      let allHidden = true;
      let visibleRows = 0;

      tableRows.forEach((row) => {
        if (row.style.display !== 'none' && row.cells.length > 1) {
          allHidden = false;
          visibleRows++;
        }
      });

      console.log('Visible rows:', visibleRows);

      // Find or create the "no results" row
      let noResultsRow = mainTable.querySelector('.no-results-row');
      if (allHidden && searchTerm !== '') {
        console.log('No results found, showing message');
        if (!noResultsRow) {
          noResultsRow = document.createElement('tr');
          noResultsRow.className = 'no-results-row';
          const cell = document.createElement('td');
          cell.colSpan = 6; // Adjust based on your table columns
          cell.textContent = 'No matching members found.';
          cell.style.textAlign = 'center';
          noResultsRow.appendChild(cell);

          const tbody = mainTable.querySelector('tbody');
          if (tbody) {
            tbody.appendChild(noResultsRow);
          } else {
            console.error('Table body not found');
          }
        }
        noResultsRow.style.display = '';
      } else if (noResultsRow) {
        noResultsRow.style.display = 'none';
      }
    } catch (error) {
      console.error('Error handling no results row:', error);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  console.log('Status filter script loaded');
  const statusFilter = document.getElementById('memberFilter');

  if (!statusFilter) {
    console.error('Status filter dropdown not found!');
    return;
  }

  console.log('Status filter dropdown found:', statusFilter);

  // Add status indicators to the table
  addStatusIndicators();

  // Function to add status indicators to the table
  function addStatusIndicators() {
    const mainTable = document.querySelector('main.content1 > table');
    if (!mainTable) {
      console.error('Main table not found!');
      return;
    }

    const tableRows = mainTable.querySelectorAll('tbody tr');
    console.log('Adding status indicators to rows:', tableRows.length);

    tableRows.forEach((row) => {
      // Skip the "No members found" row
      if (row.cells.length === 1 && row.cells[0].colSpan) {
        return;
      }

      try {
        // Get the status cell (6th column - index 0) and ends date cell (6th column - index 5)
        const statusCell = row.cells[4];
        const endDateCell  = row.cells[6];

        if (!statusCell || !endDateCell ) return;

        // Store the original HTML content
        const originalStatusContent = statusCell.innerHTML;
        const originalEndDateContent  = endDateCell.innerHTML;

        // Clear the status cell to rebuild it
        statusCell.innerHTML = '';

        // Split the content by <br> tags
        const statusEntries = originalStatusContent.split('<br>');
        const endDateEntries = originalEndDateContent.split('<br>');

        console.log('Status entries:', statusEntries);
        console.log('Start date entries:', endDateEntries );

        // Process each status entry
        statusEntries.forEach((entry, index) => {
          // Skip empty entries
          if (!entry.trim()) return;

          // Create a temporary div to parse the HTML content
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = entry;
          const statusText = tempDiv.textContent.trim();

          if (statusText) {
            // Get the corresponding start date if available  
            const startDateText =
              index < endDateEntries .length
                ? endDateEntries [index].trim()
                : '';

            // Create the status indicator
            const indicator = document.createElement('span');
            indicator.className = 'status-indicator';

            // Determine if active based on the corresponding start date
            const isActiveStatus = isActive(startDateText);
            console.log(
              `Status: ${statusText}, Date: ${startDateText}, Active: ${isActiveStatus}`
            );

            // Add the appropriate class
            indicator.classList.add(
              isActiveStatus ? 'status-active' : 'status-inactive'
            );

            // Create a wrapper for the status with indicator
            const statusWrapper = document.createElement('span');
            statusWrapper.appendChild(indicator);
            statusWrapper.appendChild(document.createTextNode(statusText));

            // Add to the cell
            statusCell.appendChild(statusWrapper);

            // Add a line break if not the last entry
            if (
              index < statusEntries.length - 1 &&
              statusEntries[index + 1].trim()
            ) {
              statusCell.appendChild(document.createElement('br'));
            }
          }
        });
      } catch (error) {
        console.error('Error adding status indicators:', error);
      }
    });
  }

  // Function to determine if a member is active based on start date
  function isActive(startDateStr) {
    if (!startDateStr || startDateStr.trim() === 'N/A') {
      return false; // If no start date, consider inactive
    }

    try {
      // Parse the date from the format displayed in the table (DD/MM/YYYY)
      const parts = startDateStr.split('/');
      if (parts.length !== 3) {
        console.log('Invalid date format:', startDateStr);
        return false; // Invalid date format
      }

      // Create date object (month is 0-indexed in JS)
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed month
      const year = parseInt(parts[2], 10);

      // Handle special case for dates like 11/11/0111 or 11/11/0001
      // These are likely placeholder dates and should be considered inactive
      if (year < 1000) {
        return false;
      }

      const startDate = new Date(year, month, day);

      // Use a fixed date for testing (May 5, 2025)
      // This ensures consistent behavior regardless of when the code runs
      const currentDate = new Date(); // May 5, 2025 (month is 0-indexed)

      console.log(
        `Comparing dates - Start: ${startDate}, Current: ${currentDate}`
      );

      // Set time to 00:00:00 for both dates to compare just the dates
      startDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      // If current date is on or before start date, the account is active
      const result = currentDate <= startDate;
      console.log(`Is active: ${result} for date ${startDateStr}`);
      return result;
    } catch (error) {
      console.error(
        'Error parsing date:',
        error,
        'for date string:',
        startDateStr
      );
      return false;
    }
  }

  // Function to filter members table by status
  function filterTableByStatus(status) {
    console.log('Filtering table by status:', status);

    // Only select rows from the main table, not the modal
    const mainTable = document.querySelector('main.content1 > table');
    if (!mainTable) {
      console.error('Main table not found!');
      return;
    }

    const tableRows = mainTable.querySelectorAll('tbody tr');
    console.log('Found table rows:', tableRows.length);

    let visibleRows = 0;

    tableRows.forEach((row) => {
      // Skip the "No members found" row
      if (row.cells.length === 1 && row.cells[0].colSpan) {
        return;
      }

      try {
        // Get the start date cell (6th column - index 5)
        const endDateCell  = row.cells[6];
        if (!endDateCell ) return;

        // Store the original HTML content
        const originalEndDateContent  = endDateCell.innerHTML;

        // Split the content by <br> tags
        const endDateEntries = originalEndDateContent.split('<br>');

        // Process each start date entry
        let hasActiveDate = false;
        let hasInactiveDate = false;

        endDateEntries.forEach((entry) => {
          // Skip empty entries
          if (!entry.trim()) return;

          // Create a temporary div to parse the HTML content
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = entry;
          const startDateText = tempDiv.textContent.trim();

          // Check if this date makes the account active
          if (isActive(startDateText)) {
            hasActiveDate = true;
          } else {
            hasInactiveDate = true;
          }
        });

        // If no dates found, consider inactive
        if (
          endDateEntries.length === 0 ||
          (endDateEntries.length === 1 && !endDateEntries[0].trim())
        ) {
          hasInactiveDate = true;
        }

        // Show/hide row based on selected filter
        if (
          status === 'all' ||
          (status === 'active' && hasActiveDate) ||
          (status === 'inactive' && hasInactiveDate)
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
          cell.colSpan = 9; // Adjust based on your table columns
          cell.textContent = `No ${status} members found.`;
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
          ).textContent = `No ${status} members found.`;
        }
        noResultsRow.style.display = '';
      } else if (noResultsRow) {
        noResultsRow.style.display = 'none';
      }
    } catch (error) {
      console.error('Error handling no results row:', error);
    }
  }

  // Add event listener to the status filter dropdown
  statusFilter.addEventListener('change', function () {
    const selectedStatus = this.value;
    console.log('Status filter changed to:', selectedStatus);

    // Clear the search input to avoid conflicts
    const searchInput = document.getElementById('memberSearch');
    if (searchInput) {
      searchInput.value = '';
    }

    // Clear any active office filter
    const activeOfficeButton = document.querySelector(
      '.OfficeListButton.active'
    );
    if (activeOfficeButton) {
      const filterIndicator = document.querySelector('.filter-indicator');
      if (filterIndicator && filterIndicator.style.display !== 'none') {
        const clearFilterBtn = filterIndicator.querySelector('.clear-filter');
        if (clearFilterBtn) {
          clearFilterBtn.click();
        }
      }
    }

    // Apply the selected filter
    filterTableByStatus(selectedStatus);
  });
});

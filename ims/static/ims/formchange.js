

// Utility function to check if an element (or its parent container) is visible
function isVisible(element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}
`
// Civil Status Change
document.querySelectorAll('#civil_status').forEach((civilStatus) => {
  civilStatus.addEventListener('change', function () {
    document.querySelectorAll('#spouse_name').forEach((spouseNameRow) => {
      if (this.value === 'married' || this.value === 'widowed') {
        spouseNameRow.style.display = 'table-row';
      } else {
        spouseNameRow.style.display = 'none';
     }
    });
  });
});

// Has Children Checkbox
document.querySelectorAll('#has_children').forEach((hasChildrenCheckbox) => {
  hasChildrenCheckbox.addEventListener('change', function () {
    document
      .querySelectorAll('#childrenContainer')
      .forEach((childrenContainer) => {
        // Ensure it updates even if hidden
        childrenContainer.style.display = this.checked ? 'block' : 'none';
      });
  });

  // Ensure correct state on load (for pre-filled forms)
  if (hasChildrenCheckbox.checked) {
    document
      .querySelectorAll('#childrenContainer')
      .forEach((childrenContainer) => {
        childrenContainer.style.display = 'block';
      });
  }
});


`




// Add Child
document.querySelectorAll('#addChild').forEach((addChildBtn) => {
  console.log('Add child button found');
  addChildBtn.addEventListener('click', function () {
    console.log('Add child button clicked');
    document.querySelectorAll('#childrenContainer').forEach((container) => {
      if (isVisible(container)) {
        let newChild = container.querySelector('.child-entry').cloneNode(true);
        newChild
          .querySelectorAll('input')
          .forEach((input) => (input.value = ''));
        container.appendChild(newChild);
      }
    });
  });
});

// Add Beneficiary
document.querySelectorAll('#addBeneficiary').forEach((addBeneficiaryBtn) => {
  addBeneficiaryBtn.addEventListener('click', function () {
    document.querySelectorAll('#beneficiaryContainer').forEach((container) => {
      if (isVisible(container)) {
        let newBeneficiary = container
          .querySelector('.beneficiary-entry')
          .cloneNode(true);
        newBeneficiary
          .querySelectorAll('input, select')
          .forEach((input) => (input.value = ''));
        container.appendChild(newBeneficiary);
      }
    });
  });
});



// Add Work Detail
document.querySelectorAll('#addWorkDetail').forEach((addWorkDetailBtn) => {
  addWorkDetailBtn.addEventListener('click', function () {
    console.log('We are inside the addWorkDetail click event');
    const modal = addWorkDetailBtn.closest('.modal-content');
    if (modal && modal.querySelector('#addMemberForm')) {
      const workDetailsContainer = modal.querySelector('#workDetailsContainer');
      console.log('We found the work details container:', workDetailsContainer);
      const workEntry = workDetailsContainer.querySelector('.work-entry');
      console.log('We found the work entry:', workEntry);
      if (workEntry) {
        // Clone the work entry
        const newWorkEntry = workEntry.cloneNode(true);
        console.log('We cloned the work entry:', newWorkEntry);
        // Clear all input values
        newWorkEntry.querySelectorAll('input, select').forEach((input) => (input.value = ''));
        console.log('We cleared the input values');
        // Get the selected office from dropdown if available
        let officeNameSelect = newWorkEntry.querySelector("select[name='office_name']");
        let officeNameChoice = document.querySelector('#office_name_choice');
        console.log('We got the office name select and choice');
        // If we have both dropdowns and the choice dropdown has options
        if (
          officeNameSelect &&
          officeNameChoice &&
          officeNameChoice.options.length > 0 &&
          officeNameChoice.selectedIndex > 0
        ) {
          console.log('We have both dropdowns and the choice dropdown has options');
          // Set the selected value in the new entry's dropdown
          const selectedValue = officeNameChoice.value;
          if (selectedValue) {
            officeNameSelect.value = selectedValue;
            console.log('We set the selected value in the new entry\'s dropdown');
          }
        }
        // Add the new work entry to the work details container
        workDetailsContainer.appendChild(newWorkEntry);
        console.log('We added the new work entry to the work details container');
        // Add a small animation to highlight the new entry
        newWorkEntry.style.animation = 'fadeIn 0.5s';
        console.log('We added the animation to the new entry');
        // Scroll to the new entry
        setTimeout(() => {
          newWorkEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log('We scrolled to the new entry');
        }, 100);
      } else {
        console.log('We did not find the work entry');
      }
    } else {
      console.log('We are inside the edit member modal, so we will not add work details');
    }
  });
});







// Add fadeIn animation to CSS
if (!document.getElementById('fadeInAnimation')) {
  const style = document.createElement('style');
  style.id = 'fadeInAnimation';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

`
// Fetch Staff and Populate All Staff Dropdowns (Ensures hidden dropdowns update when shown)
document.addEventListener('DOMContentLoaded', function () {
  fetch('/ims/get-staff/')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      document
        .querySelectorAll('#staff_approved_by')
        .forEach((staffDropdown) => {
          staffDropdown.innerHTML = '<option value="">Select_Staff</option>'; // Reset options

          data.forEach((staff) => {
            let option = document.createElement('option');
            option.value = staff.id;
            option.textContent = staff.staff_name;
            staffDropdown.appendChild(option);
          });
        });
    })
    .catch((error) => console.error('Error fetching staff list:', error));
});

document.addEventListener('DOMContentLoaded', function () {
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
});

// Dropdown menu functionality moved to hamburger-menu.js`











// Select all checkboxes with class "delete-checkbox"
const checkboxes = document.querySelectorAll('.delete-checkbox');

// Select the button element
const deleteButton = document.getElementById('DeleteMember');

// Function to toggle button visibility based on checkbox state
function toggleButtonVisibility() {
  const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  if (anyChecked) {
    deleteButton.style.display = 'block';
  } else {
    deleteButton.style.display = 'none';
  }
}

// Add event listener to each checkbox to call toggleButtonVisibility on change
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', toggleButtonVisibility);
});

// Initial call to toggleButtonVisibility to set initial state
toggleButtonVisibility();

















const eduStartDateInput = document.querySelector('#edu_start_date');
const eduEndDateInput = document.querySelector('#edu_end_date');



const currentYear = new Date().getFullYear();
const len = 65
const minYear = currentYear - len;
const maxYear = currentYear + len;



// Add event listeners to input fields
eduStartDateInput.addEventListener('blur', function() {
  const inputValue = eduStartDateInput.value;
  if (inputValue) {
    const year = parseInt(inputValue.split('-')[0]);
    if (year < minYear) {
      eduStartDateInput.value = `${minYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
    } else if (year > currentYear) {
      eduStartDateInput.value = `${currentYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
    }
    checkDateRange(eduStartDateInput, eduEndDateInput);
  }
});

eduEndDateInput.addEventListener('blur', function() {
  const inputValue = eduEndDateInput.value;
  if (inputValue) {
    const year = parseInt(inputValue.split('-')[0]);
    if (year > maxYear) {
      eduEndDateInput.value = `${maxYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
    } else if (year < minYear) {
      eduEndDateInput.value = `${minYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
    }
    checkDateRange(eduStartDateInput, eduEndDateInput);
  }
});

// Select all inputs with class start_date
const startDateInputs = document.querySelectorAll('.start_date');

// Add event listeners to each input field
startDateInputs.forEach(function(inputField) {
  inputField.addEventListener('blur', function() {
    const inputValue = this.value;
    if (inputValue) {
      const year = parseInt(inputValue.split('-')[0]);
      if (year < minYear) {
        this.value = `${minYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      } else if (year > currentYear) {
        this.value = `${currentYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      }
      checkDateRange(this, endDateInputs[Array.prototype.indexOf.call(startDateInputs, this)]);
    }
  });
});

const endDateInputs = document.querySelectorAll('.end_date');

// Add event listeners to each input field
endDateInputs.forEach(function(inputField) {
  inputField.addEventListener('blur', function() {
    const inputValue = this.value;
    if (inputValue) {
      const year = parseInt(inputValue.split('-')[0]);
      if (year > maxYear) {
        this.value = `${maxYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      } else if (year < minYear) {
        this.value = `${minYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      }
      checkDateRange(startDateInputs[Array.prototype.indexOf.call(endDateInputs, this)], this);
    }
  });
});

function checkDateRange(startDateInput, endDateInput) {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  if (startDate > endDate) {
    startDateInput.value = endDateInput.value;
  }
}



const dateOfBirthInput = document.querySelector('#date_of_birth');

const issuedDateInputs = document.querySelectorAll('.issued-date');

dateOfBirthInput.addEventListener('blur', function() {
  const inputValue = dateOfBirthInput.value;
  if (inputValue) {
    const year = parseInt(inputValue.split('-')[0]);
    if (year < currentYear - len) {
      dateOfBirthInput.value = `${currentYear - len}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
    } else if (year > currentYear) {
      dateOfBirthInput.value = `${currentYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
    }
  }
});



issuedDateInputs.forEach(function(input) {
  input.addEventListener('blur', function() {
    const inputValue = input.value;
    if (inputValue) {
      const year = parseInt(inputValue.split('-')[0]);
      if (year < currentYear - len) {
        input.value = `${currentYear - len}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      } else if (year > currentYear) {
        input.value = `${currentYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      }
    }
  });
});

//check again
// Select all inputs with class child_birth_date
const childBirthDateInputs = document.querySelectorAll('.child_birth_date');
// Add event listeners to each input field
childBirthDateInputs.forEach(function(input) {
  input.addEventListener('blur', function() {
    const inputValue = input.value;
    if (inputValue) {
      const year = parseInt(inputValue.split('-')[0]);
      if (year < currentYear - len) {
        input.value = `${currentYear - len}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      } else if (year > currentYear) {
        input.value = `${currentYear}-${inputValue.split('-')[1]}-${inputValue.split('-')[2]}`;
      }
    }
  });
});














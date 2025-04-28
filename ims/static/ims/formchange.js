

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

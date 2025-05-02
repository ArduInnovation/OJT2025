
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
        document
          .querySelectorAll('#addChild')
          .forEach((addChildButton) => {
            addChildButton.style.display = this.checked ? 'block' : 'none';
          });
      });
  });
});

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
  const modal = document.getElementById('editMemberModal');
  const closeModalBtn = document.querySelector('#editMemberModal .close');


  // Function to handle Show Office Names button clicks
  function setupShowOfficesButtons() {
    document.querySelectorAll('.show-offices-btn').forEach((button) => {
      button.removeEventListener('click', toggleOfficeNames);
      button.addEventListener('click', toggleOfficeNames);
    });
  }





  
  // Function to toggle office names display
  function toggleOfficeNames(event) {
    const container = event.target.nextElementSibling;
    if (container && container.classList.contains('office-names-container')) {
      if (container.style.display === 'none') {
        // Show the container and populate it with office names
        container.style.display = 'block';
        container.innerHTML =
          '<h4>Available Offices:</h4><ul class="office-list"></ul>';
        const officeList = container.querySelector('.office-list');

        // Get offices from global data or fetch if not available
        if (window.officesData && window.officesData.offices) {
          window.officesData.offices.forEach((office) => {
            const listItem = document.createElement('li');
            listItem.textContent = office.office_code;
            listItem.dataset.officeId = office.id;
            listItem.addEventListener('click', function () {
              // Set the text in the input field
              const inputContainer = container.closest(
                '.office-input-container'
              );
              const input = inputContainer
                ? inputContainer.querySelector('input.office_name')
                : null;
              if (input) {
                input.value = office.office_code;
              }
              // Hide the container after selection
              container.style.display = 'none';
            });
            officeList.appendChild(listItem);
          });
        } else {
          // Fetch offices if not available
          fetch('/ims/get-offices/')
            .then((response) => response.json())
            .then((data) => {
              window.officesData = data;
              data.offices.forEach((office) => {
                const listItem = document.createElement('li');
                listItem.textContent = office.office_code;
                listItem.dataset.officeId = office.id;
                listItem.addEventListener('click', function () {
                  // Set the text in the input field
                  const inputContainer = container.closest(
                    '.office-input-container'
                  );
                  const input = inputContainer
                    ? inputContainer.querySelector('input.office_name')
                    : null;
                  if (input) {
                    input.value = office.office_code;
                  }
                  // Hide the container after selection
                  container.style.display = 'none';
                });
                officeList.appendChild(listItem);
              });
            })
            .catch((error) => {
              console.error('Error fetching offices:', error);
              container.innerHTML =
                '<p>Error loading offices. Please try again.</p>';
            });
        }

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close-offices-btn';
        closeButton.addEventListener('click', function () {
          container.style.display = 'none';
        });
        container.appendChild(closeButton);
      } else {
        // Hide the container
        container.style.display = 'none';
      }
    }
  }

  if (!modal) {
    console.error('Modal not found!');
    return;
  }

  // Make sure the modal is initially hidden
  modal.style.display = 'none';

  document.querySelectorAll('.view-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const employmentId = this.closest('tr').children[1].textContent.trim();

      console.log('Fetching data for Employment ID:', employmentId);

      fetch('/ims/get-offices/')
        .then((response) => response.json())
        .then((data) => {
          let officeDropdown = document.getElementById('office_name');
          officeDropdown.innerHTML = '<option value="">Select Office</option>'; // Reset options

          data.offices.forEach((office) => {
            let option = document.createElement('option');
            option.value = office.id; // Store the office ID as value
            option.textContent = office.office_code;
            officeDropdown.appendChild(option);
          });
        });

      // Work details will be fetched in the main data request below

      fetch(`/ims/get_member_data/${employmentId}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Received Data: Success');

          if (data.error) {
            alert('Error: ' + data.error);
            return;
          }

          // Populate form fields with proper error handling
          const setFieldValue = (selector, value) => {
            const element = modal.querySelector(selector);
            if (element) {
              if (element.type === 'checkbox') {
                element.checked = value || false;
              } else {
                element.value = value || '';
              }
            }
          };

          // Personal Information
          setFieldValue('#employment_id', data.employment_id);
          setFieldValue('#username', data.username);
          setFieldValue('#password', ''); // Always blank for security
          setFieldValue('#first_name', data.first_name);
          setFieldValue('#last_name', data.last_name);
          setFieldValue('#middle_name', data.middle_name);
          setFieldValue('#nickname', data.nickname);
          setFieldValue('#date_of_birth', data.date_of_birth);
          setFieldValue('#age', data.age);
          setFieldValue('#civil_status', data.civil_status);
          setFieldValue('#sex', data.sex);
          setFieldValue('#spouse_name', data.spouse_name);

          // Contact & Address Information
          setFieldValue('#phone_number', data.phone_number);
          setFieldValue('#email_address', data.email_address);
          setFieldValue('#address_province', data.address_province);
          setFieldValue('#address_city', data.address_city);
          setFieldValue('#address_street', data.address_street);

          // Family Information
          setFieldValue('#father_name', data.father_name);
          setFieldValue('#mother_name', data.mother_name);
          setFieldValue('#has_children', data.has_children);

          // Education Background
          setFieldValue('#school_name', data.school_name);
          setFieldValue('#degree_units', data.degree_units);
          setFieldValue('#edu_start_date', data.edu_start_date);
          setFieldValue('#edu_end_date', data.edu_end_date);
          setFieldValue('#honors_received', data.honors_received);

          // Approval Information
          const staffApprovedDisplay = modal.querySelector(
            '#staff_approved_display'
          );
          if (staffApprovedDisplay) {
            staffApprovedDisplay.textContent =
              data.Staff_Approved_by_name || 'Not Assigned';
          }
          setFieldValue('#staff_approved_by', data.Staff_Approved_by);

          // Additional approval fields
          setFieldValue('#res_certificate_no', data.res_certificate_no);
          setFieldValue('#issued_date', data.issued_date);

          // Handling Children with improved UI
          const childrenContainer = modal.querySelector('#childrenContainer');
          if (childrenContainer) {
            childrenContainer.innerHTML = ''; // Clear existing entries

            if (data.children && data.children.length > 0) {
              childrenContainer.style.display = 'block';
              data.children.forEach((child) => {
                let newChild = document.createElement('div');
                newChild.classList.add('child-entry');
                newChild.innerHTML = `
                                    
                                    <div class="child-entry-grid">
                                        <div class="field">
                                            <label>Child's Name</label>
                                            <input type="text" name="child_name" class="child_name" placeholder="Child's Name" value="${
                                              child.child_name || ''
                                            }">
                                        </div>
                                        <div class="field">
                                            <label>Birth Date</label>
                                            <input type="date" name="child_birth_date" class="child_birth_date" value="${
                                              child.child_birth_date || ''
                                            }">
                                        </div>
                                    </div>`;
                                    
                childrenContainer.appendChild(newChild);
              });
            } else {
              childrenContainer.innerHTML = `
                          <div class="child-entry">
                            <div class="child-entry-grid">
                                <div class="field">
                                    <label>Child's Name</label>
                                    <input type="text" name="child_name" class="child_name" placeholder="Child's Name">
                                </div>
                                <div class="field">
                                    <label>Birth Date</label>
                                    <input type="date" name="child_birth_date" class="child_birth_date">
                                </div>
                            </div>
                          </div>`;
            }
          }

          // Handling Beneficiaries with improved UI
          const beneficiaryContainer = modal.querySelector(
            '#beneficiaryContainer'
          );
          if (beneficiaryContainer) {
            beneficiaryContainer.innerHTML = ''; // Clear existing entries

            if (data.beneficiaries && data.beneficiaries.length > 0) {
              data.beneficiaries.forEach((beneficiary) => {
                let newBeneficiary = document.createElement('div');
                newBeneficiary.classList.add('beneficiary-entry');
                newBeneficiary.innerHTML = `
                                    <div class="beneficiary-entry-grid">
                                        <div class="field">
                                            <label>Beneficiary Name</label>
                                            <input type="text" name="beneficiary_full_name[]" class="beneficiary_full_name"
                                                placeholder="Beneficiary Name" value="${
                                                  beneficiary.full_name || ''
                                                }" required>
                                        </div>
                                        <div class="field">
                                            <label>Beneficiary Age</label>
                                            <input type="number" name="beneficiary_age[]" class="beneficiary_age"
                                                placeholder="Beneficiary Age" value="${
                                                  beneficiary.age || ''
                                                }" required>
                                        </div>
                                        <div class="field">
                                            <label>Relationship</label>
                                            <select name="beneficiary_relationship[]" class="beneficiary_relationship" required>
                                                <option value="father" ${
                                                  beneficiary.relationship ===
                                                  'Father'
                                                    ? 'selected'
                                                    : ''
                                                }>Father</option>
                                                <option value="mother" ${
                                                  beneficiary.relationship ===
                                                  'Mother'
                                                    ? 'selected'
                                                    : ''
                                                }>Mother</option>
                                                <option value="child" ${
                                                  beneficiary.relationship ===
                                                  'Child'
                                                    ? 'selected'
                                                    : ''
                                                }>Child</option>
                                                <option value="siblings" ${
                                                  beneficiary.relationship ===
                                                  'Siblings'
                                                    ? 'selected'
                                                    : ''
                                                }>Siblings</option>
                                                <option value="other_relative" ${
                                                  beneficiary.relationship ===
                                                  'Other Relative'
                                                    ? 'selected'
                                                    : ''
                                                }>Other Relative</option>
                                            </select>
                                        </div>
                                    </div>`;
                beneficiaryContainer.appendChild(newBeneficiary);
              });
            } else {
              // Add a message if no beneficiaries
              beneficiaryContainer.innerHTML =
                '<p class="no-data-message">No beneficiaries found</p>';
            }
          }

          // Handling Work Details with improved UI
          const workDetailsContainer = modal.querySelector(
            '#workDetailsContainer'
          );
          if (workDetailsContainer) {
            workDetailsContainer.innerHTML = ''; // Clear existing entries

            if (data.work_details && data.work_details.length > 0) {
              data.work_details.forEach((workDetail) => {
                let newWorkEntry = document.createElement('div');
                newWorkEntry.classList.add('work-entry');

                // Create a header for each work entry
                const headerDiv = document.createElement('div');
                headerDiv.classList.add('work-details-header');
                headerDiv.textContent = workDetail.office_name || 'Work Detail';
                newWorkEntry.appendChild(headerDiv);

                // Create the content grid
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('work-details-grid');
                contentDiv.innerHTML = `
                                    <div class="field">
                                        <label>Office Name</label>
                                        <div class="office-input-container">
                                            <input type="text" name="office_name" class="office_name" placeholder="Office Name" value="${
                                              workDetail.office_name || ''
                                            }">
                                            <button type="button" class="show-offices-btn">Show Office Names</button>
                                            <div class="office-names-container" style="display: none;">
                                                <!-- Office names will be displayed here -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <label>Service Record</label>
                                        <input type="number" name="service_record" class="service_record" placeholder="Service Record" value="${
                                          workDetail.service_record || ''
                                        }">
                                    </div>
                                    <div class="field">
                                        <label>PGB ID No.</label>
                                        <input type="text" name="pgb_id_no" class="pgb_id_no" placeholder="PGB ID No." value="${
                                          workDetail.pgb_id_no || ''
                                        }">
                                    </div>
                                    <div class="field">
                                        <label>TIN No.</label>
                                        <input type="number" name="tin_no" class="tin_no" placeholder="TIN No." value="${
                                          workDetail.tin_no || ''
                                        }">
                                    </div>
                                    <div class="field">
                                        <label>Start Date</label>
                                        <input type="date" name="start_date" class="start_date" value="${
                                          workDetail.start_date || ''
                                        }">
                                    </div>
                                    <div class="field">
                                        <label>End Date</label>
                                        <input type="date" name="end_date" class="end_date" value="${
                                          workDetail.end_date || ''
                                        }">
                                    </div>
                                    <div class="field">
                                        <label>Position</label>
                                        <input type="text" name="position" class="position" placeholder="Position" value="${
                                          workDetail.position || ''
                                        }">
                                    </div>
                                    <div class="field">
                                        <label>Salary</label>
                                        <input type="number" name="salary" class="salary" placeholder="Salary" value="${
                                          workDetail.salary || ''
                                        }">
                                    </div>
                                    <div class="field">
                                        <label>Appointment Status</label>
                                        <select class="appointment_status" name="appointment_status">
                                            <option value="permanent" ${
                                              workDetail.appointment_status ===
                                              'Permanent'
                                                ? 'selected'
                                                : ''
                                            }>Permanent</option>
                                            <option value="contractual" ${
                                              workDetail.appointment_status ===
                                              'Contractual'
                                                ? 'selected'
                                                : ''
                                            }>Contractual</option>
                                            <option value="casual" ${
                                              workDetail.appointment_status ===
                                              'Casual'
                                                ? 'selected'
                                                : ''
                                            }>Casual</option>
                                            <option value="job_order" ${
                                              workDetail.appointment_status ===
                                              'Job Order'
                                                ? 'selected'
                                                : ''
                                            }>Job Order</option>
                                        </select>
                                    </div>`;

                newWorkEntry.appendChild(contentDiv);
                workDetailsContainer.appendChild(newWorkEntry);
              });
            } else {
              // Add a message if no work details
              workDetailsContainer.innerHTML =
                '<p class="no-data-message">No work details found</p>';
            }
          }
          // Open modal
          modal.classList.add('show');
          modal.style.display = 'flex';

          // Make sure all rows in the modal are visible (in case they were hidden by search)
          const modalRows = modal.querySelectorAll('tr');
          modalRows.forEach((row) => {
            row.style.display = '';
          });

          // Setup the Show Office Names buttons
          setupShowOfficesButtons();
        })
        .catch((error) => {
          console.error('Error fetching member data:', error);
        });
    });
  });

  // Close modal when clicking "×"
  closeModalBtn.addEventListener('click', function () {
    console.log('Closing modal...');
    modal.classList.remove('show');
  });

  // Close modal when clicking outside modal content
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      console.log('Closing modal by clicking outside...');
      modal.classList.remove('show');
    }
  });

  // Add Work Detail functionality
  const addWorkDetailBtn = modal.querySelector('#addWorkDetail');
  if (addWorkDetailBtn) {
    addWorkDetailBtn.addEventListener('click', function () {
      console.log('Add Work Detail button clicked');
      const workDetailsContainer = modal.querySelector('#workDetailsContainer');

      if (workDetailsContainer) {
        // Check if there are existing work entries
        let existingWorkEntry =
          workDetailsContainer.querySelector('.work-entry');

        // Fetch offices for the dropdown
        fetch('/ims/get-offices/')
          .then((response) => response.json())
          .then((data) => {
            // If no existing entries, create a template
            if (
              !existingWorkEntry ||
              workDetailsContainer.innerHTML.includes('No work details found')
            ) {
              workDetailsContainer.innerHTML = ''; // Clear any 'no data' message

              // Create a new work entry from scratch
              let newWorkEntry = document.createElement('div');
              newWorkEntry.classList.add('work-entry');

              // Create header
              const headerDiv = document.createElement('div');
              headerDiv.classList.add('work-details-header');
              headerDiv.textContent = 'New Work Detail';
              newWorkEntry.appendChild(headerDiv);

              // Create content grid
              const contentDiv = document.createElement('div');
              contentDiv.classList.add('work-details-grid');

              // Create office dropdown HTML
              let officeOptionsHTML = '<option value="">Select Office</option>';
              data.offices.forEach((office) => {
                officeOptionsHTML += `<option value="${office.id}">${office.office_code}</option>`;
              });

              contentDiv.innerHTML = `
                <div class="field">
                  <label>Office Name</label>
                  <div class="office-input-container">
                    <input type="text" name="office_name" class="office_name" placeholder="Office Name" value="">
                    <button type="button" class="show-offices-btn">Show Office Names</button>
                    <div class="office-names-container" style="display: none;">
                      <!-- Office names will be displayed here -->
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Service Record</label>
                  <input type="number" name="service_record" class="service_record" placeholder="Service Record" value="">
                </div>
                <div class="field">
                  <label>PGB ID No.</label>
                  <input type="text" name="pgb_id_no" class="pgb_id_no" placeholder="PGB ID No." value="">
                </div>
                <div class="field">
                  <label>TIN No.</label>
                  <input type="number" name="tin_no" class="tin_no" placeholder="TIN No." value="">
                </div>
                <div class="field">
                  <label>Start Date</label>
                  <input type="date" name="start_date" class="start_date" value="">
                </div>
                <div class="field">
                  <label>End Date</label>
                  <input type="date" name="end_date" class="end_date" value="">
                </div>
                <div class="field">
                  <label>Position</label>
                  <input type="text" name="position" class="position" placeholder="Position" value="">
                </div>
                <div class="field">
                  <label>Salary</label>
                  <input type="number" name="salary" class="salary" placeholder="Salary" value="">
                </div>
                <div class="field">
                  <label>Appointment Status</label>
                  <select class="appointment_status" name="appointment_status">
                    <option value="permanent">Permanent</option>
                    <option value="contractual">Contractual</option>
                    <option value="casual">Casual</option>
                    <option value="job_order">Job Order</option>
                  </select>
                </div>`;

              newWorkEntry.appendChild(contentDiv);
              workDetailsContainer.appendChild(newWorkEntry);

              // Setup the Show Office Names buttons for the new entry
              setupShowOfficesButtons();
            } else {
              // Clone an existing work entry
              let newWorkEntry = existingWorkEntry.cloneNode(true);

              // Update header
              const headerDiv = newWorkEntry.querySelector(
                '.work-details-header'
              );
              if (headerDiv) {
                headerDiv.textContent = 'New Work Detail';
              }

              // Clear the office name input
              const officeInput =
                newWorkEntry.querySelector('input.office_name');
              if (officeInput) {
                officeInput.value = '';
              }

              // Clear all input values
              newWorkEntry
                .querySelectorAll('input, select')
                .forEach((input) => {
                  input.value = '';
                });

              workDetailsContainer.appendChild(newWorkEntry);

              // Setup the Show Office Names buttons for the cloned entry
              setupShowOfficesButtons();
            }

            // Scroll to the new work entry
            workDetailsContainer.scrollTop = workDetailsContainer.scrollHeight;
          })
          .catch((error) => {
            console.error('Error fetching offices:', error);
            alert('Error loading offices. Please try again.');
          });
      }
    });
  }

  
});





















document.addEventListener('DOMContentLoaded', function () {
  const updateForm = document.querySelector('#editMemberForm');

  if (!updateForm) {
    console.error('❌ Error: editMemberForm not found!');
    return;
  }

  updateForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(updateForm);

    // 🔎 Check if `employment_id` exists in the hidden input
    let employmentId =
      document.querySelector('#employment_id')?.value.trim() || null;
    console.log('🔍 Found employment_id from hidden field:', employmentId);

    // 🔎 If `employment_id` is still missing, try extracting from URL
    if (!employmentId) {
      const urlParts = window.location.pathname.split('/');
      if (urlParts.includes('update_member') && urlParts.length > 3) {
        employmentId = urlParts[urlParts.length - 2];
      }
    }

    console.log('📢 Final employment_id:', employmentId);

    // 🚨 Stop if `employment_id` is missing
    if (!employmentId || employmentId === 'dashboard') {
      console.error('❌ Error: Unable to retrieve employment_id!');
      alert(
        '❌ Error: Member ID is missing! Check if the form has the hidden field.'
      );
      return;
    }

    formData.append('employment_id', employmentId); // ✅ Ensure employment_id is included

    console.log(
      '🔄 Submitting form to:',
      `/ims/update_member/${employmentId}/`
    );
    console.log('📦 Form Data:', Object.fromEntries(formData.entries())); // ✅ Debugging

    try {
      const response = await fetch(`/ims/update_member/${employmentId}/`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('✅ Member updated successfully!');
        window.location.href = '/ims/dashboard/'; // ✅ Redirect to dashboard
      } else {
        alert(`⚠️ Update failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      alert('🚨 An error occurred while updating the member.');
    }
  });
});

// ✅ Function to get CSRF Token
function getCSRFToken() {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'csrftoken') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

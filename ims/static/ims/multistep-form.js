document.addEventListener('DOMContentLoaded', function () {
  // Get all form steps
  const formSteps = document.querySelectorAll('.form-step');
  const totalSteps = formSteps.length;
  let currentStep = 0;

  // Get navigation buttons
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');

  // Get progress indicator
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  // Initialize the form
  function initForm() {
    console.log('Initializing multistep form...');

    // Hide all steps except the first one
    formSteps.forEach((step, index) => {
      if (index !== 0) {
        step.style.display = 'none';
      } else {
        // Ensure first step is visible
        step.style.display = 'block';
        console.log('Setting first step to display: block');
      }
    });

    // Hide previous button on first step
    if (prevBtn) prevBtn.style.display = 'none';

    // Hide submit button until last step
    if (submitBtn) submitBtn.style.display = 'none';

    // Make sure next button is visible
    if (nextBtn) nextBtn.style.display = 'inline-block';

    // Update progress
    updateProgress();

    // Force the first step to be visible with a slight delay
    setTimeout(() => {
      if (formSteps.length > 0) {
        formSteps[0].style.display = 'block';
        console.log('Forcing first step to be visible after delay');
      }
    }, 200);
  }

  // Update progress indicator
  function updateProgress() {
    const percent = (currentStep / (totalSteps - 1)) * 100;
    progressBar.style.width = percent + '%';
    progressText.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
  }

  // Validate current step
  function validateCurrentStep() {
    const currentFormStep = formSteps[currentStep];
    const requiredFields = currentFormStep.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('invalid');
      } else {
        field.classList.remove('invalid');
      }
    });

    // Validate date fields
    const dateFields = currentFormStep.querySelectorAll('input[type="date"]');
    dateFields.forEach((field) => {
      if (field.value && !validateDateFormat(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Go to next step
  function goToNextStep() {
    if (validateCurrentStep()) {
      formSteps[currentStep].style.display = 'none';
      currentStep++;
      formSteps[currentStep].style.display = 'block';

      // Show/hide buttons based on current step
      if (currentStep > 0) {
        prevBtn.style.display = 'inline-block';
      }

      if (currentStep === totalSteps - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
      }

      // Update progress
      updateProgress();

      // Scroll to top of form
      formSteps[currentStep].scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Please fill in all required fields correctly before proceeding.');
    }
  }

  // Go to previous step
  function goToPrevStep() {
    formSteps[currentStep].style.display = 'none';
    currentStep--;
    formSteps[currentStep].style.display = 'block';

    // Show/hide buttons based on current step
    if (currentStep === 0) {
      prevBtn.style.display = 'none';
    }

    if (currentStep < totalSteps - 1) {
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
    }

    // Update progress
    updateProgress();

    // Scroll to top of form
    formSteps[currentStep].scrollIntoView({ behavior: 'smooth' });
  }

  // Event listeners for navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', goToNextStep);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', goToPrevStep);
  }

 

  // Initialize the form
  initForm();






  
  `// Show spouse name field only when civil status is "married"
  const civilStatusSelect = document.getElementById('civil_status');
  const spouseNameField = document.getElementById('spouse_name');

  if (civilStatusSelect && spouseNameField) {
    civilStatusSelect.addEventListener('change', function () {
      if (this.value === 'married') {
        spouseNameField.style.display = 'block';
        spouseNameField.parentElement.style.display = 'table-row';
      } else {
        spouseNameField.style.display = 'none';
        spouseNameField.parentElement.style.display = 'none';
      }
    });
  }

  // Show children container only when has_children is checked
  const hasChildrenCheckbox = document.getElementById('has_children');
  const childrenContainer = document.getElementById('childrenContainer');

  if (hasChildrenCheckbox && childrenContainer) {
    hasChildrenCheckbox.addEventListener('change', function () {
      if (this.checked) {
        childrenContainer.style.display = 'block';
      } else {
        childrenContainer.style.display = 'none';
      }
    });
  }`

});

// Function to validate date format (copied from date-validation.js)
function validateDateFormat(dateInput) {
  // Check if the input is empty (which is allowed)
  if (!dateInput.value.trim()) {
    return true;
  }

  // Check if the date is in YYYY-MM-DD format
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateInput.value)) {
    dateInput.setCustomValidity('Date must be in YYYY-MM-DD format');
    return false;
  }

  // Check if the date is valid
  const date = new Date(dateInput.value);
  if (isNaN(date.getTime())) {
    dateInput.setCustomValidity('Please enter a valid date');
    return false;
  }

  // Date is valid
  dateInput.setCustomValidity('');
  return true;
}



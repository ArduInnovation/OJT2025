document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('addMemberModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.querySelector('#addMemberModal .close');
  const addMemberBtns = document.querySelectorAll(
    '.add-member-btn, #openModalBtn'
  );

  if (!modal || !closeModalBtn) {
    console.error('Modal elements not found! Check your HTML structure.');
    return;
  }

  // Function to reset and show the form
  function resetAndShowForm() {
    // Make sure the first step is visible
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach((step, index) => {
      step.style.display = index === 0 ? 'block' : 'none';
    });

    // Reset progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = '0%';

    // Show the modal
    modal.classList.add('show');

    // Force the first step to be visible with a slight delay
    setTimeout(() => {
      const step1 = document.getElementById('step1');
      if (step1) {
        step1.style.display = 'block';
        console.log('Forcing step1 to be visible');
      }
    }, 100);
  }

  // Add click event to all add member buttons
  addMemberBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', function () {
        console.log('Opening modal...');
        resetAndShowForm();
      });
    }
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
});

function getCSRFToken() {
  return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// Example AJAX request
fetch('/register/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-CSRFToken': getCSRFToken(), // Include CSRF token
  },
  body: new URLSearchParams(
    new FormData(document.getElementById('addMemberForm'))
  ),
});

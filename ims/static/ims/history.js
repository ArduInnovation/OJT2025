document.addEventListener('DOMContentLoaded', function () {
  const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
  const actionHistory = document.getElementById('actionhistory');
  const closeHistoryBtn = document.querySelector('.close-history');

  if (!toggleHistoryBtn || !actionHistory || !closeHistoryBtn) {
    console.error('Action history elements not found!');
    return;
  }

  console.log('Action history elements found');

  // Store the original button content with the icon
  const showHistoryHTML = toggleHistoryBtn.innerHTML;
  // Create the hide history HTML with the same icon
  const hideHistoryHTML = toggleHistoryBtn.innerHTML.replace(
    'Show Action History',
    'Hide Action History'
  );

  // Toggle action history visibility when button is clicked
  toggleHistoryBtn.addEventListener('click', function () {
    console.log('Toggle history button clicked');
    actionHistory.classList.toggle('hidden');

    // Update button text based on visibility
    if (actionHistory.classList.contains('hidden')) {
      toggleHistoryBtn.innerHTML = showHistoryHTML;
    } else {
      toggleHistoryBtn.innerHTML = hideHistoryHTML;
    }
  });

  // Close action history when close button is clicked
  closeHistoryBtn.addEventListener('click', function () {
    console.log('Close history button clicked');
    actionHistory.classList.add('hidden');
    toggleHistoryBtn.innerHTML = showHistoryHTML;
  });
});

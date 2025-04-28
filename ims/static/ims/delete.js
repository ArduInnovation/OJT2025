document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.getElementById('DeleteMember');
    
    if (!deleteButton) {
        console.error('Delete button not found!');
        return;
    }
    
    console.log('Delete button found');
    
    // Add click event listener to the delete button
    deleteButton.addEventListener('click', function() {
        // Get all checked checkboxes
        const checkedBoxes = document.querySelectorAll('.delete-checkbox:checked');
        
        if (checkedBoxes.length === 0) {
            alert('Please select at least one member to delete.');
            return;
        }
        
        // Confirm deletion
        const confirmDelete = confirm(`Are you sure you want to delete ${checkedBoxes.length} member(s)? This action cannot be undone.`);
        
        if (!confirmDelete) {
            return;
        }
        
        // Collect all member IDs to delete
        const memberIds = Array.from(checkedBoxes).map(checkbox => checkbox.value);
        
        // Create form data
        const formData = new FormData();
        memberIds.forEach(id => {
            formData.append('member_ids[]', id);
        });
        
        // Add CSRF token
        const csrfToken = getCSRFToken();
        
        // Send delete request
        fetch('/ims/delete-member/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                // Reload the page to reflect changes
                window.location.reload();
            } else {
                alert('Error: ' + (data.error || 'Unknown error occurred'));
            }
        })
        .catch(error => {
            console.error('Error deleting members:', error);
            alert('An error occurred while deleting members. Please try again.');
        });
    });
});

// Function to get CSRF token
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.substring('csrftoken='.length, cookie.length);
        }
    }
    return '';
}

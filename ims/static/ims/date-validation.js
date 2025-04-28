// Function to validate date format
function validateDateFormat(dateInput) {
    // Check if the input is empty (which is allowed)
    if (!dateInput.value.trim()) {
        return true;
    }
    
    // Check if the date is in YYYY-MM-DD format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateInput.value)) {
        dateInput.setCustomValidity("Date must be in YYYY-MM-DD format");
        return false;
    }
    
    // Check if the date is valid
    const date = new Date(dateInput.value);
    if (isNaN(date.getTime())) {
        dateInput.setCustomValidity("Please enter a valid date");
        return false;
    }
    
    // Date is valid
    dateInput.setCustomValidity("");
    return true;
}

// Add validation to all date inputs
document.addEventListener('DOMContentLoaded', function() {
    // Get all date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    // Add validation to each date input
    dateInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            validateDateFormat(this);
        });
        
        input.addEventListener('blur', function() {
            validateDateFormat(this);
        });
    });
    
    // Add form submission validation
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Validate all date inputs in the form
            const formDateInputs = form.querySelectorAll('input[type="date"]');
            formDateInputs.forEach(function(input) {
                if (!validateDateFormat(input)) {
                    isValid = false;
                }
            });
            
            // Prevent form submission if validation fails
            if (!isValid) {
                event.preventDefault();
                alert("Please correct the date format errors. Dates must be in YYYY-MM-DD format.");
            }
        });
    });
});

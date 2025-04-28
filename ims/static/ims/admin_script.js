document.addEventListener("DOMContentLoaded", function () {
    let civilStatusRadios = document.querySelectorAll("input[name='civil_status']");
    let spouseField = document.querySelector(".field-spouse_name"); 
    let hasChildrenCheckbox = document.querySelector("#id_has_children");
    let childrenSection = document.querySelector(".inline-group");

    // Ensure spouse & children fields always exist
    if (!spouseField) {
        console.error("Spouse field not found! Fix admin.py.");
        return;
    }
    if (!childrenSection) {
        console.error("Children section not found! Fix admin.py.");
        return;
    }

    function toggleSpouseField() {
        let selectedValue = document.querySelector("input[name='civil_status']:checked");
        if (selectedValue) {
            if (selectedValue.value === "married" || selectedValue.value === "widowed") {
                spouseField.style.display = ""; // Show spouse name
            } else {
                spouseField.style.display = "none"; // Hide if single/divorced
            }
        }
    }

    function toggleChildrenSection() {
        if (hasChildrenCheckbox) {
            childrenSection.style.display = hasChildrenCheckbox.checked ? "" : "none";
        }
    }

    // **Ensure Fields Respond Immediately on First Load**
    setTimeout(() => {
        toggleSpouseField();
        toggleChildrenSection();
    }, 100);

    // Attach event listeners after elements are confirmed
    civilStatusRadios.forEach(radio => {
        radio.addEventListener("change", toggleSpouseField);
    });

    if (hasChildrenCheckbox) {
        hasChildrenCheckbox.addEventListener("change", toggleChildrenSection);
    }
});

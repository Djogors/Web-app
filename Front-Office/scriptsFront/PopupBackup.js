// Function to show the popup
function showPopup() {
    const popup = document.getElementById("success-popup");
    popup.style.display = "block";

    // Add fade-out effect after 3 seconds
    setTimeout(() => {
        popup.classList.add("fade-out");
    }, 3000);

    // Remove the popup from the DOM after the animation
    setTimeout(() => {
        popup.style.display = "none";
        popup.classList.remove("fade-out");
    }, 5000);
}

// Add event listeners to the forms
document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        showPopup(); 
        form.reset(); 
    });
});
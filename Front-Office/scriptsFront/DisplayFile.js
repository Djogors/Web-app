document.getElementById("file-upload").addEventListener("change", function () {
    const fileNameContainer = document.getElementById("file-name-container");
    const file = this.files[0]; // Get the selected file

    if (file) {
        // Display the file name with size
        fileNameContainer.innerHTML = `
            <div class="d-flex align-items-center justify-content-center border border-secondary rounded p-2">
                <span>${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
                <button type="button" class="btn-close ms-3" aria-label="Remove" onclick="removeFile()"></button>
            </div>
        `;
    }
});

// Function to remove the file
function removeFile() {
    const fileInput = document.getElementById("file-upload");
    const fileNameContainer = document.getElementById("file-name-container");

    // Clear the file input and hide the file name
    fileInput.value = "";
    fileNameContainer.innerHTML = "";
}
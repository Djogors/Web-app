document.addEventListener("DOMContentLoaded", function () {
    // Select all clickable cards within the "Reportar" section
    const reportCards = document.querySelectorAll("#report .card-link");

    // Add a click event listener to each card
    reportCards.forEach(cardLink => {
        cardLink.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default behavior of the link

            // Check if the user is authenticated
            const authenticatedUser = JSON.parse(localStorage.getItem("utilizador_autenticado"));

            if (authenticatedUser) {
                // Redirect to the page specified in the href attribute
                const targetPage = cardLink.getAttribute("href");
                window.location.href = targetPage;
            } else {
                // Redirect to the login page
                window.location.href = "Login.html";
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const ratingForm = document.getElementById("ratingForm");
if (ratingForm) {
    ratingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obter valores do formulário
        const name = document.querySelector("#ratingForm input[placeholder='Nome*']").value.trim();
        const email = document.querySelector("#ratingForm input[placeholder='Email*']").value.trim();
        const review = document.querySelector("#ratingForm textarea[placeholder='Avaliação*']").value.trim();
        const stars = document.querySelectorAll('.rating-stars .star.active').length;
        console.log("Estrelas selecionadas:", stars);

        // Validar os campos
        if (!name || !email || !review || stars === 0) {
            showErrorPopup("Por favor, preencha todos os campos obrigatórios e selecione uma avaliação.");
            return;
        }

        const reviewData = {
            name: name,
            email: email,
            review: review,
            date: new Date().toLocaleDateString(),
            stars: stars
        };

        // Obter avaliações existentes do localStorage
        const existingReviews = JSON.parse(localStorage.getItem("reviews")) || [];

        // Adicionar a nova avaliação ao array
        existingReviews.push(reviewData);

        // Salvar o array atualizado no localStorage
        localStorage.setItem("reviews", JSON.stringify(existingReviews));

        // Mostrar mensagem de sucesso
        showPopup("Avaliação salva com sucesso!");

        // Limpar o formulário
        ratingForm.reset();
    });
}
});
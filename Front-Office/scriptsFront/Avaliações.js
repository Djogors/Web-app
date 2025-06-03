// Obter as avaliações do localStorage
const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

// Obter o container onde as avaliações serão exibidas
const reviewsContainer = document.getElementById("reviewsContainer");
reviewsContainer.innerHTML = ""; // Limpa o container antes de adicionar novas avaliações

// Criar um container centralizado para as avaliações
const centeredContainer = document.createElement("div");
centeredContainer.classList.add("reviews-container");

// Verificar se existem avaliações
if (reviews.length === 0) {
    centeredContainer.innerHTML = "<p class='text-center'>Sem avaliações no momento.</p>";
} else {
    // Loop pelas avaliações e exibi-las
    reviews.forEach((review) => {
        // Ignorar avaliações inválidas (sem nome ou email)
        if (!review.name || !review.email || !review.review) {
            return;
        }

        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review-card");
        reviewElement.innerHTML = `
            <div>
                <h5>${review.name}</h5>
                <small>${review.email}</small>
                <p>${review.review}</p>
            </div>
            <div class="review-meta">
                <small>${review.date}</small>
                <div class="rating-stars">
                    ${'★'.repeat(review.stars || 0)}${'☆'.repeat(5 - (review.stars || 0))}
                </div>
            </div>
        `;
        centeredContainer.appendChild(reviewElement);
    });
}

// Adicionar o container centralizado ao container principal
reviewsContainer.appendChild(centeredContainer);
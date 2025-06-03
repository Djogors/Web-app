document.addEventListener("DOMContentLoaded", function () {
    const authPlaceholder = document.getElementById("authPlaceholder");

    if (!authPlaceholder) {
        console.warn("authPlaceholder element not found in the DOM.");
        return;
    }

    // Verifica se o usuário está autenticado
    const authenticatedUser = JSON.parse(localStorage.getItem("utilizador_autenticado"));

    if (authenticatedUser) {
        // Renderiza o menu do usuário autenticado
        authPlaceholder.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${authenticatedUser.nome}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" id="userMenu">
                    <li><a class="dropdown-item" href="AreaPessoal.html">Área pessoal</a></li>
                    <li><a class="dropdown-item" href="#" id="logoutButton">Logout</a></li>
                </ul>
            </li>
        `;

        // Adiciona funcionalidade de logout
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", function () {
                // Remove o usuário autenticado do localStorage
                localStorage.removeItem("utilizador_autenticado");

                // Redireciona para a página inicial
                window.location.href = "FrontOffice.html";
            });
        } else {
            console.warn("Elemento logoutButton não encontrado no DOM.");
        }
    } else {
        // Renderiza o botão de login para usuários não autenticados
        authPlaceholder.innerHTML = `
            <a class="nav-link" href="Login.html">Login</a>
        `;
    }
});
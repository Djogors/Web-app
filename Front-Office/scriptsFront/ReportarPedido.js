document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Check if the user is authenticated
        const utilizador = JSON.parse(localStorage.getItem("utilizador_autenticado"));
        if (!utilizador || !utilizador.id) {
            showErrorPopup("Utilizador não autenticado. Por favor, faça login.");
            return;
        }
        const tipoPedido = form.getAttribute("data-type");
        const dataPedido = Date.now();
        const district = document.getElementById('district').value;
        const conselho = document.getElementById('municipality').value;
        const freguesia = document.getElementById('parish').value;
        const morada = document.getElementById('address').value;
        const comments = document.getElementById('comments').value;
        const auditType = document.getElementById('auditType').value;
        const dataAuditoria = Date.now();
        const status = "Pendente";

        const fileInput = document.getElementById("file-upload");
        const file = fileInput.files.length > 0 ? fileInput.files[0] : null;

        let fileBase64 = null;
        if (file) {
            // Convert the file to a Base64 string
            fileBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        }

        try {
            // Add the pedido to localStorage
            adicionarPedido(
                utilizador.id,
                tipoPedido,
                dataPedido,
                district,
                conselho,
                freguesia,
                morada,
                comments,
                fileBase64, // Store the Base64 string
                auditType,
                dataAuditoria,
                null, // perito
                status, // duracao
                null, // materiais,
            );

            showPopup("Pedido submetido com sucesso!");

            setTimeout(() => {
                window.location.href = 'FrontOffice.html';
            }, 2000); // 2-second delay

        } catch (error) {
            console.error("Erro ao submeter o pedido:", error);
            showErrorPopup("Erro ao submeter o pedido. Tente novamente.");
        }

        form.reset();
    });
});


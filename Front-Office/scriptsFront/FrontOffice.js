document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar o envio do formulário

    // Obter valores do formulário
    const nome = document.querySelector("#contactForm input[placeholder='Nome*']").value.trim();
    const email = document.querySelector("#contactForm input[placeholder='Email*']").value.trim();
    const mensagem = document.querySelector("#contactForm textarea[placeholder='Mensagem*']").value.trim();

    const utilizador = JSON.parse(localStorage.getItem("utilizador_autenticado"));
    // Criar um objeto de mensagem
    const novaMensagem = {
        id: Date.now(),
        nome,
        email,
        mensagem,
        data: new Date().toLocaleDateString(),
        id_utilizador: utilizador ? utilizador.id : null 
    };
    
    // Obter mensagens existentes do localStorage
    const mensagensExistentes = JSON.parse(localStorage.getItem("mensagens")) || [];

    // Adicionar a nova mensagem ao array
    mensagensExistentes.push(novaMensagem);

    // Salvar o array atualizado no localStorage
    localStorage.setItem("mensagens", JSON.stringify(mensagensExistentes));

    // Log para depuração
    console.log("Mensagem salva:", novaMensagem);
    console.log("Todas as mensagens:", mensagensExistentes);

    // Mostrar mensagem de sucesso
    showPopup("Mensagem enviada com sucesso!");

    // Limpar o formulário
    document.getElementById("contactForm").reset();
});

// Utilitários para Local Storage
function obterUtilizadorAutenticado() {
  return JSON.parse(localStorage.getItem("utilizador_autenticado"));
}
function preencherInfoUtilizador() {
  const utilizador = obterUtilizadorAutenticado();
  const nomeElem = document.getElementById("userName");
  const emailElem = document.getElementById("userEmail");
  if (utilizador) {
    nomeElem.textContent = "Nome: " + utilizador.nome;
    emailElem.textContent = "Email: " + utilizador.login;
  } else {
    nomeElem.textContent = "Nome: ";
    emailElem.textContent = "Email: ";
  }
}
function obterBanco() {
  return (
    JSON.parse(localStorage.getItem("banco")) || {
      utilizadores: [],
      pedidos: [],
      notificacoes: [],
      contatos: [],
      avaliacoes: [],
      peritos: [],
      materiais: [],
      auditorias: [],
    }
  );
}

function salvarBanco(banco) {
  localStorage.setItem("banco", JSON.stringify(banco));
}

// Corrige notificações sem id_utilizador (apenas para migração de dados antigos)
function corrigirNotificacoes() {
  const banco = obterBanco();
  const utilizador = obterUtilizadorAutenticado();
  if (!utilizador) return;
  let alterado = false;
  banco.notificacoes.forEach((n) => {
    if (!n.id_utilizador) {
      n.id_utilizador = utilizador.id;
      alterado = true;
    }
  });
  if (alterado) salvarBanco(banco);
}

// Renderiza as notificações do utilizador autenticado
function renderizarNotificacoes() {
  const container = document.getElementById("notificationsContainer");
  const utilizador = obterUtilizadorAutenticado();
  if (!utilizador) {
    container.innerHTML =
      '<p class="text-muted">Por favor, faça login para visualizar as suas notificações.</p>';
    return;
  }
  const banco = obterBanco();
  const notificacoes = (banco.notificacoes || []).filter(
    (n) => n.id_utilizador === utilizador.id
  );
  if (notificacoes.length === 0) {
    container.innerHTML = '<p class="text-muted"></p>';
    return;
  }
  container.innerHTML = "";

  notificacoes
    .sort((a, b) => b.id_notificacao - a.id_notificacao)
    .forEach((n) => {
      const notificacaoElement = document.createElement("div");
      notificacaoElement.className =
        "notification-item p-3 mb-3 rounded shadow-sm";
      notificacaoElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
            <span class="read-indicator ${
              n.status_notificacao === "lida" ? "read" : "unread"
            } me-3"></span>
            <div>
                <div class="notification-title fw-bold">${
                  n.assunto_notificacao
                }</div>
            </div>
        </div>
        <div class="d-flex align-items-center">
            <div class="notification-date text-muted small me-3">
                ${new Date(n.id_notificacao).toLocaleDateString("pt-PT")}
            </div>
            <input type="checkbox" class="form-check-input notification-checkbox" ${
              n.status_notificacao === "lida" ? "checked" : ""
            }>
        </div>
    </div>
    <div class="notificacao-detalhes mt-2 d-none">
        <div><strong>ID do utilizador:</strong> ${n.id_utilizador}</div>
        <div><strong>Resposta:</strong> ${
          n.resposta ? n.resposta : "Sem resposta."
        }</div>
    </div>
            `;

      // Toggle detalhes
      notificacaoElement.addEventListener("click", function (e) {
        // Evita que o clique na checkbox acione o toggle dos detalhes
        if (e.target.classList.contains("notification-checkbox")) return;
        const detalhes = this.querySelector(".notificacao-detalhes");
        detalhes.classList.toggle("d-none");
      });

      // Marcar como lida/não lida - ESTA É A PARTE QUE ESTAVA FALTANDO
      const checkbox = notificacaoElement.querySelector(
        ".notification-checkbox"
      );
      checkbox.addEventListener("change", function (e) {
        e.stopPropagation(); // Evita que o evento se propague
        const readIndicator =
          notificacaoElement.querySelector(".read-indicator");
        if (this.checked) {
          readIndicator.classList.add("read");
          readIndicator.classList.remove("unread");
          n.status_notificacao = "lida";
        } else {
          readIndicator.classList.remove("read");
          readIndicator.classList.add("unread");
          n.status_notificacao = "nao_lida";
        }
        salvarBanco(banco);
      });

      container.appendChild(notificacaoElement);
    });
}

// Renderiza os pedidos do utilizador autenticado
function renderizarPedidosDoUtilizador() {
  const container = document.getElementById("pedidosContainer");
  const banco = obterBanco();
  const utilizador = obterUtilizadorAutenticado();
  if (!utilizador) {
    container.innerHTML =
      '<p class="text-muted">Por favor, faça login para visualizar os seus pedidos.</p>';
    return;
  }
  const pedidos = banco.pedidos.filter(
    (p) => p.id_utilizador === utilizador.id && p.status_pedido !== "pendente"
  );
  if (pedidos.length === 0) {
    container.innerHTML =
      '<p class="text-muted">Não há pedidos submetidos por este utilizador com status diferente de "pendente".</p>';
    return;
  }
  container.innerHTML = "";
  pedidos.forEach((pedido) => {
    if (pedido.read === undefined) pedido.read = false;
    const pedidoElement = document.createElement("div");
    pedidoElement.classList.add(
      "notification-item",
      "p-3",
      "mb-3",
      "rounded",
      "shadow-sm"
    );
    const isRead = pedido.read;
    pedidoElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <span class="read-indicator ${
                      isRead ? "read" : "unread"
                    } me-3"></span>
                    <div>
                        <div class="notification-title fw-bold">
                            Informamos que a sua auditoria relativa a '${
                              pedido.tipo_pedido
                            }' encontra-se no estado '${pedido.status_pedido.toLowerCase()}'.
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="notification-date text-muted small me-3">
                        ${new Date(pedido.data_pedido).toLocaleDateString(
                          "pt-PT"
                        )}
                    </div>
                    <input type="checkbox" class="form-check-input notification-checkbox" ${
                      isRead ? "checked" : ""
                    }>
                    ${
                      pedido.status_pedido &&
                      pedido.status_pedido.toLowerCase() === "devolvido"
                        ? `
                        <button class="btn btn-link p-0 ms-2 reportar-arrow" title="Corrigir pedido">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.146 3.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8H2.5a.5.5 0 0 1 0-1h10.793l-3.147-3.146a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    `
                        : ""
                    }
                </div>
            </div>
            <div class="additional-info mt-3 d-none">
                <p><strong>Descrição:</strong> ${
                  pedido.descricao || "Sem descrição disponível."
                }</p>
                <p><strong>ID do Pedido:</strong> ${pedido.id_pedido}</p>
                <p><strong>Status:</strong> ${pedido.status_pedido}</p>
                <p><strong>Justificação:</strong> ${
                  pedido.justificacao || "Sem justificação disponível."
                }</p>
            </div>
        `;
    // Toggle detalhes
    pedidoElement.addEventListener("click", function (e) {
      if (e.target.classList.contains("notification-checkbox")) return;
      const additionalInfo = this.querySelector(".additional-info");
      additionalInfo.classList.toggle("d-none");
    });
    // Marcar como lido/não lido
    const checkbox = pedidoElement.querySelector(".notification-checkbox");
    checkbox.addEventListener("change", function () {
      const readIndicator = pedidoElement.querySelector(".read-indicator");
      if (this.checked) {
        readIndicator.classList.add("read");
        readIndicator.classList.remove("unread");
        pedido.read = true;
      } else {
        readIndicator.classList.remove("read");
        readIndicator.classList.add("unread");
        pedido.read = false;
      }
      salvarBanco(banco);
    });
    // Corrigir pedido devolvido
    const arrowBtn = pedidoElement.querySelector(".reportar-arrow");
    if (arrowBtn) {
      arrowBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        localStorage.setItem("pedido_para_reportar", JSON.stringify(pedido));
        window.location.href = getReportPage(pedido.tipo_pedido);
      });
    }
    container.appendChild(pedidoElement);
  });
  salvarBanco(banco);
}

// Função para obter a página de correção de pedido
function getReportPage(tipo_pedido) {
  switch ((tipo_pedido || "").toLowerCase()) {
    case "estrada_comprometida":
      return "EstradaComprometida.html";
    case "falta_sinalizacao":
      return "FaltaSinalização.html";
    case "passeio_danificado":
      return "PasseioDanificado.html";
    case "passeio_sem_luz":
      return "PasseioSemLuz.html";
    case "sinalizacao_danificada":
      return "SinalizaçãoDanificada.html";
    case "transito:congestionado":
    case "transito_congestionado":
      return "TransitoCongestionado.html";
    default:
      return "AreaPessoal.html";
  }
}

// Inicialização da página
document.addEventListener("DOMContentLoaded", function () {
  preencherInfoUtilizador();
  corrigirNotificacoes();
  renderizarNotificacoes();
  renderizarPedidosDoUtilizador();
});

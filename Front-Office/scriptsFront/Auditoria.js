function obterBanco() {
  return (
    JSON.parse(localStorage.getItem("banco")) || {
      pedidos: [],
      utilizadores: [],
    }
  );
}

function getNomeUtilizador(id_utilizador, utilizadores) {
  const utilizador = utilizadores.find(
    (u) => String(u.id) === String(id_utilizador)
  );
  return utilizador && utilizador.nome ? utilizador.nome : "";
}

function renderTable(auditorias, utilizadores) {
  const tbody = document.getElementById("audit-tBody");
  tbody.innerHTML = "";
  auditorias.forEach((auditoria) => {
    // Get the user name from the id_utilizador
    let nomeUtilizador = "";
    if (auditoria.nome) {
      nomeUtilizador = auditoria.nome;
    } else if (auditoria.id_utilizador) {
      nomeUtilizador = getNomeUtilizador(auditoria.id_utilizador, utilizadores);
    }

    tbody.innerHTML += `
            <tr>
                <td>${nomeUtilizador}</td>
                <td>${
                  auditoria.data_emissao
                    ? new Date(auditoria.data_emissao).toLocaleDateString(
                        "pt-PT"
                      )
                    : auditoria.data_pedido
                    ? new Date(auditoria.data_pedido).toLocaleDateString(
                        "pt-PT"
                      )
                    : ""
                }</td>
                <td>${auditoria.morada || ""}</td>
                <td>${auditoria.tipo_pedido || ""}</td>
                <td>${getEstadoBadge(
                  auditoria.status_pedido || "Por iniciar"
                )}</td>
            </tr>
        `;
  });
}

// Indicador - função para calcular auditorias concluídas
function calcularAuditoriasConcluidas() {
  const banco = obterBanco();
  // Valor base de auditorias concluídas
  let totalConcluidas = 100;

  // Incrementar para cada auditoria com estado "Concluída"
  const pedidos = banco.pedidos || [];
  pedidos.forEach((pedido) => {
    const estado = (pedido.status_pedido || "").toLowerCase();
    if (estado === "concluída" || estado === "concluído") {
      totalConcluidas++;
    }
  });
  
  console.log("Total de auditorias concluídas:", totalConcluidas);
  return totalConcluidas;
}

// Função para atualizar o indicador na página principal
function atualizarIndicadorAuditorias() {
  const indicadorElement = document.getElementById("auditoriasNoAno");
  if (indicadorElement) {
    const totalConcluidas = calcularAuditoriasConcluidas();
    indicadorElement.textContent = totalConcluidas;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Atualizar indicador se estiver na página principal
  atualizarIndicadorAuditorias();
  
  // Se estiver na página de auditoria, renderizar a tabela
  const auditTableBody = document.getElementById("audit-tBody");
  if (auditTableBody) {
    const banco = obterBanco();
    const utilizadores = banco.utilizadores || [];
    // Mostrar auditorias com diferentes estados
    const auditorias = (banco.pedidos || []).filter(
      (pedido) => 
        pedido.status_pedido === "Por iniciar" || 
        pedido.status_pedido === "Em curso" || 
        pedido.status_pedido === "Concluída" ||
        pedido.status_pedido === "Concluído"
    );

    renderTable(auditorias, utilizadores);

    // Adicionar funcionalidade de pesquisa
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        const filtered = auditorias.filter((auditoria) => {
          let nomeUtilizador = "";
          if (auditoria.nome) {
            nomeUtilizador = auditoria.nome;
          } else if (auditoria.id_utilizador) {
            nomeUtilizador = getNomeUtilizador(
              auditoria.id_utilizador,
              utilizadores
            );
          }
          return nomeUtilizador.toLowerCase().includes(searchValue);
        });
        renderTable(filtered, utilizadores);
      });
    }
  }
});

function getEstadoBadge(estado) {
  let estadoLower = (estado || "").toLowerCase();
  if (estadoLower === "por iniciar") {
    return `<span class="audit-badge red">Por iniciar</span>`;
  } else if (estadoLower === "em curso") {
    return `<span class="audit-badge yellow">Em curso</span>`;
  } else if (estadoLower === "concluída") {
    return `<span class="audit-badge green">Concluída</span>`;
  } else {
    return `<span class="audit-badge">${estado || ""}</span>`;
  }
}

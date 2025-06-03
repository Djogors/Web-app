<template>
  <canvas id="myChart" height="300" width="300" :options="chartOptions"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectAudit = ref()
const track_perito = ref([])
const track_audit = ref([])
const perito_select = ref()
const chartDataImpact = ref({})

const impactoEsperado = {
  estrada_comprometida: [
    'Redução de danos a veículos e aumento da segurança',
    'Melhoria do conforto na condução e menor desgaste veicular',
    'Evita alagamentos e garante tráfego seguro mesmo com chuvas',
    'Reduz risco de acidentes por desmoronamento ou queda lateral',
  ],
  falta_de_sinalizacao: [
    'Redução de manobras bruscas e aumento da previsibilidade',
    'Melhora a segurança noturna e em condições climáticas ruins',
    'Proteção de usuários vulneráveis e maior organização viária',
    'Diminuição de acidentes e aumento da confiança dos usuários',
  ],
  sinalizacao_danificada: [
    'Melhora a comunicação visual e evita infrações por confusão',
    'Aumenta a visibilidade e a compreensão da sinalização',
    'Restabelece a fluidez e a segurança do tráfego urbano',
  ],
  transito_congestionado: [
    'Redução dos congestionamentos e melhoria da mobilidade',
    'Maior eficiência no deslocamento e menor emissão de poluentes',
    'Diminuição de acidentes em situações de tráfego intenso',
    'Agilidade no atendimento de emergências e socorro',
  ],
  passeio_danificado: [
    'Redução de quedas e acidentes com pedestres e ciclistas',
    'Aumento da segurança e acessibilidade urbana',
    'Melhoria da estética e funcionalidade dos passeios',
  ],
  passeio_sem_luz: [
    'Aumento da segurança pública e sensação de bem-estar',
    'Maior visibilidade de pedestres e prevenção de acidentes',
    'Ambiente urbano mais confiável e seguro durante a noite',
  ],
}

function getAcoesCorretivas(tipo_pedido) {
  return impactoEsperado[tipo_pedido] || []
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'middle',
    },
  },
}

function defineProblem() {
  const pedido = track_audit.value.find((p) => p.id_pedido === Number(selectAudit.value))
  if (!pedido) return

  const acoes = getAcoesCorretivas(pedido.tipo_pedido)
  chartDataImpact.value = new Chart('myChart', {
    type: 'pie',
    data: {
      labels: acoes,
      datasets: [
        {
          label: 'Impactos Esperados',
          data: Array(acoes.length).fill(1), // same weight
          backgroundColor: ['#b91d47', '#00aba9', '#2b5797', '#e8c3b9'],
        },
      ],
    },
    options: {
      cutoutPercentage: 10,
      responsive: true,
      legend: {
        position: 'bottom',
        align: 'start',
      },
      tooltips: {
        enabled: true,
      },
      animation: {
        onComplete: function () {
          const chart = this.chart
          const ctx = chart.ctx
          ctx.save()
          ctx.font = 'bold 16px sans-serif'
          ctx.fillStyle = '#000'
          // ctx.textAlign = 'center'
          ctx.restore()
        },
      },
    },
  })
}

onMounted(() => {
  const audID = localStorage.getItem('selectedAuditID')
  const peritos = localStorage.getItem('peritos') //Informação dos peritos
  const list_audit = localStorage.getItem('pedidos auditoria') //Informação sobre as auditorias
  const peritos_s = localStorage.getItem('id_perito_selecionado') //Track do utilizador perito

  if (peritos_s && list_audit && peritos && audID) {
    track_perito.value = JSON.parse(peritos)
    track_audit.value = JSON.parse(list_audit)
    perito_select.value = JSON.parse(peritos_s)
    selectAudit.value = JSON.parse(audID)
  }
  defineProblem()
})
</script>

<template>
  <div class="chart-wrapper">
    <Doughnut
      v-if="chartData.datasets[0].data.length"
      class="graph"
      :data="chartData"
      :options="chartOptions"
    />
    <p v-else>Loading chart...</p>
  </div>
</template>

<style scoped>
.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.graph {
  max-width: 750px;
  max-height: 750px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, {
  id: 'centerTextPlugin',
  beforeDraw(chart) {
    const { width, height } = chart
    const ctx = chart.ctx
    ctx.save() // Use save() instead of restore() here to avoid canvas issues

    const text = 'Necessidades'

    const fontSize = (height / 300).toFixed(2)
    ctx.font = `${fontSize}em sans-serif`
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#444'

    const textX = Math.round((width - ctx.measureText(text).width) / 2)
    const textY = height / 2

    ctx.fillText(text, textX, textY)
    ctx.restore()
  },
})

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Ações corretivas',
      data: [],
      backgroundColor: [],
      hoverOffset: 4,
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'middle',
    },
  },
}

const track_perito = ref([])
const track_audit = ref([])
const perito_select = ref(null)
const selectAudit = ref(null)

const necessidadeAcoesCorretivas = {
  estrada_comprometida: [
    'Realizar operação tapa-buracos com urgência',
    'Nivelar a pavimentação com recapeamento',
    'Melhorar drenagem da via',
    'Construir contenção e reforçar acostamento',
  ],
  falta_de_sinalizacao: [
    'Instalar placas de advertência e regulamentação',
    'Adicionar sinalização refletiva ou luminosa',
    'Criar rotas seguras com demarcações específicas',
    'Planejar reforço de sinalização em áreas críticas',
  ],
  sinalizacao_danificada: [
    'Substituir placas danificadas ou desbotadas',
    'Reposicionar ou fixar adequadamente as placas',
    'Realizar manutenção imediata nos semáforos e sinais luminosos',
  ],
  transito_congestionado: [
    'Revisar planejamento viário e horários de pico',
    'Criar faixas exclusivas para ônibus e emergências',
    'Incentivar rotas alternativas e transporte coletivo',
    'Implementar sistemas inteligentes de semáforos',
  ],
  passeio_danificado: [
    'Reformar calçadas e corrigir desníveis',
    'Substituir ou reparar elementos de proteção urbana',
    'Cortar raízes invasivas e readequar piso',
  ],
  passeio_sem_luz: [
    'Instalar ou reparar iluminação pública',
    'Reforçar pontos críticos com luzes de LED',
    'Manutenção preventiva e monitoramento remoto de lâmpadas',
  ],
}

function getAcoesCorretivas(tipo_pedido) {
  return necessidadeAcoesCorretivas[tipo_pedido] || []
}

function defineProblem() {
  const pedido = track_audit.value.find((p) => p.id_pedido === Number(selectAudit.value))
  if (!pedido) return

  const acoes = getAcoesCorretivas(pedido.tipo_pedido)
  chartData.value = {
    labels: acoes,
    datasets: [
      {
        label: 'Ações corretivas',
        data: Array(acoes.length).fill(1),
        backgroundColor: acoes.map(
          (_, i) => ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#00bcd4', '#cddc39'][i % 6],
        ),
        hoverOffset: 6,
      },
    ],
  }
}

onMounted(() => {
  const audID = localStorage.getItem('selectedAuditID')
  const peritos = localStorage.getItem('peritos')
  const list_audit = localStorage.getItem('pedidos auditoria')
  const peritos_s = localStorage.getItem('id_perito_selecionado')

  if (peritos && list_audit && audID && peritos_s) {
    track_perito.value = JSON.parse(peritos)
    track_audit.value = JSON.parse(list_audit)
    perito_select.value = JSON.parse(peritos_s)
    selectAudit.value = JSON.parse(audID)

    defineProblem()
  }
})
</script>

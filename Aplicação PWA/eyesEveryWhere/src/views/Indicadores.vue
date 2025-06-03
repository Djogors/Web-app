<script setup>
import IconCriarOcorrencias from '../components/icons/IconCreateOcorrencia.vue'
import IconTime from '../components/icons/IconTime.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Navbar_closed_audit from '@/components/NavbarClosed.vue'
import graphCircle from '@/components/graphCircle.vue'
import graphProgressive from '@/components/graphProgressive.vue'

const router = useRouter()
const track_perito = ref([])
const track_audit = ref([])
const perito_select = ref()
const audits = ref([])
const selectAudit = ref()
const duracao = ref()
const problem = ref()

const problemasPorOpcao = {
  estrada_comprometida: [
    'Cratera ou buraco que pode danificar veículos',
    'Desníveis causando desconforto e desgaste mecânico',
    'Acúmulo de água formando piscinas que dificultam o tráfego',
    'Erosão lateral com risco de queda de veículos',
  ],
  falta_de_sinalizacao: [
    'Motoristas despreparados para curvas ou interrupções',
    'Aumento de colisões em trechos de baixa visibilidade',
    'Pedestres e ciclistas vulneráveis sem indicação segura',
    'Dificuldade de orientação em condições adversas',
  ],
  sinalizacao_danificada: [
    'Placas ilegíveis ou desbotadas causando interpretações erradas',
    'Placas fora de posição ou tombadas que não são percebidas',
    'Sinalização luminosa inoperante gerando caos no trânsito',
  ],
  transito_congestionado: [
    'Atrasos impactando produtividade',
    'Maior poluição do ar e sonora',
    'Risco de colisões traseiras',
    'Dificuldade para veículos de emergência',
  ],
  passeio_danificado: [
    'Irregularidades causando quedas de pedestres e ciclistas',
    'Barreiras físicas danificadas aumentando riscos',
    'Invasão de raízes gerando desníveis e tropeços',
  ],
  passeio_sem_luz: [
    'Aumento de assaltos e sensação de insegurança',
    'Pedestres mal-avistados aumentando risco de atropelamento',
    'Dificuldade de leitura de sinalização e obstáculos não visíveis',
  ],
}

const routerDados = () => {
  router.push('/ver_ocorrencia')
}

const define_tempo = () => {
  track_audit.value.forEach((pedido2) => {
    if (pedido2.id_pedido === Number(selectAudit.value)) {
      const diffMs = Date.now() - pedido2.data_auditoria
      pedido2.duracao_pedido = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      duracao.value = pedido2.duracao_pedido
    }
  })

  localStorage.setItem('pedidos auditoria', JSON.stringify(track_audit.value))
}

function contarProblemas(tema) {
  if (problemasPorOpcao[tema]) {
    return problemasPorOpcao[tema].length
  } else {
    console.log('Tema nao encontrado...')
  }
}

const defineProblem = () => {
  track_audit.value.forEach((pedido2) => {
    if (pedido2.id_pedido === Number(selectAudit.value)) {
      problem.value = contarProblemas(pedido2.tipo_pedido)
    }
  })
}

onMounted(async () => {
  // localStorage.clear()
  const saved = localStorage.getItem('auditoria')
  const audID = localStorage.getItem('selectedAuditID')
  const peritos = localStorage.getItem('peritos') //Informação dos peritos
  const list_audit = localStorage.getItem('pedidos auditoria') //Informação sobre as auditorias
  const peritos_s = localStorage.getItem('id_perito_selecionado') //Track do utilizador perito

  audits.value = saved ? JSON.parse(saved) : []

  if (saved && peritos_s && list_audit && peritos) {
    track_perito.value = JSON.parse(peritos)
    track_audit.value = JSON.parse(list_audit)
    perito_select.value = JSON.parse(peritos_s)
    audits.value = JSON.parse(saved)
    selectAudit.value = JSON.parse(audID)
  }
  define_tempo()
  defineProblem()
})
</script>

<template>
  <div v-for="(audit, index) in audits" :key="index">
    <div v-if="audit.id_pedido_Audit == Number(selectAudit)">
      <Navbar_closed_audit v-if="audit.status" />
      <Navbar v-else />
    </div>
  </div>
  <h4 :class="$style.title">Indicadores</h4>
  <div :class="$style.container_box">
    <IconCriarOcorrencias />
    <h4 :class="$style.title">{{ problem }} Problemas</h4>
    <p :class="$style.description">Problemas identificados</p>
  </div>
  <div :class="$style.container_box">
    <IconTime />
    <h4 :class="$style.title">{{ duracao }} Dias</h4>
    <p :class="$style.description">Tempo total da auditoria</p>
  </div>
  <graphCircle />

  <h6 :class="$style.title">Impactos</h6>
  <graphProgressive />
</template>

<script>
import styles from '@/assets/Indicador.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

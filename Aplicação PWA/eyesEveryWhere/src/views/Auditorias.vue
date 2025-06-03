<script setup>
import Navbar from '@/components/NavbarAuditoria.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const audits = ref([])
const router = useRouter()
//Data
const dataOcorrencia = ref(null)
//State
const stateAuditory = ref(false)
// Estado da auditoria
const stateInput = ref('Por Iniciar')
//Mudar a cor do botao para amarelo
const stateInputColor = ref(false)
// Alocar um id para uma certa auditoria ter um track the auditoria selecionada
const id_Auditory = ref()
// Array de peritos
const track_perito = ref([])
// Array dos pedidos
const track_audit = ref([])
//Guardar Id do perito
const perito_select = ref()

const found = ref([])
//Banco de dados
const bank_data = ref({})

const gotRegistarOcorrencia = (id, estado, audit) => {
  localStorage.setItem('selectedAuditID', audit.id_pedido_Audit)
  markClicked(audit)
  if (!estado) {
    router.push('/menu_servicos')
  } else if (audit.ocorrencia) {
    router.push('/ver_ocorrencia')
  } else {
    router.push('/indicadores')
  }
}

const assignID = () => {
  if (id_Auditory.value == null) {
    id_Auditory.value = 0
  }
  id_Auditory.value++
  return id_Auditory.value
}
const markClicked = (audit) => {
  if (!audit.clicked) {
    audit.info = 'Em curso'
    audit.clicked = true
    localStorage.setItem('auditoria', JSON.stringify(audits.value))
    find_peritos(audit.id_pedido_Audit)
    makePost()
  }
}

const convertUnix = (timeStamp) => {
  const date = new Date(timeStamp)
  const formatted = date.toISOString().split('T')[0]

  return formatted
}

function removeTime(datetimeStr) {
  return datetimeStr.split(' ')[0]
}

//Listar pois coloco na variavel found
const listar_auditoria = () => {
  if (audits.value.length <= found.value.length) {
    console.log('Auditorias já criadas.')

    if (found.value) {
      const remaining = found.value.length

      for (let i = 0; i < remaining; i++) {
        console.log(found.value)
        const pedido = found.value[i]
        const match = audits.value.some((audit) => audit.id_pedido_Audit === pedido.id_pedido)
        if (!match) {
          if (pedido.status_pedido == 'Por iniciar') {
            console.log('auditoria por iniciar')
            const id_auditoria_pedido = pedido.id_pedido
            const ocorrenciaFormatada = convertUnix(pedido.data_auditoria)
            const ID_foreach = assignID()
            const id_name = `Auditoria ${ID_foreach}`

            audits.value.push({
              id_audit: ID_foreach,
              name: id_name,
              date: ocorrenciaFormatada,
              status: stateAuditory.value,
              info: stateInput.value,
              ocorrencia: dataOcorrencia.value,
              clicked: stateInputColor.value,
              id_pedido_Audit: id_auditoria_pedido,
            })
          }

          if (pedido.status_pedido == 'Em curso') {
            const id_auditoria_pedido = pedido.id_pedido
            const ID_foreach = assignID()
            const id_name = `Auditoria ${ID_foreach}`

            audits.value.push({
              id_audit: ID_foreach,
              name: id_name,
              date: removeTime(pedido.data_inicio),
              status: false,
              info: 'Em curso',
              ocorrencia: pedido.dados_auditorias,
              clicked: true,
              id_pedido_Audit: id_auditoria_pedido,
            })
            console.log('auditoria em curso')
          }

          if (pedido.status_pedido == 'Concluída') {
            const id_auditoria_pedido = pedido.id_pedido
            const ID_foreach = assignID()
            const id_name = `Auditoria ${ID_foreach}`

            audits.value.push({
              id_audit: ID_foreach,
              name: id_name,
              date: removeTime(pedido.data_fim),
              status: true,
              info: 'Concluída',
              ocorrencia: pedido.dados_auditorias,
              clicked: true,
              id_pedido_Audit: id_auditoria_pedido,
            })

            console.log('auditoria concuida')
          }
        }
      }
      // Save all at once after loop
      localStorage.setItem('auditoria', JSON.stringify(audits.value))
    }
  }
}

const encontrar_pedido = (id) => {
  console.log('Encontrando pedido' + bank_data)
  console.log(id)
  bank_data.value.pedidos.forEach((audit) => {
    if (audit.peritos_selecionados.includes(String(perito_select.value))) {
      if (Number(id) == audit.id_pedido) {
        const now = new Date()

        const day = String(now.getDate()).padStart(2, '0')
        const month = String(now.getMonth() + 1).padStart(2, '0') // Months are 0-based
        const year = now.getFullYear()
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')

        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`
        if (!audit.data_inicio) {
          audit.data_inicio = formattedDateTime
        }
        audit.status_pedido = 'Em curso'
      }
    }
  })
  localStorage.setItem('banco', JSON.stringify(bank_data.value))
}

//Guardar all auditories for certain perito
const associar_peritos = () => {
  console.log('Executando associar peritos')
  track_audit.value.forEach((pedido) => {
    if (pedido.peritos_selecionados.includes(String(perito_select.value))) {
      console.log(perito_select.value)
      console.log(pedido.id_pedido)
      if (
        pedido.status_pedido == 'Por iniciar' ||
        pedido.status_pedido == 'Em curso' ||
        pedido.status_pedido == 'Concluída'
      ) {
        found.value.push(pedido) // Manually store the
        console.log('Match found :', pedido)
        console.log('Match found  com por Iniciar:', found.value)
      }
    }
  })
  // localStorage.setItem('pedidos auditoria', JSON.stringify(found.value))
}

const find_peritos = (id_auditoria) => {
  track_audit.value.forEach((pedido) => {
    if (pedido.id_pedido === Number(id_auditoria)) {
      const now = new Date()
      const day = String(now.getDate()).padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0') // Months are 0-based
      const year = now.getFullYear()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')

      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`

      pedido.data_inicio = formattedDateTime
      pedido.status_pedido = 'Em curso'
      encontrar_pedido(id_auditoria)
      console.log('Match found:', pedido)
    }
  })
  localStorage.setItem('pedidos auditoria', JSON.stringify(found.value))
}

function makePost() {
  const data = localStorage.getItem('banco')

  if (data) {
    try {
      const parsedData = JSON.parse(data)
      fetch('http://localhost:3000/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData), // Send the parsed object
      })
        .then((res) => res.json())
        .then((data) => console.log('POST:', data))
        .catch((error) => console.error('Error:', error))
    } catch (err) {
      console.error('Failed to parse JSON from localStorage:', err)
    }
  }
}

onMounted(() => {
  //localStorage.clear()
  const saved = localStorage.getItem('auditoria') //Buscar status do butao
  const peritos = localStorage.getItem('peritos') //Informação dos peritos
  const list_audit = localStorage.getItem('pedidos auditoria') //Informação sobre as auditorias
  const peritos_s = localStorage.getItem('id_perito_selecionado') //Track do utilizador perito
  const bank = localStorage.getItem('banco')

  audits.value = saved ? JSON.parse(saved) : []

  if (peritos_s && list_audit && peritos && bank) {
    bank_data.value = JSON.parse(bank)
    track_perito.value = JSON.parse(peritos)
    track_audit.value = JSON.parse(list_audit)
    perito_select.value = JSON.parse(peritos_s)

    associar_peritos()
    listar_auditoria()
  }

  localStorage.removeItem('descricao')
  localStorage.removeItem('savedValue')
  localStorage.removeItem('checkboxStates')
  localStorage.removeItem('uploadedImages')
  localStorage.removeItem('savedVideo')
  localStorage.removeItem('savedAudio')
})
</script>

<template>
  <Navbar />
  <h4 :class="$style.title">Auditorias</h4>

  <div :class="$style.container_box">
    <h6>Histórico</h6>
    <hr :class="$style.divider" />

    <div
      v-for="(audit, index) in audits"
      :key="index"
      :class="$style.line"
      @click="gotRegistarOcorrencia(audit.id_audit, audit.status, audit)"
    >
      <div :class="$style.left">
        <p>Data: {{ audit.date }}</p>
        <div :class="$style.info">
          <span :class="$style.NomeAudit">{{ audit.name }}</span>
        </div>
      </div>
      <button
        :class="[
          audit.clicked && !audit.status ? $style.stateClicked : '', //Clicked é para em curso
          !audit.clicked && audit.status ? $style.stateClosed : '', //Status é para concluído e terminado
          !audit.clicked && !audit.status ? $style.stateAuditoria : '',
          audit.clicked && audit.status ? $style.stateClosed : '',
        ]"
      >
        {{ audit.info }}
      </button>
    </div>
  </div>
</template>

<script>
import styles from '@/assets/auditorias.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

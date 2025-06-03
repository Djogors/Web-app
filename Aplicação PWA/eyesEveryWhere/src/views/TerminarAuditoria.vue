<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const audits = ref([])
const track_perito = ref([])
const track_audit = ref([])
const perito_select = ref()
const found = ref([])
const selectAudit = ref()
const bank_data = ref({})

const goToMenuServicos = () => {
  estadoAuditoria()
  encontrar_pedido()
  makePost()
  router.push('/auditorias')
}

const estadoAuditoria = () => {
  // Alterar estado no template
  audits.value.forEach((audit) => {
    if (audit.selected) {
      audit.info = 'Concluída'
      audit.status = true

      track_audit.value.forEach((pedido) => {
        if (pedido.id_pedido === Number(audit.id_pedido_Audit)) {
          const now = new Date()

          const day = String(now.getDate()).padStart(2, '0')
          const month = String(now.getMonth() + 1).padStart(2, '0') // Months are 0-based
          const year = now.getFullYear()
          const hours = String(now.getHours()).padStart(2, '0')
          const minutes = String(now.getMinutes()).padStart(2, '0')

          const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`

          pedido.data_fim = formattedDateTime
          pedido.status_pedido = 'Concluída'
          found.value.push(pedido) // Manually store the
          console.log('Match found:', pedido)
          console.log('Match found:', found.value)
        } else found.value.push(pedido)
      })
      localStorage.setItem('pedidos auditoria', JSON.stringify(found.value))
    }
  })
  localStorage.setItem('auditoria', JSON.stringify(audits.value))
}

//Funcao para dar set ao novo estado no Banco
const encontrar_pedido = () => {
  console.log('Encontrando pedido', bank_data.value)
  bank_data.value.pedidos.forEach((audit) => {
    if (audit.peritos_selecionados.includes(String(perito_select.value))) {
      bank_data.value.peritos.forEach((perito) => {
        console.log('audit.presencas:', audit.presencas)
        console.log('peritos ids', perito.id_perito)
        if (audit.presencas.includes(Number(perito.id_perito))) {
          console.log('Alterar estado perito')
          perito.status_perito = 'Disponível'
        }
      })

      if (selectAudit.value == audit.id_pedido) {
        const now = new Date()

        const day = String(now.getDate()).padStart(2, '0')
        const month = String(now.getMonth() + 1).padStart(2, '0') // Months are 0-based
        const year = now.getFullYear()
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')

        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`
        if (!audit.data_fim) {
          audit.data_fim = formattedDateTime
        }
        audit.status_pedido = 'Concluída'
      }
    }
  })
  localStorage.setItem('banco', JSON.stringify(bank_data.value))
}

//Condicao que da update se ocorrer, e filtrar por auditoria
const visibleAudits = computed(() =>
  audits.value.filter((a) => a.id_pedido_Audit === selectAudit.value),
)

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
        .then((data) => console.log('POST from app:', data))
        .catch((error) => console.error('Error:', error))
    } catch (err) {
      console.error('Failed to parse JSON from localStorage:', err)
    }
  }
}

onMounted(() => {
  const saved = localStorage.getItem('auditoria')
  const peritos = localStorage.getItem('peritos') //Informação dos peritos
  const list_audit = localStorage.getItem('pedidos auditoria') //Informação sobre as auditorias
  const peritos_s = localStorage.getItem('id_perito_selecionado') //Track do utilizador perito
  const audID = localStorage.getItem('selectedAuditID')
  const bank = localStorage.getItem('banco')

  if (saved && peritos_s && list_audit && peritos && bank) {
    bank_data.value = JSON.parse(bank)
    audits.value = JSON.parse(saved)
    track_perito.value = JSON.parse(peritos)
    track_audit.value = JSON.parse(list_audit)
    perito_select.value = JSON.parse(peritos_s)
    selectAudit.value = JSON.parse(audID)
  }
})
</script>

<template>
  <Navbar />
  <div :class="$style.container_box">
    <h6 id="subtitle">Auditorias</h6>
    <hr class="divider" />

    <div v-for="(audit, index) in visibleAudits" :key="index">
      <div :class="$style.auditoria_box" @click="gotOcorrenciaInfo">
        <p :class="$style.auditoria_text">{{ audit.name }}</p>
        <input type="checkbox" :class="$style.checkbox" v-model="audit.selected" />
      </div>
    </div>
  </div>

  <button :class="$style.btn_terminar" @click="goToMenuServicos">Terminar</button>
</template>

<script>
import styles from '@/assets/terminarAuditoria.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

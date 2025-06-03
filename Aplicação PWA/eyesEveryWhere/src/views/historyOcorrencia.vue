<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Navbar_closed_audit from '@/components/NavbarClosed.vue'

const router = useRouter()
const auditoria = ref([])
const select = ref()

const gotOcorrenciaInfo = () => {
  router.push('/ocorrencia_Info')
}

const routerDados = () => {
  router.push('/indicadores')
}

onMounted(() => {
  // localStorage.clear()
  const saved = localStorage.getItem('auditoria')
  const id_select = localStorage.getItem('selectedAuditID')
  if (saved) {
    auditoria.value = JSON.parse(saved)
    select.value = JSON.parse(id_select)
  }
})
</script>

<template>
  <div v-for="(audit, index) in auditoria" :key="index">
    <div v-if="audit.id_pedido_Audit == Number(select)">
      <Navbar_closed_audit v-if="audit.status" />
      <Navbar v-else />
    </div>
  </div>
  <div :class="$style.container_box">
    <h6 :class="$style.subtitle">Histórico</h6>
    <hr :class="$style.divider" />
    <div :class="$style.auditoria_box" @click="routerDados">
      <p :class="$style.auditoria_text">Indicadores</p>
      <button :class="$style.btn_ver">Ver</button>
    </div>
    <hr :class="$style.divider" />
    <div v-for="(audit, index) in auditoria" :key="index">
      <div v-if="audit.id_pedido_Audit === select">
        <p :class="$style.info">Data: {{ audit.ocorrencia.date }}</p>
        <div :class="$style.auditoria_box" @click="gotOcorrenciaInfo">
          <p :class="$style.auditoria_text">Ocorrencia 1</p>
          <button :class="$style.btn_ver">Ver</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import styles from '@/assets/history_ocorrencias.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

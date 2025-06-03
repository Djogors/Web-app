<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const checkboxStates = ref({
  policia: false,
  bombeiros: false,
  juridico: false,
  higiene: false,
  inspecao: false,
})

const goToContact = () => {
  localStorage.setItem('checkboxStates', JSON.stringify(checkboxStates.value))
  gotLocation()
}

const gotLocation = () => {
  router.push('/registo_ocorrencias')
}

onMounted(async () => {})
</script>

<template>
  <Navbar />

  <div :class="$style.container_box">
    <h6 :class="$style.title">Profissionais</h6>
    <hr :class="$style.divider" />

    <div>
      <div :class="$style.auditoria_box">
        <p :class="$style.auditoria_text">Polícia Municipal</p>
        <input type="checkbox" :class="$style.checkbox" v-model="checkboxStates.policia" />
      </div>

      <div :class="$style.auditoria_box">
        <p :class="$style.auditoria_text">Bombeiros</p>
        <input type="checkbox" :class="$style.checkbox" v-model="checkboxStates.bombeiros" />
      </div>

      <div :class="$style.auditoria_box">
        <p :class="$style.auditoria_text">Jurídico</p>
        <input type="checkbox" :class="$style.checkbox" v-model="checkboxStates.juridico" />
      </div>
      <div :class="$style.auditoria_box">
        <p :class="$style.auditoria_text">Higiene de Trabalho</p>
        <input type="checkbox" :class="$style.checkbox" v-model="checkboxStates.higiene" />
      </div>
      <div :class="$style.auditoria_box">
        <p :class="$style.auditoria_text">Inspeção Técnica</p>
        <input type="checkbox" :class="$style.checkbox" v-model="checkboxStates.inspecao" />
      </div>
    </div>
  </div>

  <button :class="$style.btn_terminar" @click="goToContact">Guardar</button>
</template>

<script>
import styles from '@/assets/contactar_profissional.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

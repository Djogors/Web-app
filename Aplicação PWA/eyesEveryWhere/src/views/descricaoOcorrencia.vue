<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/NavbarAuditoria.vue'

const router = useRouter()
const typeInput = ref('')
const audID = ref(null)
const audits = ref([])
const currentDate = new Date().toLocaleDateString()
const popupMessage = ref('')
const isPopupOpen = ref(false)

const showPopup = (message) => {
  popupMessage.value = message
  isPopupOpen.value = true
}

const closePopup = () => {
  isPopupOpen.value = false
}

const gotBackTo = () => {
  router.push('/registo_ocorrencias')
}

const submitName = () => {
  if (typeInput.value.trim() !== '') {
    localStorage.setItem('descricao', JSON.stringify(typeInput.value))
    gotBackTo()
  } else {
    showPopup('Por favor, descreva a ocorrencia.')
  }
}

onMounted(() => {
  // localStorage.clear()
  const saved = localStorage.getItem('auditoria')
  const selectedAud = localStorage.getItem('selectedAuditID')
  const descricao = localStorage.getItem('descricao')
  typeInput.value = descricao ? JSON.parse(descricao) : []
  if (saved && selectedAud) {
    audits.value = JSON.parse(saved)
    audID.value = JSON.parse(selectedAud)
  }
})
</script>

<template>
  <Navbar />
  <h6 :class="$style.sub_title">Descrição</h6>
  <div :class="$style.container_box">
    <div :class="$style.box_display">
      <div v-for="(audit, index) in audits" :key="index">
        <div v-if="audit.id_pedido_Audit == audID">
          <div :class="$style.row">
            <p>Data: {{ currentDate }}</p>
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
      </div>
    </div>
    <div v-for="(audit, index) in audits" :key="index">
      <div v-if="audit.id_pedido_Audit == audID">
        <textarea v-model="typeInput" :class="$style.descricao" placeholder="Escreve aqui">
        </textarea>
      </div>
    </div>
    <!-- <textarea v-model="typeInput" :class="$style.descricao" placeholder="Escreve aqui">{{  }}</textarea> -->
    <button :class="$style.save" @click="submitName">Guardar</button>
  </div>

  <transition name="fade">
    <div v-if="isPopupOpen" :class="$style.modal_overlay" @click.self="closePopup">
      <div :class="$style.container_overlay">
        <p>{{ popupMessage }}</p>
        <div :class="$style.modal_buttons">
          <button @click="closePopup" :class="$style.btn_submit">Fechar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import styles from '@/assets/descricao_ocorrencia.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

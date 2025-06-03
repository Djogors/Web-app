<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import arrowBlue from '@/components/icons/arrow-blue.vue'

const router = useRouter()
const typeValue = ref('')
const isModalOpenValue = ref(false)
const images = ref([])
const videoData = ref(null)
const audioURL = ref(null)

const audit_data = ref([])
const select = ref()

const track_perito = ref([])
const track_audit = ref([])
const perito_select = ref()
const bank_data = ref({})

const popupMessage = ref('')
const isPopupOpen = ref(false)

const showPopup = (message) => {
  popupMessage.value = message
  isPopupOpen.value = true
}

const closePopup = () => {
  isPopupOpen.value = false
}

const gotMenuServicos = () => {
  router.push('/menu_servicos')
}

const gotDescrever = () => {
  router.push('/descricao_ocorrencia')
}

const goToContactar = () => {
  router.push('/contactos')
}

const openModalValue = () => {
  isModalOpenValue.value = true
}

const closeModalValue = () => {
  isModalOpenValue.value = false
}

const submitValue = () => {
  if (typeValue.value !== '') {
    localStorage.setItem('savedValue', typeValue.value)
    // Clear for next selection
    closeModalValue()
  } else {
    showPopup('Por favor, selecione um tipo.')
  }
}

const handleUpload = async (event) => {
  const selectedFiles = Array.from(event.target.files)

  // Reject if total exceeds 5
  if (images.value.length + selectedFiles.length > 5) {
    showPopup('Máximo de 5 imagens permitido.')
    return
  }

  const newBase64Images = await Promise.all(
    selectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }),
  )

  images.value.push(newBase64Images)
  localStorage.setItem('uploadedImages', JSON.stringify(images.value))
}

const handleVideoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('video/')) {
    showPopup('Por favor, selecione um arquivo de vídeo válido.')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    videoData.value = reader.result
    localStorage.setItem('savedVideo', reader.result)
  }
  reader.readAsDataURL(file)
}

const handleAudioUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('audio/')) {
    audioURL.value = URL.createObjectURL(file)

    const reader = new FileReader()

    reader.onload = function () {
      const base64Audio = reader.result // This is a Base64 string
      localStorage.setItem('savedAudio', base64Audio)
    }
    reader.readAsDataURL(file) // Converts the audio file to Base64
  } else {
    console.warn('Invalid audio file')
  }
}

const register_button = () => {
  const ocorrenciaPost = {
    description: localStorage.getItem('descricao'),
    value: localStorage.getItem('savedValue'),
    contact: JSON.parse(localStorage.getItem('checkboxStates') || '[]'),
    date: new Date().toLocaleDateString(),
  }

  const ocorrenciaData = {
    description: localStorage.getItem('descricao'),
    value: localStorage.getItem('savedValue'),
    contact: JSON.parse(localStorage.getItem('checkboxStates') || '[]'),
    images: JSON.parse(localStorage.getItem('uploadedImages') || '[]'),
    video: localStorage.getItem('savedVideo'),
    audio: localStorage.getItem('savedAudio'),
    date: new Date().toLocaleDateString(),
  }

  bank_data.value.pedidos.forEach((audit) => {
    if (audit.peritos_selecionados.includes(String(perito_select.value))) {
      if (select.value == audit.id_pedido) {
        audit.dados_auditoria = ocorrenciaPost
      }
    }
  })
  localStorage.setItem('banco', JSON.stringify(bank_data.value))

  //Guardar para buscar para ver info da ocorrencias
  const targetAudit = audit_data.value.find((audit) => audit.id_pedido_Audit === select.value)
  if (targetAudit) {
    targetAudit.ocorrencia = ocorrenciaData
    console.log('Found audit')
  }
  localStorage.setItem('auditoria', JSON.stringify(audit_data.value))

  const json = JSON.stringify(track_audit.value)
  console.log('JSON length (bytes):', new Blob([json]).size)

  makePost()
  //Reset Values
  localStorage.removeItem('descricao')
  localStorage.removeItem('savedValue')
  localStorage.removeItem('checkboxStates')
  localStorage.removeItem('uploadedImages')
  localStorage.removeItem('savedVideo')
  localStorage.removeItem('savedAudio')
  typeValue.value = ''
  images.value = []
  videoData.value = null
  audioURL.value = null

  gotMenuServicos()
}

function makePost() {
  const data = localStorage.getItem('banco')
  console.log(typeof data)
  if (data) {
    try {
      fetch('http://localhost:3000/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data, // Send the parsed object
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
  // const saved = localStorage.getItem('ocorrenciaData')
  const auditoria = localStorage.getItem('auditoria')
  const id_aud = localStorage.getItem('selectedAuditID')
  const peritos = localStorage.getItem('peritos') //Informação dos peritos
  const list_audit = localStorage.getItem('pedidos auditoria') //Informação sobre as auditorias
  const peritos_s = localStorage.getItem('id_perito_selecionado') //Track do utilizador perito
  const bank = localStorage.getItem('banco')

  // Log for debugging
  console.log('Loaded auditoria:', auditoria)
  console.log('Loaded selectedAuditID:', id_aud)

  if (peritos_s && list_audit && peritos && bank) {
    bank_data.value = JSON.parse(bank)
    track_perito.value = JSON.parse(peritos)
    track_audit.value = JSON.parse(list_audit)
    perito_select.value = JSON.parse(peritos_s)
  }

  if (auditoria) {
    try {
      audit_data.value = JSON.parse(auditoria)
    } catch (e) {
      console.error('Failed to parse auditoria from localStorage:', e)
    }
  }

  if (id_aud) {
    try {
      select.value = JSON.parse(id_aud)
    } catch (e) {
      console.error('Failed to parse selectedAuditID from localStorage:', e)
    }
  }

  // Final check
  if (!audit_data.value.length || select.value === null) {
    console.warn('Audit data or selected ID not properly loaded')
  }
})
</script>

<template>
  <Navbar />
  <h6 :class="$style.title">Dados da auditoria</h6>
  <div :class="$style.container_add_photos">
    <h6 :class="$style.title_input">Inserir imagem</h6>
    <div>
      <label :class="$style.customFileUpload">
        <input
          type="file"
          accept="image/*"
          multiple
          @change="handleUpload"
          :disabled="images.length >= 5"
        />
        <p v-if="images.length >= 5" style="color: red">Limite de 5 imagens atingido.</p>
      </label>
    </div>
  </div>
  <div :class="$style.container_add_photos">
    <h6 :class="$style.title_input">Insira video</h6>
    <div :class="$style.container_add">
      <label :class="$style.customFileUpload">
        <input type="file" accept="video/*" @change="handleVideoUpload" />
      </label>
    </div>
  </div>
  <div :class="$style.container_add_photos">
    <h6 :class="$style.title_input">Insira audio</h6>
    <div>
      <label :class="$style.customFileUpload">
        <input type="file" accept="audio/*" @change="handleAudioUpload" />
      </label>
    </div>
  </div>

  <div :class="$style.container_box">
    <hr :class="$style.divider" />
    <div :class="$style.auditoria_box" @click="gotDescrever">
      <p :class="$style.auditoria_text">Descrição</p>
      <arrowBlue :class="$style.arrow_blue"></arrowBlue>
    </div>
    <hr :class="$style.divider" />
    <div :class="$style.auditoria_box" @click="openModalValue">
      <p :class="$style.auditoria_text">Valor monetário</p>
      <arrowBlue :class="$style.arrow_blue"></arrowBlue>
      <transition name="fade">
        <div v-if="isModalOpenValue" :class="$style.modal_overlay" @click.stop>
          <div :class="$style.container_overlay">
            <h3>Inserir Valor monetário</h3>
            <input
              type="number"
              v-model="typeValue"
              placeholder="Insera um valor"
              :class="$style.modal_input"
            />
            <div :class="$style.modal_buttons">
              <button @click="submitValue" :class="$style.btn_submit">Submit</button>
              <button @click="closeModalValue" :class="$style.btn_cancel">Cancel</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <hr :class="$style.divider" />
    <div :class="$style.auditoria_box" @click="goToContactar">
      <p :class="$style.auditoria_text">Contactar Profissional</p>
      <arrowBlue :class="$style.arrow_blue"></arrowBlue>
    </div>
  </div>

  <button :class="$style.save" @click="register_button">Registar</button>

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
import styles from '@/assets/registarOcorrencia.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

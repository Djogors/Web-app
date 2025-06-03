<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Navbar_closed_audit from '@/components/NavbarClosed.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const router = useRouter()
const audits = ref([])
const ocorrencia_data = ref({}) //Guardar como objeto
const stored = ref([])
const imgs = ref([])
const videoStored = ref(null)
const audioStored = ref(null)

const selecionado = ref()

const auditSelect = () => {
  for (const audit of audits.value) {
    if (audit.id_pedido_Audit === selecionado.value) {
      ocorrencia_data.value = audit.ocorrencia
      console.log('Selected audit:', ocorrencia_data.value)
      break // Stop after finding the match
    }
  }
}

const loadImages = () => {
  let rawImages = ocorrencia_data.value?.images
  // console.log('Type of rawImages:', typeof rawImages)
  // console.log('rawImages:', rawImages)
  if (typeof rawImages === 'string') {
    try {
      rawImages = JSON.parse(rawImages)
    } catch (e) {
      console.warn('Failed to parse string image data:', rawImages)
      rawImages = []
    }
  }
  if (Array.isArray(rawImages)) {
    // Flatten in case it's an array of arrays
    stored.value = rawImages.flat()
  } else {
    console.warn('Image data is not a valid array:', rawImages)
    stored.value = []
  }
}

const loadVideo = () => {
  let rawVideo = ocorrencia_data.value?.video
  if (typeof rawVideo === 'string') {
    videoStored.value = rawVideo
  } else {
    console.warn('Video is missing or not a valid base64 string:', rawVideo)
    videoStored.value = null
  }
}

const loadAudio = () => {
  const loadData = ocorrencia_data.value?.audio
  if (typeof loadData === 'string') {
    audioStored.value = loadData
  } else {
    console.warn('Video is missing or not a valid base64 string:', loadData)
    audioStored.value = null
  }
}

onMounted(() => {
  const saved = localStorage.getItem('auditoria')
  const select = localStorage.getItem('selectedAuditID')
  if (saved) {
    audits.value = JSON.parse(saved)
    selecionado.value = JSON.parse(select)

    auditSelect()
    loadImages()
    loadVideo()
    loadAudio()
  }
})
</script>

<template>
  <div v-for="(audit, index) in audits" :key="index">
    <div v-if="audit.id_pedido_Audit == Number(selecionado)">
      <Navbar_closed_audit v-if="audit.status" />
      <Navbar v-else />
    </div>
  </div>
  <h6 :class="$style.sub_title">Ocorrência</h6>
  <div :class="$style.container_box">
    <swiper
      :slides-per-view="1"
      :space-between="20"
      :loop="true"
      :pagination="{ clickable: true }"
      :modules="[Pagination]"
    >
      <swiper-slide v-for="(image, index) in stored" :key="index">
        <img
          :key="index"
          :src="image"
          alt="Uploaded image"
          style="max-width: 100%; max-height: 50%; object-fit: contain; margin-top: 10px"
        />
      </swiper-slide>
    </swiper>
  </div>
  <div :class="$style.container_box">
    <div v-if="videoStored">
      <video
        :src="videoStored"
        controls
        width="600"
        @error="(e) => console.error('Video error:', e)"
        style="max-width: 100%; border-radius: 8px"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  <div :class="$style.container_box">
    <div v-if="audioStored">
      <audio
        :src="videoStored"
        controls
        width="600"
        @error="(e) => console.error('Audio error:', e)"
        style="max-width: 100%; border-radius: 8px"
      >
        Your browser does not support the video tag.
      </audio>
    </div>
  </div>

  <div :class="$style.container_box">
    <p :class="$style.preco">{{ ocorrencia_data.value }} €</p>
    <p :class="$style.description">{{ ocorrencia_data.description }}</p>
  </div>
</template>

<script>
import styles from '@/assets/ocorrenciaInfo.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

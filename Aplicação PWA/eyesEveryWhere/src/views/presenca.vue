<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { Loader } from '@googlemaps/js-api-loader'

const router = useRouter()
const latitude = ref(null)
const longitude = ref(null)
const freguesia = ref('')
const showLocationPrompt = ref(true)
const track_perito = ref([])
const track_audit = ref([])
const perito_select = ref()
const audits = ref([])
const selectAudit = ref()
const peritos_audit = ref([])
const peritos_presentes = ref([])
const bank_data = ref({})

const loader = new Loader({
  apiKey: 'apikey',
  version: 'weekly',
})

async function initGeocoder() {
  await loader.importLibrary('maps') // This loads only 'maps' part
  const geocoder = new google.maps.Geocoder()
  return geocoder
}

async function getFreguesia(lat, lng) {
  await loader.importLibrary('maps') // Load only what you need

  const geocoder = new google.maps.Geocoder()

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const addressComponents = results[0].address_components

        // Find the "sublocality" or "administrative_area_level_2" for freguesia
        const freguesia = addressComponents.find(
          (component) =>
            component.types.includes('sublocality') ||
            component.types.includes('administrative_area_level_3') ||
            component.types.includes('sublocality_level_1') ||
            component.types.includes('locality'),
        )

        if (freguesia) {
          resolve(freguesia.long_name)
        } else {
          resolve(null) // No freguesia found
        }
      } else {
        reject('Geocoder failed due to: ' + status)
      }
    })
  })
}

const closeModal = () => {
  showLocationPrompt.value = false
}

const closeContact = () => {
  router.push('/menu_servicos')
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        latitude.value = position.coords.latitude
        longitude.value = position.coords.longitude
        freguesia.value = await getFreguesia(latitude.value, longitude.value)
        closeModal()
      },
      (error) => {
        console.error('Error getting location:', error.message)
      },
    )
  }
}

const goToContact = () => {
  getUserLocation()
  guardar_presenca()
  localStorage.setItem('latitude', JSON.stringify(latitude.value))
  localStorage.setItem('longtitude', JSON.stringify(longitude.value))
  localStorage.setItem('conselho', JSON.stringify(freguesia.value))
  gotTerminar()
}

const gotTerminar = () => {
  router.push('/terminar_auditoria')
}

const listar_peritos_auditoria = () => {
  track_audit.value.forEach((pedido2) => {
    if (pedido2.id_pedido === Number(selectAudit.value)) {
      console.log('Encontrado auditoria')
      track_perito.value.forEach((pedido3) => {
        if (pedido2.peritos_selecionados.includes(String(pedido3.id_perito))) {
          peritos_audit.value.push(pedido3)
          pedido2.presencas = peritos_presentes.value
        }
      })
    }
  })
}

const guardar_presenca = () => {
  track_audit.value.forEach((pedido2) => {
    if (pedido2.id_pedido === Number(selectAudit.value)) {
      console.log('Encontrado auditoria')
      track_perito.value.forEach((pedido3) => {
        if (pedido2.peritos_selecionados.includes(String(pedido3.id_perito))) {
          pedido2.presencas = peritos_presentes.value
          bank_data.value.pedidos.forEach((audit) => {
            audit.presencas = peritos_presentes.value
          })
          localStorage.setItem('banco', JSON.stringify(bank_data.value))
        }
      })
    }
  })
  localStorage.setItem('pedidos auditoria', JSON.stringify(track_audit.value))
}

onMounted(async () => {
  showLocationPrompt.value = true
  const geocoder = await initGeocoder()

  const saved = localStorage.getItem('auditoria')
  const audID = localStorage.getItem('selectedAuditID')
  const peritos = localStorage.getItem('peritos') //Informação dos peritos
  const list_audit = localStorage.getItem('pedidos auditoria') //Informação sobre as auditorias
  const peritos_s = localStorage.getItem('id_perito_selecionado') //Track do utilizador perito
  const bank = localStorage.getItem('banco')

  audits.value = saved ? JSON.parse(saved) : []

  if (saved && peritos_s && list_audit && peritos && bank) {
    bank_data.value = JSON.parse(bank)
    track_perito.value = JSON.parse(peritos)
    track_audit.value = JSON.parse(list_audit)
    perito_select.value = JSON.parse(peritos_s)
    audits.value = JSON.parse(saved)
    selectAudit.value = JSON.parse(audID)
  }
  listar_peritos_auditoria()
})
</script>

<template>
  <Navbar />

  <div :class="$style.container_box">
    <h6 :class="$style.title">Presenças</h6>
    <hr :class="$style.divider" />

    <div>
      <div v-for="perito in peritos_audit" :key="perito.id_perito" :class="$style.auditoria_box">
        <p :class="$style.auditoria_text">{{ perito.nome_perito }}</p>
        <input
          type="checkbox"
          :class="$style.checkbox"
          :value="perito.id_perito"
          v-model="peritos_presentes"
        />
      </div>
    </div>
  </div>

  <button :class="$style.btn_terminar" @click="goToContact">Guardar</button>
  <transition name="fade">
    <div v-if="showLocationPrompt" :class="$style.modal_backdrop">
      <div :class="$style.modal">
        <p>Voce aceita ativar a localização?</p>
        <button @click="getUserLocation" :class="$style.btn_submit">Sim</button>
        <button @click="closeContact" :class="$style.btn_cancel">Não</button>
      </div>
    </div>
  </transition>
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

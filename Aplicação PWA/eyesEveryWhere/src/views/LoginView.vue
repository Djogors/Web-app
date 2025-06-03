<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const lista_peritos = ref([])
const lista_auditorias = ref([])
const email_user = ref('')
const password_user = ref('')
const popupMessage = ref('')
const showPopup = ref(false)

const closePopup = () => {
  showPopup.value = false
  popupMessage.value = ''
}

const goToAuditorias = () => {
  router.push('/auditorias') // Navigate to the "menu_servicos" view
}

const login = () => {
  const targetEmail = lista_peritos.value.find((perito) => {
    if (perito.email_perito == email_user.value) {
      localStorage.setItem('id_perito_selecionado', JSON.stringify(perito.id_perito))
      console.log(perito.email_perito)
      console.log(perito.id_perito)
      return true
    }
  })
  const targetPassword = lista_peritos.value.find(
    (perito) => perito.nif_perito === password_user.value,
  )
  if (targetEmail && targetPassword) {
    goToAuditorias()
  } else {
    popupMessage.value = 'Email ou password incorreto'
    showPopup.value = true
  }
}
onMounted(() => {
  // localStorage.clear()
  fetch('http://localhost:3000/api/data')
    .then((res) => res.json())
    .then((data) => {
      console.log('GET:', data)

      // Extract the array of peritos properly
      const peritosArray = data.received?.peritos || []
      const pedidosAuditorias = data.received?.pedidos || []
      const banco_data = data.received || []

      localStorage.setItem('banco', JSON.stringify(banco_data))
      localStorage.setItem('peritos', JSON.stringify(peritosArray))
      localStorage.setItem('pedidos auditoria', JSON.stringify(pedidosAuditorias))
      lista_peritos.value = peritosArray
      lista_auditorias.value = pedidosAuditorias
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
})
</script>

<template>
  <div v-if="showPopup" :class="$style.popup_overlay" @click="closePopup">
    <div :class="$style.popup_box" @click.stop>
      <p>{{ popupMessage }}</p>
      <button :class="$style.submit" @click="closePopup">OK</button>
    </div>
  </div>

  <main>
    <div :class="$style.header">
      <button :class="$style.btn_secondary" @click="$router.go(-1)">x</button>
    </div>

    <h2 :class="$style.rep">LOGIN</h2>

    <div :class="$style.login_container">
      <input :class="$style.Input_button" type="email" placeholder="Email" v-model="email_user" />
      <input
        :class="$style.Input_button"
        type="password"
        placeholder="Password"
        v-model="password_user"
      />
    </div>

    <div :class="$style.container_button">
      <button :class="$style.submit" @click="login">Entrar</button>
    </div>
  </main>
</template>
<script>
import styles from '@/assets/loginView.module.css'
export default {
  computed: {
    $style() {
      return styles
    },
  },
}
</script>

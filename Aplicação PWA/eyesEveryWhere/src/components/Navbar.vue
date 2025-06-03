<script setup>
import logo from './icons/IconLogo.vue'
import IconNotifcation from './icons/IconNotifcation.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/navbar.css'

const router = useRouter()

const gotHome = () => {
  router.push('/')
}
const gotServicos = () => {
  router.push('/menu_servicos')
}
const gotAuditorias = () => {
  router.push('/auditorias')
}
const gotIndicadores = () => {
  router.push('/indicadores')
}
const gotHistoricoOcorrencias = () => {
  router.push('/ver_ocorrencia')
}

const gotRegistarOcorrencias = () => {
  router.push('/registo_ocorrencias')
}

// Reactive state for toggling the navigation menu
const isNavOpen = ref(false)

// Toggle menu function
const toggleMenu = () => {
  isNavOpen.value = !isNavOpen.value
}

onMounted(() => {})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light navbar-light">
    <div class="container">
      <!-- Brand -->
      <logo class="navbar-brand" @click="gotServicos" />

      <!-- Toggler/collapsible button -->
      <button class="navbar-toggler" @click="toggleMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <!-- Navbar links -->
  <div class="fullscreen-nav" :class="{ show: isNavOpen }">
    <button class="close-btn" @click="toggleMenu">&times;</button>
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link active" @click="gotServicos">Serviços</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click="gotAuditorias">Auditorias</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click="gotIndicadores">Indicadores</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click="gotHistoricoOcorrencias">Histórico de ocorrências</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click="gotRegistarOcorrencias">Registar ocorrências</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click="gotHome">Logout</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import logo from './icons/IconLogo.vue'
import '@/assets/login_button_comercialpage.css'
import '@/assets/navbarAuditoria.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const gotHome = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light navbar-light">
    <div class="container">
      <!-- Brand -->
      <logo class="navbar-brand" @click="gotHome" />

      <ul class="navbar-nav ms-auto">
        <li class="nav-item"></li>
      </ul>
    </div>
  </nav>
</template>

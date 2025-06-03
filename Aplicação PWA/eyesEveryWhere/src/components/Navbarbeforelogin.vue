<script setup>
import logo from './icons/IconLogo.vue'
import '@/assets/login_button_comercialpage.css'
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light navbar-light">
    <div class="container">
      <!-- Brand -->
      <logo class="navbar-brand" />

      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link to="/login" class="nav-link login-link">LOGIN</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

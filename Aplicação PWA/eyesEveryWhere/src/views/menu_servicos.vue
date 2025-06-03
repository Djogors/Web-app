<script setup>
import navbar from '../components/Navbar.vue'
import IconIndicadores from '../components/icons/IconIndicadores.vue'
import IconCriarOcorrencias from '../components/icons/IconCreateOcorrencia.vue'
import IconHistoricoOcorrencias from '../components/icons/IconHistoryMenu.vue'
import IconTerminarAuditorias from '../components/icons/IconTerminateAuditory.vue'
import '@/assets/menuServicos.css'

import { useRouter } from 'vue-router'

const router = useRouter()

const gotRegistarOcorrencia = () => {
  router.push('/registo_ocorrencias')
}

const gotHistoricoOcorrencias = () => {
  router.push('/ver_ocorrencia')
}

const gotIndicadores = () => {
  router.push('/indicadores')
}

const gotTerminarAuditorias = () => {
  router.push('/presenca')
}
</script>

<template>
  <navbar />

  <h4 id="title">Serviços</h4>
  <div class="container mt-5">
    <div class="row g-4">
      <div class="col-6 mb-3">
        <div class="grid-item" @click="gotRegistarOcorrencia">
          <icon-criar-ocorrencias />
          Inserir dados
        </div>
      </div>
      <div class="col-6 mb-3">
        <div class="grid-item" @click="gotHistoricoOcorrencias">
          <icon-historico-ocorrencias />
          Dados da auditoria
        </div>
      </div>
      <div class="col-6 mb-3">
        <div class="grid-item" @click="gotIndicadores">
          <icon-indicadores />
          Indicadores
        </div>
      </div>
      <div class="col-6 mb-3">
        <div class="grid-item" @click="gotTerminarAuditorias">
          <icon-terminar-auditorias />
          Terminar Auditorias
        </div>
      </div>
    </div>
  </div>
</template>

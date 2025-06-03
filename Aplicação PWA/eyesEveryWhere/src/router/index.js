import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Auditorias from '@/views/Auditorias.vue'
import ContactosProf from '@/views/contactarProfissional.vue'
import Indicadores from '@/views/Indicadores.vue'
import menu_servicos from '@/views/menu_servicos.vue'
import registarOcorrencia from '@/views/criarOcorrencia.vue'
import historyOcorrencia from '@/views/historyOcorrencia.vue'
import TerminarAuditoria from '@/views/TerminarAuditoria.vue'
import ocorrenciaInfo from '@/views/ocorrenciaInfo.vue'
import descricaoOcorrencia from '@/views/descricaoOcorrencia.vue'
import Presenca from '@/views/presenca.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Another way of putting routing without the import
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/auditorias',
      name: 'auditorias',
      component: Auditorias,
    },
    {
      path: '/contactos',
      name: 'contactos',
      component: ContactosProf,
    },
    {
      path: '/indicadores',
      name: 'indicadores',
      component: Indicadores,
    },
    {
      path: '/menu_servicos',
      name: 'menu_servicos',
      component: menu_servicos,
    },
    {
      path: '/registo_ocorrencias',
      name: 'registo_ocorrencias',
      component: registarOcorrencia,
    },
    {
      path: '/ver_ocorrencia',
      name: 'ver_ocorrencia',
      component: historyOcorrencia,
    },
    {
      path: '/terminar_auditoria',
      name: 'terminar_auditoria',
      component: TerminarAuditoria,
    },
    {
      path: '/ocorrencia_info',
      name: 'ocorrencia_info',
      component: ocorrenciaInfo,
    },
    {
      path: '/descricao_ocorrencia',
      name: 'descricao_ocorrencia',
      component: descricaoOcorrencia,
    },
    {
      path: '/presenca',
      name: 'confirmacao_presenca',
      component: Presenca,
    },
  ],
})

export default router

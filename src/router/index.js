import { createRouter, createWebHistory } from 'vue-router'

import LaboratorioView from '@/views/LaboratorioView.vue'
import LaboratoriosView from '@/views/LaboratoriosView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/laboratorios',
      name: 'Laboratorios',
      component: LaboratoriosView
    },
    {
      path: '/laboratorios/:id',
      name: 'Laboratorio',
      componente: LaboratorioView,
      props: true
    }
  ],
})

export default router

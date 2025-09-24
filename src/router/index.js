import LaboratoriosView from '@/views/LaboratoriosView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/laboratorios',
      name: 'Laboratorios',
      component: LaboratoriosView
    },
  ],
})

export default router

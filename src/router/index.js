import { createRouter, createWebHistory } from 'vue-router'

import LaboratoriosView from '@/views/LaboratoriosView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/laboratorios',
      name: 'Laboratorios',
      component: LaboratoriosView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/',
      redirect: '/login' // redireciona a raiz para /login
    }
  ]
})

export default router

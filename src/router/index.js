import { createRouter, createWebHistory } from 'vue-router'

import LaboratorioView from '@/views/LaboratorioView.vue'
import LaboratoriosView from '@/views/LaboratoriosView.vue'
import LoginView from '@/views/LoginView.vue'
import ChamadoView from '@/views/ChamadoView.vue'
import CadastroView from '@/views/CadastroView.vue'

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
      redirect: '/cadastro'
    },
    {
      path: '/chamados',
      name: 'Chamados',
      component: ChamadoView
    },
    {
      path: '/laboratorios/:id',
      name: 'Laboratorio',
      component: LaboratorioView,
      props: true
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: CadastroView
    }
  ]
})

export default router

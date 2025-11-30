import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores'
import './assets/styles/main.css'
import './assets/styles/ui.css'

const app = createApp(App)

app.use(router)
app.use(pinia)

import { useAuthStore } from "@/stores/useAuthStore";
const auth = useAuthStore();
auth.init();

app.mount('#app')

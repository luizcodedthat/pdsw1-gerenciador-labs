<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import ChamadoCard from '@/components/chamados/ChamadoCard.vue'
import ChamadoModal from '@/components/chamados/ChamadoModal.vue'
import SearchArea from '@/components/labs/SearchArea.vue'

const chamados = ref([])
const filtros = ['Todos', 'Aberto', 'Em andamento', 'Concluído', 'Fechado']
const filtroStatus = ref('Todos')
const busca = ref('')

const chamadosFiltrados = computed(() => {
  return chamados.value
    .filter(c => filtroStatus.value === 'Todos' || c.status === filtroStatus.value)
    .filter(c =>
      c.titulo.toLowerCase().includes(busca.value.toLowerCase()) ||
      c.descricao.toLowerCase().includes(busca.value.toLowerCase())
    )
})

const modalVisivel = ref(false)
const chamadoSelecionado = ref(null)

const abrirModal = (chamado) => {
  chamadoSelecionado.value = chamado
  modalVisivel.value = true
}

const fecharModal = () => modalVisivel.value = false

const carregarChamados = async () => {
  const res = await fetch('http://localhost:3000/chamados')
  chamados.value = await res.json()
}

const salvarAlteracoes = async ({ id, status, comentario }) => {
  const index = chamados.value.findIndex(c => c.id === id)
  if (index !== -1) {
    const chamado = chamados.value[index]

    if (!chamado.comentarios) chamado.comentarios = []

    const novoComentario = {
      data: new Date().toLocaleString(),
      texto: comentario
    }
    chamado.comentarios.push(novoComentario)

    chamados.value[index].status = status
    chamados.value[index].comentarios = chamado.comentarios
  }


  fecharModal()
}

onMounted(carregarChamados)
</script>

<template>
  <Navbar />

  <div class="chamados-container">
    <SearchArea v-model="busca" placeholder="Busque pelo título ou descrição do chamado" />

    <div class="filtros">
      <button
        v-for="f in filtros"
        :key="f"
        @click="filtroStatus = f"
        :class="{ ativo: filtroStatus === f }"
      >
        {{ f }}
      </button>
    </div>

    <div class="chamados-grid">
      <ChamadoCard
        v-for="chamado in chamadosFiltrados"
        :key="chamado.id"
        :chamado="chamado"
        @abrir-modal="abrirModal"
      />
    </div>
  </div>

  <ChamadoModal
    :chamado="chamadoSelecionado"
    :filtros="filtros"
    :visivel="modalVisivel"
    @fechar="fecharModal"
    @salvar="salvarAlteracoes"
  />
</template>

<style scoped>
.chamados-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.filtros {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  margin-top: 28px;
}

.filtros button {
  padding: 8px 16px;
  border: 1px #ddd solid;
  background: #fff;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.filtros button:hover {
  background: #f9f9f9;
}

.filtros button.ativo {
  background: #f1f1f1;
  font-weight: bold;
}

.chamados-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-top: 16px;
}
</style>

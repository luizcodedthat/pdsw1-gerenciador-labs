<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  chamado: Object,
  filtros: Array,
  visivel: Boolean
})

const emits = defineEmits(['fechar', 'salvar'])

const novoStatus = ref('')
const comentario = ref('') //

watch(() => props.chamado, (val) => {
  if (val) {
    novoStatus.value = val.status
    comentario.value = ''
  }
})

const salvar = () => {
  emits('salvar', {
    id: props.chamado.id,
    status: novoStatus.value,
    comentario: comentario.value
  })
}

const isFinalizado = computed(() =>
  ['Concluído', 'Fechado'].includes(props.chamado?.status)
)
</script>

<template>
  <div v-if="visivel" class="modal-overlay" @click.self="$emit('fechar')">
    <div class="modal">
      <h2>Chamado #{{ chamado.id }}</h2>
      <p><strong>Data:</strong> {{ chamado.data }}</p>
      <p><strong>Título:</strong> {{ chamado.titulo }}</p>
      <p><strong>Descrição:</strong> {{ chamado.descricao }}</p>

      <label>Status:</label>
      <select v-model="novoStatus" :disabled="isFinalizado">
        <option v-for="f in filtros.filter(f => f !== 'Todos')" :key="f" :value="f">{{ f }}</option>
      </select>

      <label>Comentário:</label>
      <textarea v-model="comentario" rows="4" placeholder="Escreva aqui..." :readonly="isFinalizado"></textarea>

      <div class="modal-buttons">
        <button class="btn-info" @click="$emit('fechar')">Fechar</button>
        <button v-if="!isFinalizado" class="btn-atender" @click="salvar">Salvar alterações</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top:0; left:0;
  width:100%; height:100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background:#fff;
  border-radius: 10px;
  padding: 24px;
  width:90%;
  max-width:520px;
  box-shadow:0 4px 12px rgba(0,0,0,0.3);
}
.modal h2 { margin-bottom:12px; }
.modal p { margin-bottom:8px; }
.modal label { font-weight:600; margin-top:12px; display:block; }
.modal textarea, .modal select {
  width:100%;
  padding:10px;
  margin-top:4px;
  border-radius:6px;
  border:1px solid #d1d5db;
  font-size:14px;
}
.modal-buttons {
  display:flex;
  justify-content:flex-end;
  gap:8px;
  margin-top:16px;
}
.btn-atender {
  background:#22c55e;
  color:#fff;
  border:none;
  padding:8px 14px;
  border-radius:6px;
  cursor:pointer;
  font-size:14px;
}
.btn-atender:hover { background:#16a34a; }
.btn-info {
  background:#fff;
  border:1px solid #d1d5db;
  color:#374151;
  padding:8px 14px;
  border-radius:6px;
  cursor:pointer;
  font-size:14px;
}
.btn-info:hover { background:#f9fafb; }
</style>

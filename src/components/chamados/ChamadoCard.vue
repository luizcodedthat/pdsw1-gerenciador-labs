<script setup>
import { defineEmits } from "vue";

const props = defineProps({
  chamado: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["abrir-modal"]);

const limitarTexto = (texto = "", limite = 0) => {
  if (!texto) return "";
  return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
};

const abrir = () => {
  emits("abrir-modal", props.chamado);
};
</script>

<template>
  <div class="chamado-card">
    <div class="chamado-header">
      <span class="data">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
        {{
          chamado.data ||
          (chamado.createdAt ? new Date(chamado.createdAt).toLocaleDateString("pt-BR") : "Sem data")
        }}
      </span>

      <span :class="['status', (chamado.status || '').toLowerCase().replace(' ', '-')]">{{
        chamado.status
      }}</span>

      <span class="id-chamado"> LAB-{{ chamado.labId.replace("lab", "").padStart(2, "0") }} </span>
    </div>

    <h3>{{ limitarTexto(chamado.titulo, 30) }}</h3>
    <p>{{ limitarTexto(chamado.descricao, 60) }}</p>

    <button
      v-if="
        ['Aberto', 'Em andamento', 'Em andamento'.toLowerCase()].includes(
          (chamado.status || '').toString()
        ) ||
        (chamado.status && chamado.status.toLowerCase().includes('aberto'))
      "
      class="btn-atender"
      @click="abrir"
    >
      Atender chamado
    </button>
    <button v-else class="btn-info" @click="abrir">Ver informações</button>
  </div>
</template>

<style scoped>
.chamado-card {
  background: #fff;
  border: 1px #cbd5e1 solid;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.3s ease;
}

.chamado-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.chamado-header {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px 12px;
  align-items: start;
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
}

.chamado-header .data {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chamado-header .status {
  grid-column: 2;
  grid-row: 1 / span 2;
  justify-self: end;
  align-self: center;
}

.chamado-header .id-chamado {
  grid-column: 1;
  grid-row: 4;
  font-weight: 600;
  color: var(--color-gray-text);
}

.status {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}
.status.aberto {
  background: #fde68a;
  color: #92400e;
}
.status.em-andamento {
  background: #fdba74;
  color: #9a3412;
}
.status.concluído {
  background: #bbf7d0;
  color: #166534;
}
.status.fechado {
  background: #fecaca;
  color: #991b1b;
}

.chamado-card h3 {
  font-weight: 600;
  font-size: 15px;
  color: #111827;
  margin: 4px 0;
}

.chamado-card p {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
}

.chamado-card button {
  margin-top: 12px;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-atender {
  background: var(--color-primary, #2563eb);
  color: #fff;
  border: none;
}
.btn-atender:hover {
  background: #16a34a;
}

.btn-info {
  background: #fff;
  border: 1px solid #d1d5db;
  color: #374151;
}
.btn-info:hover {
  background: #f9fafb;
}



</style>

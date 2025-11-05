<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  chamado: Object,
  filtros: Array,
  visivel: Boolean,
});

const emits = defineEmits(["fechar", "salvar"]);

const novoStatus = ref("");
const comentario = ref("");

watch(
  () => props.chamado,
  (val) => {
    if (val) {
      novoStatus.value = val.status || "";
      comentario.value = "";
    }
  }
);

const fecharModal = () => emits("fechar");

const salvar = () => {
  emits("salvar", {
    id: props.chamado.id,
    status: novoStatus.value,
    comentario: comentario.value,
  });
};

const isFinalizado = computed(() =>
  ["Concluído", "Fechado"].includes(props.chamado?.status)
);

const statusClass = computed(() => {
  const status = props.chamado?.status?.toLowerCase() || "";
  if (status.includes("andamento")) return "em-andamento";
  if (status.includes("aberto")) return "aberto";
  if (status.includes("concluído")) return "concluido";
  if (status.includes("fechado")) return "fechado";
  return "";
});

const formatarData = (data) => {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="visivel"
      class="modal-overlay"
      @click.self="fecharModal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`titulo-${chamado?.id}`"
    >
      <div class="modal" ref="modalEl" tabindex="-1">
        <!-- HEADER -->
        <header class="modal-header">
          <div class="title-wrap">
            <h2 :id="`titulo-${chamado?.id}`">Chamado #{{ chamado?.id }}</h2>
            <span class="badge" :class="statusClass">{{ chamado?.status }}</span>
          </div>
          <button class="btn-close" @click="fecharModal" aria-label="Fechar modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </header>

        <hr class="divider" />

        <!-- BLOCO DE INFORMAÇÕES -->
        <section class="info-block">
          <div class="info-item">
            <label>Data:</label>
            <p>{{ formatarData(chamado?.data) }}</p>
          </div>

          <div class="info-item">
            <label>Título:</label>
            <p>{{ chamado?.titulo }}</p>
          </div>

          <div class="info-item">
            <label>Descrição:</label>
            <p class="descricao">{{ chamado?.descricao }}</p>
          </div>
        </section>

        <!-- BLOCO DE EDIÇÃO -->
        <section class="edit-block">
          <div class="field">
            <label class="field-label">Status</label>
            <select v-model="novoStatus" class="select" :disabled="isFinalizado">
              <option
                v-for="f in filtros.filter(x => x !== 'Todos')"
                :key="f"
                :value="f"
              >
                {{ f }}
              </option>
            </select>
          </div>

          <div class="field">
            <label class="field-label">Comentário</label>
            <textarea
              v-model="comentario"
              class="textarea"
              :readonly="isFinalizado"
              rows="4"
              placeholder="Escreva aqui..."
            ></textarea>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="modal-footer">
          <button class="btn-cancel" @click="fecharModal">Fechar</button>
          <button class="btn-save" :disabled="isFinalizado" @click="salvar">
            Salvar alterações
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>


<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

/* Container */
.modal {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  padding: 20px 24px;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1b;
}

.btn-close {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 50%;
  padding: 4px;
  transition: background 0.2s ease;
}
.btn-close:hover {
  background: #f3f4f6;
}

/* Divider */
.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 12px 0 16px;
}

/* Badge */
.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: capitalize;
}
.badge.em-andamento {
  background: #fdba74; color: #9a3412;;
}
.badge.aberto {
  background: #fde68a; color: #92400e;
}
.badge.concluido {
  background: #bbf7d0; color: #166534;
}
.badge.fechado {
  background: #fecaca; color: #991b1b;
}

/* BLOCO DE INFORMAÇÕES */
.info-block {
  margin-bottom: 24px;
  font-size: 0.95rem;
  color: #1a1a1b;
}

.info-item {
  margin-bottom: 10px;
}
.info-item label {
  font-weight: 600;
  color: #111827;
  display: block;
  margin-bottom: 2px;
}
.info-item p {
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* BLOCO DE EDIÇÃO */
.field {
  margin-bottom: 14px;
}
.field-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1b;
}
.textarea,
.select {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 10px;
  font-size: 0.9rem;
  background: #fff;
  transition: border 0.2s ease, background 0.2s ease;
}
.textarea:focus,
.select:focus {
  outline: none;
  border-color: #2563eb;
  background: #fff;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
.btn-cancel {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-cancel:hover {
  background: #f3f4f6;
}
.btn-save {
  background: var(--color-primary);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-save:hover {
  background: #1e40af;
}

/* Transição */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

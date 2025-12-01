<script setup>
import { ref } from 'vue'
import { Transition } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

defineProps({
  show: { type: Boolean, default: false },
  labInfo: { type: Object, required: true }
})

const selectedDate = ref(new Date())
const startTime = ref('')
const endTime = ref('')
const message = ref('')
</script>

<template>
<Transition name="modal">
  <div class="modal-backdrop" v-if="show">

    <div class="modal-container">

      <h1 class="modal-title">Reservar laboratório</h1>
      <h2 class="modal-subtitle">{{ labInfo.name }}</h2>

      <div class="field">
        <label class="label">Data</label>
        <DatePicker expanded locale="pt-BR" :first-day-of-week="1" v-model="selectedDate" mode="date" is-required />
      </div>

      <div class="time-row">
        <div class="field">
          <label class="label" for="start-time">Início</label>
          <select v-model="startTime" id="start-time" class="input">
            <option value="">Selecione...</option>
          </select>
        </div>

        <div class="field">
          <label class="label" for="end-time">Fim</label>
          <select v-model="endTime" id="end-time" class="input">
            <option value="">Selecione...</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="label" for="short-message">Mensagem</label>
        <textarea
          id="short-message"
          v-model="message"
          class="textarea"
          placeholder="Ex.: ADS4M, Mulheres Mil, Apresentação de TCC"
          rows="2"
        ></textarea>
        <p class="help-text">Mensagem curta informando o propósito da reserva.</p>
      </div>

      <div class="footer">
        <button class="btn-outline">Cancelar</button>
        <button class="btn-primary">Enviar reserva</button>
      </div>

    </div>

  </div>
</Transition>
</template>

<style scoped>
/* ------------------------------- */
/* Overlay */
/* ------------------------------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 50;
}

/* ------------------------------- */
/* Container estilo shadcn */
/* ------------------------------- */
.modal-container {
  background: white;
  width: 100%;
  max-width: 480px;
  padding: 1.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 8px 16px -4px rgba(0,0,0,0.08),
    0 4px 6px -2px rgba(0,0,0,0.05);
  animation: zoomIn 0.17s ease-out;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ------------------------------- */
/* Títulos */
/* ------------------------------- */
.modal-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #111827;
}

.modal-subtitle {
  font-size: 0.95rem;
  font-weight: 400;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* ------------------------------- */
/* Campos */
/* ------------------------------- */
.field {
  margin-bottom: 1.25rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
  color: #374151;
}

/* ------------------------------- */
/* Inputs estilo shadcn */
/* ------------------------------- */
.input,
.textarea {
  width: 100%;
  background: white;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  transition: all 0.15s ease;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
}

.textarea {
  resize: none;
}

.help-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #6b7280;
}

/* ------------------------------- */
/* Linha de horários */
/* ------------------------------- */
.time-row {
  display: flex;
  gap: 1rem;
}

/* ------------------------------- */
/* Botões estilo shadcn */
/* ------------------------------- */
.btn-primary {
  background: #111827;
  color: white;
  padding: 0.55rem 1.1rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  transition: background 0.15s ease;
}

.btn-primary:hover {
  background: #1f2937;
}

.btn-outline {
  padding: 0.55rem 1.1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 0.875rem;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
}

/* Footer */
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* ------------------------------- */
/* Transition (matching shadcn feel) */
/* ------------------------------- */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

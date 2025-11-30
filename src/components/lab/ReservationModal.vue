<script setup>
import { ref, computed } from 'vue';
import { Transition } from 'vue';
import { DatePicker } from 'v-calendar';

import 'v-calendar/style.css';

defineProps({
  show: { type: Boolean, default: false },
  labInfo: { type: Object, required: true }
})

const startTime = ref('')
const endTime = ref('')
const date = ref(new Date())
const recurring = ref(false)
const message = ref('')

</script>

<template>

<Transition name="modal">

  <div class="modal-backdrop" v-if="show">

    <div class="modal-foreground">

      <h1 class="title"></h1>
      <h2 class="subtitle"></h2>

      <DatePicker expanded locale="pt-BR" :first-day-of-week="1" v-model="selectedDate" mode="date" is-required />

      <div class="input-field">
        <label for="start-time">Início</label>
        <select name="start-time" id="start-time"></select>
      </div>

      <div class="input-field">
        <label for="end-time">Fim</label>
        <select name="end-time" id="end-time"></select>
      </div>

      <div class="message-field">
        <label for="short-message">Mensagem</label>
        <textarea name="short-message" id="short-message" rows="2" placeholder="Ex.: ADS4M, Mulheres Mil, Apresentação de TCC"></textarea>
        <p>Mensagem curta informando o propósito da reserva.</p>
      </div>

    </div>

  </div>

</Transition>

</template>

<style scoped>

</style>
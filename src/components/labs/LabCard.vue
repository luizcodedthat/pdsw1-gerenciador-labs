<script setup>

import { computed, toRef } from 'vue';
import { AlarmClock } from 'lucide-vue-next';
import { useAvailability } from '@/composables/useAvailability';

const props = defineProps({
  labID: {
    type: String,
    required: true
  },
  timeSlots: {
    type: Array,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  }
})

const timeSlots = toRef(props, "timeSlots")

const { calculateAvailability } = useAvailability(timeSlots);

const availability = computed(() => calculateAvailability());

</script>

<template>

  <div class="lab-card">
    <div class="card-top">
      <alarm-clock size="16" />
      <p class="availability-text">
        {{ availability.status }}
        <span v-if="availability.until">
          até às {{ new Date(availability.until).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit',
            hour12: false
          }) }}
        </span>
      </p>
    </div>

    <div class="description">
      <h2 class="lab-name">{{ name }}</h2>

      <p class="capacity-text">Comporta {{ capacity }} alunos.</p>
    </div>

    <RouterLink class="link-lab" :to="`/laboratorios/${labID}`"> Ir para reserva </RouterLink>

  </div>

</template>

<style scoped>
.card-top {
  display: flex;
  gap: 4px;
}

.lab-card {
  padding: 25px 20px;
  border-radius: 5px;
  border: 1px solid hsl(213, 27%, 84%);
  box-sizing: border-box;

  padding: 25px 20px;

  width: 248px;
  height: auto;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lab-name {
  margin-bottom: 5px;
}

.availability-text {
  font-size: 14px;
}

.capacity-text {
  color: #64748B;
}

.link-lab {
  text-decoration: none;
  text-align: center;
  background-color: var(--color-primary);

  padding: 10px 16px;
  border-radius: 5px;

  margin-top: .4rem;
  color: hsl(0, 0%, 100%);
  font-size: var(--font-size-sm);
}
</style>
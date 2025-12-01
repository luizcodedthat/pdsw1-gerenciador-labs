<script setup>
import { ref, onMounted, computed } from "vue"
import { useReservationStore } from "@/stores/useReservationStore"
import { AlarmClock } from "lucide-vue-next"

const props = defineProps({
  labId: { type: String, required: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true }
})

const reservationStore = useReservationStore()

const slots = [
  { index: 0, startTime: "07:45", endTime: "08:30" },
  { index: 1, startTime: "08:30", endTime: "09:15" },
  { index: 2, startTime: "09:35", endTime: "10:20" },
  { index: 3, startTime: "10:20", endTime: "11:05" },
  { index: 4, startTime: "11:05", endTime: "11:50" },
  { index: 5, startTime: "13:00", endTime: "13:45" },
  { index: 6, startTime: "13:45", endTime: "14:30" },
  { index: 7, startTime: "14:30", endTime: "15:15" },
  { index: 8, startTime: "15:35", endTime: "16:20" },
  { index: 9, startTime: "16:20", endTime: "17:05" },
  { index: 10, startTime: "17:05", endTime: "17:50" },
  { index: 11, startTime: "18:15", endTime: "19:00" },
  { index: 12, startTime: "19:00", endTime: "19:45" },
  { index: 13, startTime: "19:45", endTime: "20:30" },
  { index: 14, startTime: "20:30", endTime: "21:15" },
  { index: 15, startTime: "21:15", endTime: "22:00" },
]

function timeToNumber(timeStr) {
  const [h, m] = timeStr.split(":").map(Number)
  return h + m / 60
}

function slotStart(slotIndex) {
  return timeToNumber(slots[slotIndex].startTime)
}

function slotEnd(slotIndex) {
  return timeToNumber(slots[slotIndex].endTime)
}

onMounted(() => {
  reservationStore.loadReservationsByLab(props.labId)
})

const labReservations = computed(() =>
  reservationStore.reservationsByLab(props.labId)
)

const currentReservation = computed(() => {
  const now = new Date()
  const nowNum = now.getHours() + now.getMinutes() / 60

  return labReservations.value
    .map(res => {
      const first = res.intervals[0]
      const last = res.intervals.at(-1)

      return {
        res,
        start: slotStart(first.startSlot),
        end: slotEnd(last.endSlot)
      }
    })
    .find(r => r.start <= nowNum && nowNum <= r.end)?.res || null
})

const nextReservation = computed(() => {
  const now = new Date()
  const nowNum = now.getHours() + now.getMinutes() / 60

  return labReservations.value
    .map(res => {
      const s = slotStart(res.intervals[0].startSlot)
      return { res, start: s }
    })
    .filter(r => r.start > nowNum)
    .sort((a, b) => a.start - b.start)[0]?.res || null
})

const availabilityText = computed(() => {
  if (currentReservation.value) {
    const last = currentReservation.value.intervals.at(-1)
    const time = slots[last.endSlot].endTime
    return `Ocupado até ${time}`
  }

  if (nextReservation.value) {
    const first = nextReservation.value.intervals[0]
    const time = slots[first.startSlot].startTime
    return `Disponível até ${time}`
  }

  return "Disponível o dia todo"
})
</script>

<template>
  <div class="lab-card">
    
    <div class="card-top">
      <alarm-clock size="16" />
      <p class="availability-text">{{ availabilityText }}</p>
    </div>

    <div class="description">
      <h2 class="lab-name">{{ name }}</h2>
      <p class="capacity-text">Comporta {{ capacity }} alunos.</p>
    </div>

    <RouterLink class="link-lab" :to="`/laboratorios/${labId}`">
      Ir para reserva
    </RouterLink>

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
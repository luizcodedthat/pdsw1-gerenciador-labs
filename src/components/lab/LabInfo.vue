<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLabStore } from '@/stores/useLabStore'
import { useReservationStore } from '@/stores/useReservationStore'
import ReservationModal from '@/components/lab/ReservationModal.vue'
import { AlarmClock, Building, Computer, Signal, StickyNote } from 'lucide-vue-next'

const props = defineProps({ id: String })

const labStore = useLabStore()
const reservationStore = useReservationStore()

const lab = ref(null)
const showModal = ref(false)

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
  { index: 15, startTime: "21:15", endTime: "22:00" }
]

function timeToNumber(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h + m / 60
}

function slotToStartHour(index) {
  const slot = slots[index]
  return slot ? timeToNumber(slot.startTime) : Infinity
}

function slotToEndHour(index) {
  const slot = slots[index]
  return slot ? timeToNumber(slot.endTime) : -Infinity
}

function getStartSlot(reservation) {
  const first = reservation.intervals?.[0]
  return first ? slotToStartHour(first.startSlot) : Infinity
}

function getEndSlot(reservation) {
  const last = reservation.intervals?.at(-1)
  return last ? slotToEndHour(last.endSlot) : -Infinity
}

const labReservations = computed(() => {
  if (!lab.value) return []
  return reservationStore.reservationsByLab(lab.value.id)
})

const currentReservation = computed(() => {
  const now = new Date()
  const nowNum = now.getHours() + now.getMinutes() / 60

  return (
    [...labReservations.value]
      .sort((a, b) => getStartSlot(a) - getStartSlot(b))
      .find(res => getStartSlot(res) <= nowNum && nowNum <= getEndSlot(res))
    || null
  )
})

const nextReservationsList = computed(() => {
  const now = new Date()
  const nowNum = now.getHours() + now.getMinutes() / 60

  return [...labReservations.value]
    .sort((a, b) => getStartSlot(a) - getStartSlot(b))
    .filter(res => getStartSlot(res) > nowNum)
})

onMounted(async () => {
  lab.value = await labStore.loadLabById(props.id)

  await reservationStore.loadReservationsByLab(lab.value.id)
})
</script>

<template>
  <div class="lab-wrapper" v-if="lab">
    
    <div class="heading">
      <h1 class="lab-title">{{ lab.name }}</h1>
      <h3 class="lab-category">{{ lab.category }}</h3>
    </div>

    <div class="lab-cards">

      <div class="lab-reservation">
        
        <div class="current-reservation-section">

          <div class="current-reservation-card">
            <h3 class="card-text-top">Atual responsável</h3>

            <h2 class="card-title">
              {{ currentReservation ? currentReservation.authorName : "Livre" }}
            </h2>

            <h3 class="card-text-bottom">
              <sticky-note size="16" color="#64748B" />
              {{ currentReservation ? currentReservation.description : "Laboratório vago" }}
            </h3>
          </div>

          <h4 class="next-reservations-section-text">Próximas reservas</h4>

          <div class="current-reservation-card" v-if="currentReservation">
            <h3 class="card-text-top">Reservado até o</h3>

            <h2 class="card-title">
              {{ currentReservation.intervals.at(-1).endSlot }}º horário
            </h2>

            <h3 class="card-text-bottom">
              {{ slots[currentReservation.intervals.at(-1).endSlot].endTime }}
            </h3>
          </div>
        </div>

        <div class="next-reservation-section">

          <div class="next-reservation-card"
               v-for="reserv in nextReservationsList"
               :key="reserv.id">

            <div class="top">
              <div class="reservation-range">
                <alarm-clock size="16" color="#64748B" />

                <h3 class="next-card-text-top">
                  {{ reserv.intervals[0].startSlot + 1 }}º
                  <span v-if="reserv.intervals.at(-1).endSlot !== reserv.intervals[0].startSlot">
                    ao {{ reserv.intervals.at(-1).endSlot + 1 }}º horário
                  </span>
                </h3>
              </div>

              <h3 class="ticket-status">
                {{ reserv.approved ? "Aprovada" : "Em análise" }}
              </h3>
            </div>

            <h2 class="next-card-title">{{ reserv.authorName }}</h2>
            <h3 class="next-card-text-bottom">{{ reserv.description }}</h3>
          </div>

          <div class="next-reservation-card" v-if="nextReservationsList.length === 0">
            <div class="top">
              <div class="reservation-range">
                <alarm-clock size="16" color="#64748B" />
                <h3 class="next-card-text-top">Restante do dia</h3>
              </div>
              <h3 class="ticket-status">Disponível</h3>
            </div>

            <h2 class="next-card-title">Vago</h2>
            <h3 class="next-card-text-bottom">Aguardando reserva...</h3>
          </div>

        </div>

        <button @click="showModal = true" class="btn-primary">
          Reservar esse laboratório
        </button>

        <ReservationModal :show="showModal" :labInfo="lab" />
      </div>

      <div class="info-cards">
        
        <div class="info-card">
          <div class="top">Capacidade <computer size="16" /></div>
          <h2>{{ lab.capacity }} alunos</h2>
        </div>

        <div class="info-card">
          <div class="top">Localização <building size="16" /></div>
          <h2>{{ lab.local }}</h2>
        </div>

        <div class="info-card">
          <div class="top">Estado <signal size="16" /></div>
          <h2>{{ lab.available ? "Aberto" : "Fechado" }}</h2>
        </div>

      </div>

    </div>

  </div>
</template>


<style scoped>
.lab-title {
    font-size: var(--font-size-5xl);
}

.lab-category {
    font-size: var(--font-size-lg);
    font-weight: 400;
    color: hsl(215, 19%, 35%);
    margin-bottom: 20px;
}

.lab-cards {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.lab-reservation {
    flex: 1;
}

.next-reservation-section {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    flex-direction: row;
}

.next-reservation-card {

}

.next-reservations-section-text {
    font-size: var(--font-size-base);
    font-weight: 500;
    margin-bottom: 10px;
}

.current-reservation-card {
    padding: 20px 40px 20px 20px;
    border-radius: 6px;
    border: 1px solid var(--color-gray-border);
    width: fit-content;
}

.card-text-top,
.ticket-status {
    font-size: var(--font-size-sm);
    font-weight: 400;
}

.card-title {
    font-size: var(--font-size-2xl);
    margin: 5px 0 3px;
}

.card-text-bottom {
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--color-gray-text);
    display: flex;
    gap: 4px;
}

.next-reservation-card {
    padding: 20px 20px 20px 20px;
    border-radius: 6px;
    border: 1px solid var(--color-gray-border);
    width: fit-content;
    min-width: 260px;
}

.next-reservation-card .top {
    display: flex;
    justify-content: space-between;
}

.next-reservation-card .reservation-range {
    display: flex;
    gap: 5px;
    align-items: center;
}

.reservation-range h3 {
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--color-gray-text);
}

.next-card-title {
    font-size: var(--font-size-base);
    font-weight: 500;
    margin: 10px 0 4px;
}

.next-card-text-bottom {
    font-size: var(--font-size-base);
    font-weight: 400;
    color: var(--color-gray-text);
}

.info-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info-card {
    padding: 20px 20px 20px 20px;
    border-radius: 6px;
    border: 1px solid var(--color-gray-border);
    min-width: 180px;
}

.info-card .top {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-sm);
}

.info-card h2 {
    font-size: var(--font-size-2xl);
    margin-top: 5px;
}

.btn-primary {
    padding: 10px 16px;
}

h3 span {
    color: var(--color-gray-text);
}
</style>
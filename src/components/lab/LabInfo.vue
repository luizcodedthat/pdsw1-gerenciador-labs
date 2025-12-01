<script setup>
import { ref, onMounted } from 'vue'
import { useLabStore } from '@/stores/useLabStore'
import { useReservationStore } from '@/stores/useReservationStore'
import ReservationModal from '@/components/lab/ReservationModal.vue'
import { AlarmClock, Building, Computer, Signal, StickyNote } from 'lucide-vue-next'

const props = defineProps({ id: String })

const labStore = useLabStore()
const reservationStore = useReservationStore()

const lab = ref(null)
const labReservations = ref([])

const currentReservation = ref(null)
const nextReservationsList = ref([])
const showModal = ref(false)

// -------------------------------------------------------------
// Utilidades de horário
// -------------------------------------------------------------
function timeToNumber(timeStr) {
    const [h, m] = timeStr.split(':').map(Number)
    return h + m / 60
}

function getStartSlot(res) {
    if (!res.intervals?.length) return Infinity
    return timeToNumber(res.intervals[0].start)
}

function getEndSlot(res) {
    if (!res.intervals?.length) return -Infinity
    const last = res.intervals[res.intervals.length - 1]
    return timeToNumber(last.end)
}

// -------------------------------------------------------------
// Algoritmo principal
// -------------------------------------------------------------
function processReservations() {
    const now = new Date()
    const nowNum = now.getHours() + now.getMinutes() / 60

    const reservations = labReservations.value

    // Ordena reservas pelo início do primeiro slot
    const sorted = [...reservations].sort((a, b) => {
        return getStartSlot(a) - getStartSlot(b)
    })

    // Reserva atual
    currentReservation.value = sorted.find(res => {
        return getStartSlot(res) <= nowNum && nowNum <= getEndSlot(res)
    }) || null

    // Próximas reservas
    nextReservationsList.value = sorted.filter(res => {
        return getStartSlot(res) > nowNum
    })
}

// -------------------------------------------------------------
// Fluxo inicial
// -------------------------------------------------------------
onMounted(async () => {
    lab.value = await labStore.loadLabById(props.id)

    await reservationStore.loadReservationsByLab(lab.value.id)

    labReservations.value = reservationStore.reservationsByLab(lab.value.id)

    processReservations()
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
                        <h2 class="card-title">{{ currentReservation ? currentReservation.authorName : "Livre" }}
                        </h2>
                        <h3 class="card-text-bottom"> <sticky-note size="16" color="#64748B" /> {{
                            currentReservation ? currentReservation.description :
                                "Laboratório vago" }}</h3>
                    </div>
                    <h4 class="next-reservations-section-text">Próximas reservas</h4>
                    <div class="current-reservation-card" v-if="currentReservation">
                        <h3 class="card-text-top">Reservado até o</h3>
                        <h2 class="card-title">{{ currentReservation.intervals[currentReservation.intervals.length -
                            1].index }}º horário
                        </h2>
                        <h3 class="card-text-bottom">{{ currentReservation.intervals[currentReservation.intervals.length
                            - 1].end }}</h3>
                    </div>
                </div>
                <div class="next-reservation-section">

                    <div class="next-reservation-card" v-for="reserv in nextReservationsList" :key="reserv.id">
                        <div class="top">
                            <div class="reservation-range">
                                <alarm-clock size="16" color="#64748B" />
                                <h3 class="next-card-text-top">
                                    {{ reserv.intervals[0].index }}º horário
                                    <span v-if="reserv.intervals.at(-1).index != reserv.intervals[0].index">ao {{
                                        reserv.intervals.at(-1).index }}º horário</span>
                                </h3>
                            </div>
                            <h3 class="ticket-status">{{ reserv.approved ? "Aprovada" : "Em análise" }}</h3>
                        </div>
                        <h2 class="next-card-title">{{ reserv.authorName }}
                        </h2>
                        <h3 class="next-card-text-bottom"> {{ reserv.description }}</h3>
                    </div>

                    <div class="next-reservation-card" v-if="nextReservationsList.length == 0">
                        <div class="top">
                            <div class="reservation-range">
                                <alarm-clock size="16" color="#64748B" />
                                <h3 class="next-card-text-top">Restante do dia</h3>
                            </div>
                            <h3 class="ticket-status">Disponível</h3>
                        </div>
                        <h2 class="next-card-title">Vago
                        </h2>
                        <h3 class="next-card-text-bottom">Aguardando reserva...</h3>
                    </div>

                </div>
                <button @click="showModal = true" class="btn-primary">Reservar esse laboratório</button>
                <ReservationModal :show="showModal" :labInfo="lab" />
            </div>
            <div class="info-cards">
                <div class="info-card">
                    <div class="top">Capacidade
                        <computer size="16" />
                    </div>
                    <h2>{{ lab.capacity }} alunos</h2>
                </div>
                <div class="info-card">
                    <div class="top">Localização
                        <building size="16" />
                    </div>
                    <h2>{{ lab.local }} </h2>
                </div>
                <div class="info-card">
                    <div class="top">Estado
                        <signal size="16" />
                    </div>
                    <h2>{{ lab.available ? "Fechado" : "Aberto" }} </h2>
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
    min-width: 250px;
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
</style>
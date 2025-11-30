<script setup>

import { ref, onMounted } from 'vue'
import { AlarmClock, Building, Computer, PlusCircle, Signal, StickyNote } from 'lucide-vue-next'
import { useCurrentReservation } from '@/composables/useCurrentReservation'
import Navbar from '@/components/Navbar.vue'
import TicketCardList from '@/components/lab/TicketCardList.vue'

const props = defineProps({ id: String })

const data = ref({})
const reservationsData = ref({})
const nextReservationsList = ref([])
const { currentReservation, getCurrentReservation } = useCurrentReservation(data)

onMounted(async () => {
    const response = await fetch(`http://localhost:3000/listaLabs?id=${props.id}`)
    const result = await response.json()
    data.value = result[0]

    await getCurrentReservation()

    const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
    )
        .toISOString()
        .split("T")[0]

    const reservationsResponse = await fetch(`http://localhost:3000/reservas?date=${today}`)
    const reservationsResult = await reservationsResponse.json()
    reservationsData.value = reservationsResult

    const currentEndTime = currentReservation.value?.reservationInfo?.endTime

    nextReservationsList.value = reservationsData.value
        .filter(res => {
            if (res.labId !== data.value.id) return false

            if (!res.timeSlotStart || !res.timeSlotEnd || !res.approved) return false

            const startSlot = data.value.timeSlots[res.timeSlotStart]
            if (!startSlot) return false

            return (
                !currentEndTime ||
                new Date(startSlot.startTime) > new Date(currentEndTime)
            )
        })

        .map(res => {
            const startSlot = data.value.timeSlots[res.timeSlotStart]
            const endSlot = data.value.timeSlots[res.timeSlotEnd]
            return {
                id: res.id,
                approved: res.approved,
                authorName: res.authorName,
                description: res.description,
                slotRange: `${res.timeSlotStart}º ao ${res.timeSlotEnd}º horário`,
                startTime: startSlot?.startTime,
                endTime: endSlot?.endTime
            }
        })
})

</script>

<template>
    <Navbar />
    <div class="loading" v-if="!data">Aguarde...</div>
    <div class="wrapper" v-if="data">
        <section id="lab-info">

            <div class="heading">
                <h1 class="lab-title">{{ data.name }}</h1>
                <h3 class="lab-category">{{ data.category }}</h3>
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
                            <h2 class="card-title">{{ currentReservation.reservationInfo.currentSlotNumber }}º horário
                            </h2>
                            <h3 class="card-text-bottom">{{ currentReservation.reservationInfo.nextEndTime }}</h3>
                        </div>
                    </div>
                    <div class="next-reservation-section">

                        <div class="next-reservation-card" v-for="slot in nextReservationsList" :key="slot.id">
                            <div class="top">
                                <div class="reservation-range">
                                    <alarm-clock size="16" color="#64748B" />
                                    <h3 class="next-card-text-top">{{ slot.slotRange }}</h3>
                                </div>
                                <h3 class="ticket-status">{{ slot.approved ? "Aprovada" : "Em análise" }}</h3>
                            </div>
                            <h2 class="next-card-title">{{ slot.authorName }}
                            </h2>
                            <h3 class="next-card-text-bottom"> {{ slot.description }}</h3>
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
                    <button class="btn-primary">Reservar esse laboratório</button>
                </div>
                <div class="info-cards">
                    <div class="info-card">
                        <div class="top">Capacidade
                            <computer size="16" />
                        </div>
                        <h2>{{ data.capacity }} alunos</h2>
                    </div>
                    <div class="info-card">
                        <div class="top">Localização
                            <building size="16" />
                        </div>
                        <h2>{{ data.local }} </h2>
                    </div>
                    <div class="info-card">
                        <div class="top">Estado
                            <signal size="16" />
                        </div>
                        <h2>{{ data.maintenance ? "Manutenção" : "Aberto" }} </h2>
                    </div>
                </div>

            </div>

        </section>

        <section id="last-tickets">
            <div class="header">
                <div class="header-text">
                    <h2 class="section-title">Chamados</h2>
                    <h3 class="section-subtitle">Últimos chamados do laboratório</h3>
                </div>
                <PlusCircle size="24" />
            </div>

            <div class="card-list">
                <TicketCardList />
            </div>
        </section>

        <section id="comments">
            <div class="header"></div>
            <div class="comments-list"></div>
            <div class="comment-form"></div>
        </section>

    </div>

</template>

<style scoped>
.wrapper {
    max-width: 1200px;
    margin: 2.5rem auto;
    box-sizing: content-box;
    padding: 0 1rem;
}

section {
    margin-bottom: 10px;
    padding: 10px 0;
}

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

.header {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    padding: 0 40px 0 0;
}

.section-title {
    margin-bottom: 6px;
}

.section-subtitle {
    font-size: var(--font-size-lg);
    font-weight: 400;
    color: hsl(215, 19%, 35%);
}
</style>
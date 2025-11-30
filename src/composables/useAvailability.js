export function useAvailability(timeSlots) {

    const DAY_START = '07:45'
    const DAY_END = '22:00'

    const calculateAvailability = () => {
        const brazilNow = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
        const today = brazilNow.toISOString().split('T')[0];

        const reservationSlots = timeSlots.value.map(slot => ({
            ...slot,
            startTime: new Date(`${today}T${slot.startTime}:00`),
            endTime: new Date(`${today}T${slot.endTime}:00`),
        }))
        
        const dayStart = new Date(`${today}T${DAY_START}:00`);
        const dayEnd = new Date(`${today}T${DAY_END}:00`);

        if (brazilNow < new Date(dayStart) || brazilNow > new Date(dayEnd)) {
            return { status: 'Indisponível neste horário', until: null }
        }

        const occupiedReservations = reservationSlots.filter((timeSlot) => timeSlot.reserved === true)
        const vacantReservations = reservationSlots.filter((timeSlot) => timeSlot.reserved === false)

        if (!occupiedReservations || occupiedReservations.length === 0) {
            return { status: 'Livre pelo resto do dia', until: null }
        }

        if (!vacantReservations || vacantReservations.length === 0) {
            return { status: 'Ocupado pelo resto do dia', until: null }
        }

        const currentTimeSlot = reservationSlots.find((slot) => brazilNow >= slot.startTime && brazilNow <= slot.endTime)

        if (!currentTimeSlot) {
            return { status: 'Intervalo', until: null }
        }

        if (!currentTimeSlot.reserved) {
            const nextReservedSlot = occupiedReservations.find((slot) => slot.startTime > currentTimeSlot.endTime)
            return { status: 'Livre', until: nextReservedSlot?.startTime || null  }
        }

        const nextAvailableSlot = vacantReservations.find((slot) => slot.startTime > currentTimeSlot.endTime)

        if (!nextAvailableSlot) {
            return { status: 'Ocupado pelo resto do dia', until: null }
        }

        const slotBeforeNextAvailable = reservationSlots[reservationSlots.indexOf(nextAvailableSlot) - 1]

        return { status: 'Ocupado', until: slotBeforeNextAvailable.endTime }

    }

    return { calculateAvailability }
}
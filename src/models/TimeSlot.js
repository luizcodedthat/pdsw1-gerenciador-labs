
export function createTimeSlot({
    id,
    startTime,
    endTime,
    reserved = false,
    reservationId,
    authorId
}) {
    return {
        id,
        startTime,
        endTime,
        reserved,
        reservationId,
        authorId
    }
}

export function validateTimeSlot(timeSlot) {
    if (!timeSlot.startTime) throw new Error("TimeSlot precisa de uma hora de início.");
    if (!timeSlot.endTime) throw new Error("TimeSlot precisa de uma hora de fim.");
    if (!timeSlot.reservationId) throw new Error("TimeSlot precisa do id da reserva.")
    if (!timeSlot.authorId) throw new Error("TimeSlot precisa do id do autor.");
    return true
}

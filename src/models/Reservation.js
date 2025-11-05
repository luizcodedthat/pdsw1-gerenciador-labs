
export function createReservation({
  id = null,
  labId,
  approved,
  authorId,
  timeSlotStart,
  timeSlotEnd,
  date,
  description = null

}) {
  return {
    id,
    labId,
    approved,
    authorId,
    timeSlotStart,
    timeSlotEnd,
    date,
    description
  }
}

export function validateReservation(reservation) {
  if (!reservation.labId) throw new Error('A reserva precisa ter um laboratório.')
  if (!reservation.authorId) throw new Error('A reserva precisa ter um autor.')
  if (!reservation.date) throw new Error('A reserva precisa ter uma data.')
  if (!reservation.startTime || !reservation.endTime)
    throw new Error('Horários de início e fim são obrigatórios.')
  if (reservation.startTime >= reservation.endTime)
    throw new Error('O horário inicial deve ser menor que o final.')
  return true
}

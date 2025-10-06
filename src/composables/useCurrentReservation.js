import { ref } from 'vue'

export function useCurrentReservation(labInfo) {
  const currentReservation = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function getCurrentReservation() {
    if (!labInfo.value || !labInfo.value.timeSlots) return

    loading.value = true
    error.value = null

    try {
      const brazilNow = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
      const currentSlot = labInfo.value.timeSlots.find(
        slot => brazilNow >= new Date(slot.startTime) && brazilNow <= new Date(slot.endTime)
      )

      if (!currentSlot || !currentSlot.reserved) {
        currentReservation.value = null
        return
      }

      const response = await fetch(`http://localhost:3000/reservas?id=${currentSlot.reservationId}`)
      const [reservation] = await response.json()

      const endingSlot = labInfo.value.timeSlots[reservation.timeSlotEnd]

      currentReservation.value = {
        authorName: endingSlot.authorName,
        description: reservation.description,
        reservationInfo: {
            currentEndTime: currentReservation.value.endTime,
          nextEndTime: endingSlot.endTime,
          currentSlotNumber: labInfo.value.timeSlots.indexOf(endingSlot) + 1
        }
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { currentReservation, getCurrentReservation, loading, error }
}
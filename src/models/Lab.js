
export function createLab({
    id = null,
    name,
    category = "Laboratório de Informática",
    capacity,
    local,
    maintenance = false,
    timeSlots
}) {
    return {
        id,
        name,
        category,
        capacity,
        local,
        maintenance,
        timeSlots
    }
}

export function validateLab(lab) {
    if (!lab.category) throw new Error("O laboratório precisa de uma categoria.");
    if (!lab.capacity) throw new Error("O laboratório precisa da capacidade.")
    if (lab.timeSlots.lenght != 16) throw new Error("São necessários 16 slots de reserva.");
    return true
}

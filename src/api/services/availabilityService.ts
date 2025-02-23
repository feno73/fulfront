import api from '../axios'

export interface Availability {
    date: string
    time: string
    available: boolean
}

export const availabilityService = {
    // Obtener disponibilidad de la semana
    getWeekAvailability: async (startDate: string) => {
        try {
            const response = await api.get<Availability[]>('/v1/disponibilidad', {
                params: { startDate }
            })
            console.log(startDate)
            console.log(response.data)
            return response.data
        } catch (error) {
            throw error
        }
    },

    createReservation: async (data: object) => {
        try {
            console.log("Data:", data)
            const response = await api.post('/v1/reservas', {
                usuarioId: data.usuario,
                canchaId: data.cancha,
                fecha: data.fecha
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
}
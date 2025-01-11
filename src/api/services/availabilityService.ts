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

    // TODO: Crear una nueva reserva
    createReservation: async (date: string, time: string) => {
        try {
            const response = await api.post('/reservations', {
                date,
                time
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
}
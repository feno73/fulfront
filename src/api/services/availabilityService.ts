import api from '../axios'

export interface Availability {
    date: string
    time: string
    available: boolean
}
export interface ReservationFormData {
  usuario: number
  cancha: number
  fecha: string
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

    // Crear una reserva
    createReservation: async (data: ReservationFormData) => {
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
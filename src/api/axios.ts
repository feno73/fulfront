import axios from 'axios'

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // ajusta según tu backend
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para manejar tokens de autorización
/*api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)*/

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Manejar errores específicos
            switch (error.response.status) {
                case 401:
                    // Manejar no autorizado
                    localStorage.removeItem('token')
                    // Aquí podrías redirigir al login
                    break
                case 403:
                    // Manejar acceso prohibido
                    break
                case 404:
                    // Manejar no encontrado
                    break
                default:
                    // Manejar otros errores
                    break
            }
        }
        return Promise.reject(error)
    }
)

export default api
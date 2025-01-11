// AvailabilityTable.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { availabilityService } from '../api/services/availabilityService.ts'


const router = useRouter()

interface Availability {
  date: string;
  time: string;
  available: boolean;
}

// Estados
const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00'
]
const availabilityData = ref<Availability[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const currentWeek = ref(new Date())

// Obtener la fecha de inicio de la semana actual
const getWeekStartDate = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

// Formatear fecha para la API
const formatDateForAPI = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Obtener disponibilidad de la semana
const fetchWeekAvailability = async () => {
  isLoading.value = true
  error.value = null

  try {
    const startDate = formatDateForAPI(getWeekStartDate(currentWeek.value))
    const data = await availabilityService.getWeekAvailability(startDate)
    availabilityData.value = data.data
    console.log(availabilityData.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar la disponibilidad'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Navegar a la semana anterior
const previousWeek = () => {
  const newDate = new Date(currentWeek.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeek.value = newDate
  fetchWeekAvailability()
}

// Navegar a la semana siguiente
const nextWeek = () => {
  const newDate = new Date(currentWeek.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeek.value = newDate
  fetchWeekAvailability()
}

// Verificar disponibilidad
const isAvailable = (day: string, time: string) => {
  const date = getDayDate(day)
  console.log("Date:", date)
  console.log("Time:", time)
  console.log("Available:", availabilityData.value)
  return availabilityData.value.some(
      slot => slot.date === date &&
          slot.time === time &&
          slot.available
  )
}

// Obtener fecha para un día específico
const getDayDate = (day: string) => {
  const startDate = getWeekStartDate(currentWeek.value)
  const dayIndex = weekDays.indexOf(day)
  const date = new Date(startDate)
  date.setDate(date.getDate() + dayIndex)
  return formatDateForAPI(date)
}

// Manejar click en celda
const handleCellClick = (day: string, time: string) => {
  if (isAvailable(day, time)) {
    const date = getDayDate(day)
    const formattedTime = time.replace(':', '')
    router.push(`/reservation-form/${date}/${formattedTime}`)
  } else {
    alert('Este horario no está disponible')
  }
}

// Cargar datos iniciales
onMounted(() => {
  fetchWeekAvailability()
})
</script>

<template>
  <div class="p-6 bg-white rounded-xl shadow-lg">
    <!-- Título y navegación -->
    <div class="flex justify-between items-center mb-6">
      <button
          @click="previousWeek"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          :disabled="isLoading"
      >
        ← Semana anterior
      </button>

      <h2 class="text-2xl font-bold text-gray-800 text-center">
        {{ formatDateForAPI(getWeekStartDate(currentWeek)) }}
      </h2>

      <button
          @click="nextWeek"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          :disabled="isLoading"
      >
        Semana siguiente →
      </button>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Cargando disponibilidad...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button
          @click="fetchWeekAvailability"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reintentar
      </button>
    </div>

    <!-- Tabla de disponibilidad -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
        <tr>
          <th class="sticky left-0 bg-white border-b-2 border-gray-200 p-3 text-gray-600">
            Hora
          </th>
          <th
              v-for="day in weekDays"
              :key="day"
              class="border-b-2 border-gray-200 p-3 min-w-[120px] text-gray-600 font-semibold"
          >
            {{ day }}
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="time in timeSlots" :key="time" class="hover:bg-gray-50">
          <td class="sticky left-0 bg-white border-b border-gray-200 p-3 font-medium text-gray-700 text-center">
            {{ time }}
          </td>
          <td
              v-for="day in weekDays"
              :key="`${day}-${time}`"
              @click="handleCellClick(day, time)"
              class="border-b border-gray-200 p-3 text-sm transition-all duration-200"
              :class="[
                isAvailable(day, time)
                  ? 'bg-emerald-50 hover:bg-emerald-100 cursor-pointer text-emerald-700'
                  : 'bg-red-50 text-red-700'
              ]"
          >
            <div class="flex items-center justify-center gap-2">
                <span class="w-2 h-2 rounded-full"
                      :class="isAvailable(day, time) ? 'bg-emerald-500' : 'bg-red-500'">
                </span>
              {{ isAvailable(day, time) ? 'Disponible' : 'Ocupado' }}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
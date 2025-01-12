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
/*const formatDateForAPI = (date: Date) => {
  return date.toISOString().split('T')[0]
}*/

const formatDateForAPI = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

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
const hoveredIndex = ref(null);
const timeSlots = [
  { time: '09:00', status: 'disponible' },
  { time: '10:00', status: 'reservada' },
  { time: '11:00', status: 'reservada' },
  { time: '12:00', status: 'disponible' },
  { time: '13:00', status: 'disponible' },
  { time: '14:00', status: 'disponible' },
  { time: '15:00', status: 'disponible' },
  { time: '16:00', status: 'disponible' },
];
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
        < Día anterior
      </button>

      <h2 class="text-2xl font-bold text-gray-800 text-center">
        {{ formatDateForAPI(currentWeek) }}
      </h2>

      <button
          @click="nextWeek"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          :disabled="isLoading"
      >
        Día siguiente >
      </button>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Cargando disponibilidad...</p>
    </div>

    <div class="max-w-md mx-auto">
      <div class="grid grid-cols-2 gap-2">
        <!-- Time Column -->
        <div class="rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-4 font-medium text-gray-900 border-b">
            Hora
          </div>
          <div class="divide-y">
            <template v-for="(slot, index) in timeSlots" :key="index">
              <div
                  class="p-4 transition-colors duration-200"
                  :class="[
                slot.status === 'reservada'
                  ? 'bg-orange-500 text-white'
                  : {
                      'bg-sky-100': !hoveredIndex || hoveredIndex !== index,
                      'bg-sky-800 text-white': hoveredIndex === index
                    }
              ]"
              >
                {{ slot.time }}
              </div>
            </template>
          </div>
        </div>

        <!-- Status Column -->
        <div class="rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-4 font-medium text-gray-900 border-b">
            Estado
          </div>
          <div class="divide-y">
            <template v-for="(slot, index) in timeSlots" :key="index">
              <div
                  class="p-4 transition-colors duration-200 cursor-pointer"
                  :class="[
                slot.status === 'reservada'
                  ? 'bg-orange-500 text-white cursor-default'
                  : {
                      'bg-sky-100': !hoveredIndex || hoveredIndex !== index,
                      'bg-sky-800 text-white': hoveredIndex === index,
                    }
              ]"
                  @mouseenter="hoveredIndex = index"
                  @mouseleave="hoveredIndex = null"
              >
                {{ slot.status === 'reservada' ? 'Reservada' : 'Disponible' }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
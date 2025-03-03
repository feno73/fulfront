<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { availabilityService, ReservationFormData } from '../api/services/availabilityService.ts'
import ReservationModal from './ReservationModal.vue'
import { Availability } from "../interfaces/IAvailability.ts"

// Datos de disponibilidad y estados
const availabilityData = ref<Availability[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedDate = ref(new Date())

interface Props {
  isLoggedIn: boolean
}

const props = defineProps<Props>()

// Función para formatear la fecha al formato requerido por la API
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Filtrar la disponibilidad para la fecha seleccionada
const availabilityForSelectedDate = computed(() => {
  const selectedDay = formatDateForAPI(selectedDate.value)
  return availabilityData.value.filter(slot => slot.day === selectedDay)
})

// Consultar la disponibilidad para la fecha seleccionada
const fetchAvailability = async () => {
  isLoading.value = true
  error.value = null

  try {
    const formattedDate = formatDateForAPI(selectedDate.value)
    console.log("FECHA:", selectedDate.value)
    const data = await availabilityService.getWeekAvailability(formattedDate)
    availabilityData.value = data.data
    console.log("Disponibilidad:", availabilityData.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar la disponibilidad'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Manejar el cambio del datepicker
const onDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value) {
    const [year, month, day] = target.value.split('-').map(Number)
    selectedDate.value = new Date(year, month - 1, day)
    fetchAvailability()
  }
}

// Variables para controlar el modal de reserva
const showModal = ref(false)
const selectedTime = ref('')

// Función que abre el modal (si el slot está disponible)
const openReservationModal = (slot: Availability) => {
  if (slot.available) {
    selectedTime.value = slot.time
    showModal.value = true
  }
}

// Función para manejar el clic en un horario disponible
const handleSlotClick = (slot: Availability) => {
  if (props.isLoggedIn) {
    openReservationModal(slot)
  } else {
    // Si el usuario no está logueado, se muestra solo la información
    // Aquí podrías redirigir al login o mostrar un mensaje personalizado
    alert("Debes iniciar sesión para hacer una reserva.")
  }
}

// Función para cerrar el modal y recargar la disponibilidad
const closeModalAndRefetch = () => {
  showModal.value = false
  fetchAvailability()
}

// Función para manejar el submit del modal
const handleReservationSubmit = (payload: ReservationFormData) => {
  console.log("Reserva realizada:", payload)
  // Aquí se enviaría la reserva a la API
}

// Cargar la disponibilidad al montar el componente
onMounted(() => {
  fetchAvailability()
})
</script>

<template>
  <div class="p-6 bg-white rounded-xl shadow-lg">
    <!-- Datepicker para seleccionar la fecha -->
    <div class="mb-4">
      <label for="datePicker" class="block mb-2 font-bold text-gray-700">
        Selecciona una fecha:
      </label>
      <input
          id="datePicker"
          type="date"
          :value="formatDateForAPI(selectedDate)"
          @change="onDateChange"
          class="border rounded p-2"
      />
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Cargando disponibilidad...</p>
    </div>

    <!-- Mostrar disponibilidad -->
    <div v-if="!isLoading && !error">
      <h2 class="text-2xl font-bold mb-4">
        Disponibilidad para el {{ formatDateForAPI(selectedDate) }}
      </h2>
      <div v-if="availabilityForSelectedDate.length">
        <ul>
          <li
              v-for="(slot, index) in availabilityForSelectedDate"
              :key="index"
              @click="handleSlotClick(slot)"
              class="cursor-pointer hover:bg-gray-100 p-2 border-b"
          >
            {{ slot.time }} -
            <span :class="slot.available ? 'text-green-600' : 'text-red-600'">
              {{ slot.available ? 'Disponible' : 'No disponible' }}
            </span>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No hay disponibilidad para esta fecha.</p>
      </div>
    </div>

    <!-- Modal de Reserva (se activa solo si el usuario está logueado) -->
    <ReservationModal
        :visible="showModal"
        :selectedDate="formatDateForAPI(selectedDate)"
        :selectedTime="selectedTime"
        @close="closeModalAndRefetch"
        @submit="handleReservationSubmit"
    />
  </div>
</template>

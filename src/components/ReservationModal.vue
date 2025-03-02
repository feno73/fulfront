<template>
  <div
      v-if="visible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg w-96">
      <h2 class="text-xl font-bold mb-4">Realizar Reserva</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Usuario</label>
          <input
              type="text"
              v-model="formData.usuario"
              class="w-full border rounded p-2"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Cancha</label>
          <input
              type="text"
              v-model="formData.cancha"
              class="w-full border rounded p-2"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Fecha y Hora</label>
          <input
              type="text"
              v-model="formData.fecha"
              class="w-full border rounded p-2"
              disabled
          />
        </div>
        <div class="flex justify-end">
          <button
              type="button"
              @click="closeModal"
              class="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Reservar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { availabilityService, ReservationFormData } from "../api/services/availabilityService.ts"

const props = defineProps<{
  visible: boolean
  selectedDate: string
  selectedTime: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: ReservationFormData): void
}>()

const formData = ref<ReservationFormData>({
  usuario: 1,
  cancha: 1,
  fecha: `${props.selectedDate} ${props.selectedTime}`,
})

// Si cambian la fecha o la hora, actualizamos el campo fecha en el formulario
watch(
    () => [props.selectedDate, props.selectedTime],
    ([newDate, newTime]) => {
      formData.value.fecha = `${newDate}T${newTime}:00Z`
    }
)

const closeModal = () => {
  emits('close')

}

const handleSubmit = async () => {
  try {
    const res = await availabilityService.createReservation({
      usuario: formData.value.usuario,
      cancha: formData.value.cancha,
      fecha: formData.value.fecha
    });
    emits('submit', res)
    console.log("Respuesta de reserva:", res);
    closeModal()
  } catch (error) {
    console.error("Error during the reservation:", error);
  }
}
</script>

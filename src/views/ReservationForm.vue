<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MercadoPago from '@mercadopago/sdk-js'

const route = useRoute()
const date = route.params.date
const time = route.params.time

const form = ref({
  name: '',
  email: '',
  phone: ''
})

const showSuccessDialog = ref(false)

const initMercadoPago = async () => {
  try {
    await MercadoPago.init({
      publicKey: 'TEST-123456789-123456-123456'
    })
  } catch (error) {
    console.error('Error initializing MercadoPago:', error)
  }
}

onMounted(() => {
  initMercadoPago()
})

const handleSubmit = async () => {
  // Here you would:
  // 1. Validate the form
  // 2. Create a payment preference
  // 3. Process the payment
  // 4. Show success dialog
  showSuccessDialog.value = true
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-bold mb-6">Complete Your Reservation</h2>
    <p class="mb-4">Booking for: {{ date }} at {{ time }}</p>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          v-model="form.name"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          v-model="form.email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          v-model="form.phone"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div id="payment-form"></div>
      
      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Complete Reservation
      </button>
    </form>

    <!-- Success Dialog -->
    <div v-if="showSuccessDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Reservation Confirmed!</h3>
        <p class="text-sm text-gray-500">Your reservation has been successfully processed.</p>
        <div class="mt-4">
          <router-link
            to="/reservations"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Reservations
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
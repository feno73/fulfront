<template>
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-4">Reservas</h1>
    <p>Aquí se muestran las reservas.</p>
    <Calendar :isLoggedIn=true />
  </div>
</template>

<script setup lang="ts">
import Calendar from '../../components/Calendar.vue'
</script>

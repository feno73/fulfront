<script setup lang="ts">
import Calendar from '../components/Calendar.vue'
import NavBar from '../components/Navbar.vue'
</script>

<template>
  <NavBar />
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-bold text-center mb-8">Reservas</h1>
    <Calendar :isLoggedIn=false />
  </div>
</template>
<script setup lang="ts">
interface User {
  name: string
  avatar: string
}



const props = defineProps<{ user: User }>()
</script>

<template>
  <nav class="bg-gray-800 text-white  flex items-center justify-between p-5">
    <p class="text-2xl font-bold">Fulbito Admin</p>
    <div class="flex items-center">
      <!-- Muestra el avatar y el nombre del usuario -->
      <img :src="user.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-2" />
      <span>{{ user.name }}</span>
    </div>
  </nav>
</template>
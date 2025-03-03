<template>
  <div id="app" class="flex flex-col h-screen">
    <!-- Navbar con info del usuario -->
    <Navbar :user="user" />

    <!-- Contenedor principal con Sidebar y contenido -->
    <div class="flex flex-1">
      <!-- Menú lateral -->
      <SideBar />

      <!-- Contenido principal de cada sección -->
      <main class="flex-1 p-5">
        <!-- Aquí se renderiza el componente de la ruta actual -->
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Navbar from "../components/Dashboard/Navbar.vue";
  import SideBar from "../components/Dashboard/SideBar.vue";

  const user = {
    name: 'Juan Pérez',
    avatar: 'ruta/a/avatar.png'
  }
</script>

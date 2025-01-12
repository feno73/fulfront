<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

body {
  font-family: "Ubuntu", serif;
}

</style>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <template v-if="false">
    <RouterLink to="/">Home</RouterLink> | <RouterLink to="/login">Login</RouterLink> |
    <RouterLink to="/signup">Signup</RouterLink> |
    <RouterLink to="/todolist">Todolist</RouterLink> |
  </template>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <RouterLink to="/">Home</RouterLink> | <RouterLink to="/about">About</RouterLink> |
  <RouterLink to="/TodoList">TodoList</RouterLink> |
  <RouterView />
</template>

<script setup>
const props = defineProps({
  name: String,
  description: String,
  price: Number
})

const emits = defineEmits(['add-to-cart'])
const addToCart = () => {
  emits('add-to-cart', { props })
}
</script>
<template>
  <a
    href="#"
    class="list-group-item list-group-item-action"
    v-on:click="addToCart()">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{ props.name }}</h5>
      <small>${{ props.price }}</small>
    </div>
    <p class="mb-1">{{ props.description }}</p>
  </a>
</template>

<script setup>
const props = defineProps({
  name: String,
  quantity: Number,
  price: Number
}) // Define
</script>
<template>
  <td>{{ props.name }}</td>
  <td>{{ props.quantity }}</td>
  <td>{{ props.quantity * props.price }}</td>
</template>

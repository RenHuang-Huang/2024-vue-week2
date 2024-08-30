<script setup>
import { computed, onUpdated } from 'vue'

const props = defineProps({
  id: Number,
  name: String,
  description: String,
  price: Number,
  quantity: Number
})

const emits = defineEmits(['delete-item', 'update-quantity'])
const deleteItem = (id) => {
  emits('delete-item', props)
}
const updateQuantity = (event) => {
  emits('update-quantity', props, Number(event.target.value))
}
</script>

<template>
  <td>
    <button type="button" class="btn btn-sm" v-on:click="deleteItem(props.id)">X</button>
  </td>
  <td>{{ props.name }}</td>
  <td>
    <small>{{ props.description }}</small>
  </td>
  <td>
    <select class="form-select" :value="props.quantity" v-on:change.prevent="updateQuantity">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </td>
  <td>{{ props.price }}</td>
  <td>
    {{ props.price * props.quantity }}
  </td>
</template>

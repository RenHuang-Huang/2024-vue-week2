<script setup>
import { defineProps, defineEmits } from 'vue'
const emits = defineEmits(['delete-todo', 'completed-todo'])
const props = defineProps({
  content: String,
  status: Boolean,
  id: String
})
const deleteTodo = (id) => {
  emits('delete-todo', id)
}
const completedTodo = (id) => {
  emits('completed-todo', id)
}
</script>

<template>
  <li>
    <label class="todoList_label">
      <input
        class="todoList_input"
        type="checkbox"
        v-bind:checked="status"
        v-on:change="completedTodo(id)" />
      <span>{{ content }}</span>
    </label>
    <a v-on:click="deleteTodo(id)" style="height: 42px">
      <i class="fa fa-times">
        <button class="deleteBtn">X</button>
      </i>
    </a>
  </li>
</template>

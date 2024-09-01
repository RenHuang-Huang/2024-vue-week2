import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useStatusStore = defineStore('status', () => {
  const currentPage = ref('Hello')
  const todos = ref([])
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => count.value++
  return {
    currentPage,
    count,
    doubleCount,
    increment
  }
})

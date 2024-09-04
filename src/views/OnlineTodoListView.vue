<script setup>
import axios from 'axios'
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TodoList from '@/components/TodoList.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import showAlert from '@/utils/showAlert'

const isLoading = ref(false)
const apiUrl = 'https://todolist-api.hexschool.io'
const router = useRouter()
let todolistToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)todolistToken\s*\=\s*([^;]*).*$)|^.*$/,
  '$1'
)
const intervalID = ref('')
onMounted(() => {
  if (!todolistToken) {
    showAlert('錯誤', '請先登入', 'error', '確認')
    router.push({ path: '/login' })
  } else {
    axios.defaults.headers.common['Authorization'] = todolistToken
    checkout()
    getTodos()
    intervalID.value = setInterval(() => {
      checkout()
    }, 60000)
  }
})
onUnmounted(() => {
  clearInterval(intervalID.value)
})

//驗證
const userName = ref('貴賓')
const checkout = async () => {
  try {
    axios.defaults.headers.common['Authorization'] = document.cookie.replace(
      /(?:(?:^|.*;\s*)todolistToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    await axios.get(`${apiUrl}/users/checkout`).then((res) => {
      if (res.data.nickname.trim() !== '') {
        userName.value = res.data.nickname
      }
    })
  } catch (error) {
    console.log(error.response)
    if (axios.defaults.headers.common['Authorization'] === '') {
      showAlert('錯誤', 'Token遺失 請重新登入', 'error', '確認')
      router.push({ path: '/login' })
    } else {
      showAlert('錯誤', error.response?.data.message, 'error', '確認')
      router.push({ path: '/login' })
    }
  }
}

//登出
const logout = async () => {
  try {
    isLoading.value = true
    await axios.post(`${apiUrl}/users/sign_out`, {}).then((res) => {
      showAlert('成功', res.data.message, 'success', '確認')
      document.cookie = 'todolistToken=;Max-Age=-1;'
      router.push({ path: '/login' })
    })
  } catch (error) {
    showAlert('錯誤', error.response.data.message, 'error', '確認')
  } finally {
    isLoading.value = false
  }
}

//取得Todo List
const todos = ref([])
const getTodos = async () => {
  try {
    isLoading.value = true
    await axios.get(`${apiUrl}/todos`).then((res) => {
      todos.value = res.data.data
    })
  } catch (error) {
    showAlert('錯誤', error.response.data.message, 'error', '確認')
  } finally {
    isLoading.value = false
  }
}

// 新增待辦
const newTodo = ref('')
const addTodo = async () => {
  if (!newTodo.value.trim()) {
    newTodo.value = ''
    return showAlert('錯誤', '請輸入待辦事項', 'error', '確認')
  }
  try {
    await axios
      .post(`${apiUrl}/todos`, { content: newTodo.value })
      .then((res) => {
        newTodo.value = ''
        todos.value.push(res.data.newTodo)
      })
  } catch (error) {
    showAlert('錯誤', error.response.data.message, 'error', '確認')
  }
}

// 刪除待辦
const handelDeleteTodo = async (id) => {
  try {
    await axios.delete(`${apiUrl}/todos/${id}`).then((res) => {
      if (res.data.status) {
        todos.value = todos.value.filter((todo) => todo.id !== id)
      }
    })
  } catch (error) {
    showAlert('錯誤', error.response.data.message, 'error', '確認')
  }
}

// 完成待辦
const handelCompletedTodo = async (id) => {
  try {
    await axios.patch(`${apiUrl}/todos/${id}/toggle`, {}).then((res) => {
      if (res.data?.status) {
        todos.value.filter((todo) => {
          if (todo.id === id) {
            todo.status = !todo.status
          }
        })
      }
    })
  } catch (error) {
    showAlert('錯誤', error.response.data.message, 'error', '確認')
  }
}
const calPendingCount = computed(() => {
  return todos.value.filter((todo) => todo.status === false).length
})

// 切換分類
const currentTab = ref('all')

const filteredTodos = computed(() => {
  if (currentTab.value === 'completed') {
    return todos.value.filter((todo) => todo.status)
  } else if (currentTab.value === 'pending') {
    return todos.value.filter((todo) => !todo.status)
  } else {
    return todos.value
  }
})
</script>
<template>
  <loading v-model:active="isLoading" :is-full-page="true"></loading>
  <!-- ToDo List -->
  <div id="todoListPage" class="bg-half">
    <nav>
      <a style="width: 45%">
        <img
          class="logoImg"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
          alt="" />
      </a>
      <ul>
        <li class="todo_sm">
          <a>
            <span>{{ userName ? userName : '貴賓' }}的代辦</span>
          </a>
        </li>
        <li><a v-on:click.prevent="logout" style="cursor: pointer">登出</a></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodo" />
          <a v-on:click="addTodo" style="cursor: pointer">
            <i class="fa fa-plus">+</i>
          </a>
        </div>
        <div class="todoList_empty" v-if="todos.length === 0">
          <p>目前尚無待辦事項</p>
          <img
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/empty%201.png"
            alt=""
            style="width: 80%" />
        </div>
        <div class="todoList_list" v-if="todos.length !== 0">
          <ul class="todoList_tab">
            <li>
              <a
                v-bind:class="{ active: currentTab === 'all' }"
                v-on:click="currentTab = 'all'"
                >全部</a
              >
            </li>
            <li>
              <a
                v-bind:class="{ active: currentTab === 'pending' }"
                v-on:click="currentTab = 'pending'"
                >待完成</a
              >
            </li>
            <li>
              <a
                v-bind:class="{ active: currentTab === 'completed' }"
                v-on:click="currentTab = 'completed'"
                >已完成</a
              >
            </li>
          </ul>
          <div class="todoList_items">
            <ul
              class="todoList_item"
              v-for="todo in filteredTodos"
              v-bind:key="todo.id">
              <!-- todo -->
              <TodoList
                v-bind:content="todo.content"
                v-bind:status="todo.status"
                v-bind:id="todo.id"
                v-on:delete-todo="handelDeleteTodo"
                v-on:completed-todo="handelCompletedTodo" />
            </ul>

            <div class="todoList_statistics">
              <p>{{ calPendingCount }} 個待完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.todoList_empty {
  text-align: center;
}
.deleteBtn {
  background: none;
  border: none;
  cursor: pointer;
}
.todoList_tab {
  cursor: pointer;
}
</style>

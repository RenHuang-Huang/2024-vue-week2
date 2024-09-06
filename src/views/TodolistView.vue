<template>
  <!-- 註冊 -->
  <template v-if="pageRegestStatus">
    <div class="page">
      <h2>註冊</h2>
      <label for="Email">信箱：</label>
      <input
        type="email"
        name="Email"
        placeholder="Email"
        v-model="regestEmail" />
      <br />
      <label for="Password">密碼：</label>
      <input
        type="password"
        name="Password"
        placeholder="Password"
        v-model="regestPassword" />
      <br />
      <label for="Nickname">名稱：</label>
      <input
        type="text"
        name="Nickname"
        placeholder="Nickname"
        v-model="regestNickname" />
      <br />
      <button type="button" v-on:click="regest">註冊</button>
      <button type="button" v-on:click="switchPage">我要登入</button>
      <!-- Token：{{ regestToken }} -->
      <hr />
    </div>
  </template>

  <!-- 登入 -->
  <template v-if="pageLoginStatus">
    <div class="page">
      <h2>登入</h2>
      <label for="email">信箱：</label>
      <input
        type="text"
        name="email"
        placeholder="Email"
        v-model="loginEmail" />
      <br />
      <label for="password">密碼：</label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="loginPassword" />
      <br />
      <button type="button" v-on:click="login">登入</button>
      <button type="button" v-on:click="switchPage">我要註冊</button>
      <!-- Token:{{ loginToken }} -->
      <hr />
      <!-- 
      <h2>驗證</h2>
      <label for="token">驗證：</label>
      <input type="text" name="token" placeholder="Token" v-model="checkoutToken" />
      <button type="button" v-on:click="checkout">驗證</button>
      <br />
      <p v-if="loginStatus">{{ loginStatus }}</p>
      <hr />
  
      <h2>登出</h2>
      <label for="signout">登出：</label>
      <input type="text" name="signout" placeholder="Sign Out" v-model="signOutToken" />
      <button type="button" v-on:click="signOut">登出</button>
      <br />
      <p v-if="signOutStatus">{{ signOutStatus }}</p>
      <hr /> -->
    </div>
  </template>
  <!-- 待辦清單 -->
  <template v-if="pageTodoStatus">
    <div class="page">
      <h2>待辦清單</h2>
      <label for="newtodo">新增待辦：</label>
      <input
        type="text"
        name="newtodo"
        placeholder="New Todo"
        v-model="newTodo" />
      <button type="button" v-on:click="addTodo">Add Todo</button>
      <br />
      <h3>待辦事項：</h3>
      <ul>
        <li v-for="todo in todos" v-bind:key="todo.id">
          {{ todo.content }} | {{ todo.status ? '已完成' : '未完成' }}
          <input
            type="text"
            placeholder="New Name"
            @change="updateEdit($event, todo.id)" />
          <button type="button" v-on:click="onUpdated(todo.id)">更新</button>
          <button type="button" v-on:click="onDelected(todo.id)">刪除</button>
          <button type="button" v-on:click="onFinished(todo.id)">
            更新狀態
          </button>
        </li>
      </ul>
      <hr />
      <button type="button" v-on:click="signOut2" class="center">登出</button>
    </div>
  </template>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
const apiUrl = 'https://todolist-api.hexschool.io'

const regestEmail = ref('')
const regestPassword = ref('')
const regestNickname = ref('')
const regestToken = ref('')

const loginEmail = ref('')
const loginPassword = ref('')
const loginToken = ref('')
const todos = ref([])

const checkoutToken = ref('')
const loginStatus = ref('')

const signOutToken = ref('')
const signOutStatus = ref('')

const newTodo = ref('')

const pageLoginStatus = ref(true)
const pageRegestStatus = ref(false)
const pageTodoStatus = ref(false)
const regest = async () => {
  try {
    const res = await axios.post(`${apiUrl}/users/sign_up`, {
      email: regestEmail.value,
      password: regestPassword.value,
      nickname: regestNickname.value
    })
    console.log(res.data)
    alert('註冊成功')
    regestEmail.value = ''
    regestPassword.value = ''
    regestNickname.value = ''
    regestToken.value = res.data.uid
  } catch (error) {
    console.log(error)
  }
}

const login = async () => {
  try {
    const res = await axios.post(`${apiUrl}/users/sign_in`, {
      email: loginEmail.value,
      password: loginPassword.value
    })
    console.log(res.data)
    loginEmail.value = ''
    loginPassword.value = ''
    loginToken.value = res.data.token
    document.cookie = `todolistToken=${res.data.token}`
    getTodo()
    switchTodoPage()
  } catch (error) {
    console.log(error)
  }
}

const checkout = async () => {
  loginStatus.value = ''
  try {
    const config = {
      headers: {
        Authorization: checkoutToken.value
      }
    }

    const res = await axios.get(`${apiUrl}/users/checkout`, config)
    console.log(res.data)
    checkoutToken.value = ''
    loginStatus.value = `Token: ${res.data.uid}`
  } catch (error) {
    console.log(error)
    loginStatus.value = `驗證失敗： ${error.message}`
  }
}

const signOut = async () => {
  try {
    const config = {
      headers: {
        Authorization: signOutToken.value
      }
    }
    const res = await axios.post(`${apiUrl}/users/sign_out`, {}, config)
    signOutStatus.value = res.data.message
    console.log(res.data)
  } catch (error) {
    console.log(error)
    signOutStatus.value = error.response.data.message
  }
}

const signOut2 = async () => {
  try {
    const config = {
      headers: {
        Authorization: loginToken.value
      }
    }
    const res = await axios.post(`${apiUrl}/users/sign_out`, {}, config)
    signOutStatus.value = res.data.message
    console.log(res.data)
    pageTodoStatus.value = false
    pageLoginStatus.value = true
  } catch (error) {
    console.log(error)
    signOutStatus.value = error.response.data.message
  }
}
const addTodo = async () => {
  if (!newTodo.value) return alert('請輸入待辦事項')
  if (!loginToken.value) return alert('請先登入')
  try {
    const config = {
      headers: {
        Authorization: loginToken.value
      }
    }
    const res = await axios.post(
      `${apiUrl}/todos`,
      { content: newTodo.value },
      config
    )
    console.log(res.data)
    getTodo()
  } catch (error) {
    console.log(error)
  }
}

const getTodo = async () => {
  try {
    const config = {
      headers: {
        Authorization: loginToken.value
      }
    }
    const res = await axios.get(`${apiUrl}/todos`, config)
    console.log(res.data.data)
    todos.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

const tempValue = ref('')
const updateEdit = (event, id) => {
  tempValue.value = {
    id,
    content: event.target.value
  }
}

const onUpdated = async (id) => {
  if (tempValue.value.id !== id) return alert('請在同欄位輸入')
  try {
    const config = {
      headers: {
        Authorization: loginToken.value
      }
    }
    const res = await axios.put(
      `${apiUrl}/todos/${id}`,
      { content: tempValue.value.content },
      config
    )
    console.log(res.data)
    tempValue.value = ''
    getTodo()
  } catch (error) {
    console.log(error)
  }
}

const onDelected = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: loginToken.value
      }
    }
    const res = await axios.delete(`${apiUrl}/todos/${id}`, config)
    console.log(res.data)
    getTodo()
  } catch (error) {
    console.log(error)
  }
}

const onFinished = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: loginToken.value
      }
    }
    const res = await axios.patch(`${apiUrl}/todos/${id}/toggle`, {}, config)
    console.log(res.data)
    getTodo()
  } catch (error) {
    console.log(error)
  }
}

const myCookie = document.cookie.replace(
  /(?:(?:^|.*;\s*)todolistToken\s*\=\s*([^;]*).*$)|^.*$/,
  '$1'
)

const switchPage = () => {
  pageLoginStatus.value = !pageLoginStatus.value
  pageRegestStatus.value = !pageRegestStatus.value
}
const switchTodoPage = () => {
  pageLoginStatus.value = false
  pageRegestStatus.value = false
  pageTodoStatus.value = true
}
onMounted(() => {
  if (myCookie) {
    loginToken.value = myCookie
    switchTodoPage()
    getTodo()
  }
})
</script>

<style>
h2 {
  margin: 0;
  text-align: center;
}
.page {
  margin: 0 auto;
  width: 50%;
  background-color: aquamarine;
}
.center {
  display: block;
  margin: 0 auto;
}
</style>

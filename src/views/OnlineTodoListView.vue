<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TodoList from '@/components/TodoList.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
const isLoading = ref(false)

const apiUrl = 'https://todolist-api.hexschool.io'
const router = useRouter()
const todolistToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)todolistToken\s*\=\s*([^;]*).*$)|^.*$/,
  '$1'
)

onMounted(() => {
  if (!todolistToken) {
    alert('請先登入')
    router.push({ path: '/login' })
  } else {
    axios.defaults.headers.common['Authorization'] = todolistToken
    checkout()
    getTodo()
  }
})

//驗證
const userName = ref('貴賓')
const checkout = async () => {
  try {
    await axios.get(`${apiUrl}/users/checkout`).then((res) => {
      if (res.data.nickname.trim() === '') {
        userName.value = '貴賓'
      } else {
        userName.value = res.data.nickname
      }
    })
  } catch (error) {
    alert(`驗證失敗： ${error.message}`)
  }
}

//登出
const logout = async () => {
  isLoading.value = true
  try {
    await axios.post(`${apiUrl}/users/sign_out`, {}).then((res) => {
      alert(res.data.message)
      document.cookie = 'todolistToken=;Max-Age=-1;'
      router.push({ path: '/login' })
    })
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

//取得Todo List
const todos = ref([])
const needTodoCount = ref([])
const getTodo = async () => {
  isLoading.value = true
  console.log('todolistToken')
  try {
    await axios.get(`${apiUrl}/todos`).then((res) => {
      todos.value = res.data.data
      setTab(currentTab.value)
      needTodoCount.value = res.data.data.filter((todo) => todo.status === false).length
    })
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

// 新增待辦
const newTodo = ref('')
const addTodo = async () => {
  const token = todolistToken
  if (!newTodo.value.trim()) return alert('請輸入待辦事項')
  if (!token) return alert('請先登入')
  try {
    await axios.post(`${apiUrl}/todos`, { content: newTodo.value }).then((res) => {
      newTodo.value = ''
      getTodo()
    })
  } catch (error) {}
}

// 刪除待辦
const handelDeleteTodo = async (id) => {
  try {
    await axios.delete(`${apiUrl}/todos/${id}`).then((res) => {
      getTodo()
    })
  } catch (error) {
    alert(`刪除失敗 ${error.response.data.message}`)
  }
}

// 完成待辦
const handelFinishedTodo = async (id) => {
  needTodoCount.value = todos.value.filter((todo) => todo.status === false).length
  try {
    await axios.patch(`${apiUrl}/todos/${id}/toggle`, {}).then((res) => {
      getTodo()
    })
  } catch (error) {}
}

// 切換分類
const currentTab = ref('all')
const tmpTodos = ref([])
const setTab = (tab) => {
  currentTab.value = tab
  if (tab === 'all') {
    tmpTodos.value = todos.value
  } else if (tab === 'pending') {
    tmpTodos.value = todos.value.filter((todo) => todo.status === false)
  } else if (tab === 'completed') {
    tmpTodos.value = todos.value.filter((todo) => todo.status === true)
  }
}
</script>
<template>
  <loading :active.sync="isLoading" :is-full-page="true"></loading>
  <!-- ToDo List -->
  <div id="todoListPage" class="bg-half">
    <nav>
      <!-- <h1><a href="#">ONLINE TODO LIST</a></h1> -->
      <a
        ><img
          class="logoImg"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
          alt=""
          style="width: 45%"
      /></a>
      <ul>
        <li class="todo_sm">
          <a
            ><span>{{ userName ? userName : '貴賓' }}的代辦</span></a
          >
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
            style="width: 80%"
          />
        </div>
        <div class="todoList_list" v-if="todos.length !== 0">
          <ul class="todoList_tab">
            <li>
              <a v-bind:class="{ active: currentTab === 'all' }" v-on:click="setTab('all')">全部</a>
            </li>
            <li>
              <a v-bind:class="{ active: currentTab === 'pending' }" v-on:click="setTab('pending')"
                >待完成</a
              >
            </li>
            <li>
              <a
                v-bind:class="{ active: currentTab === 'completed' }"
                v-on:click="setTab('completed')"
                >已完成</a
              >
            </li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item" v-for="todo in tmpTodos" v-bind:key="todo.id">
              <!-- todo -->
              <TodoList
                v-bind:content="todo.content"
                v-bind:status="todo.status"
                v-bind:id="todo.id"
                v-on:delete-todo="handelDeleteTodo"
                v-on:finished-todo="handelFinishedTodo"
              />
            </ul>
            <div class="todoList_statistics">
              <p>{{ needTodoCount }} 個待完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap');
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

body {
  line-height: 1;
}

ol,
ul {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

*,
*::before,
*::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.selector-for-some-widget {
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

html {
  height: 100%;
}

body {
  font-family: 'Noto Sans TC';
  margin: 0 auto;
  overflow: hidden;
}

img {
  width: 100%;
  vertical-align: middle;
}

.logoImg {
  margin-bottom: 16px;
}

.vhContainer {
  height: 100vh;
}

.bg-yellow {
  background-color: #ffd370;
}

.bg-half {
  background-image: linear-gradient(175deg, #ffd370 60%, #fff 40%);
}

.conatiner {
  margin: 0 auto;
  padding: 87px 32px;
}

@media (max-width: 576px) {
  .conatiner {
    padding: 18px 32px;
  }
}

.side {
  width: 386px;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

@media (max-width: 576px) {
  .side {
    width: 100%;
  }
}

nav {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 24px 32px 0 32px;
}

@media (max-width: 576px) {
  nav {
    margin-bottom: 16px;
  }
}

nav h1 a {
  width: 243px;
  height: 39px;
  background: url(https://upload.cc/i1/2022/03/23/8vTzYG.png) no-repeat;
  display: block;
  text-indent: 101%;
  overflow: hidden;
  white-space: nowrap;
}

nav ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 1rem;
}

@media (max-width: 576px) {
  nav ul li {
    margin-top: 11px;
  }
}

nav ul a {
  text-decoration: none;
  color: #333333;
  margin-left: 24px;
}

@media (max-width: 576px) {
  nav ul a {
    margin-left: 0;
  }
}

nav ul a:hover {
  color: #d87355;
}

nav ul a span {
  font-weight: bold;
}

@media (max-width: 576px) {
  nav ul .todo_sm {
    display: none;
  }
}

@media (max-width: 576px) {
  .d-m-n {
    display: none;
  }
}

.formControls {
  margin-left: 100px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

@media (max-width: 576px) {
  .formControls {
    margin-left: 0;
  }
}

.formControls .formControls_txt {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
}

@media (max-width: 576px) {
  .formControls .formControls_txt {
    font-size: 1.25rem;
    text-align: center;
  }
}

.formControls .formControls_label {
  font-size: 0.875rem;
  font-weight: bold;
  margin: 16px 0 4px 0;
}

.formControls .formControls_input {
  font-weight: normal;
  border: none;
  border-radius: 10px;
  width: 304px;
  padding: 12px 16px;
  margin: 4px 0;
}

.formControls .formControls_input:focus {
  outline: 3px solid #fff;
}

.formControls .formControls_input::-webkit-input-placeholder {
  color: #9f9a91;
}

.formControls .formControls_input:-ms-input-placeholder {
  color: #9f9a91;
}

.formControls .formControls_input::-ms-input-placeholder {
  color: #9f9a91;
}

.formControls .formControls_input::placeholder {
  color: #9f9a91;
}

.formControls .formControls_btnSubmit {
  width: 128px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #333333;
  color: #fff;
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
  margin: 24px 0;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
}

.formControls a {
  text-decoration: none;
}

.formControls span {
  margin: 4px 0 16px 0;
  color: #d87355;
  font-size: 0.875rem;
}

.formControls .formControls_btnLink {
  display: block;
  color: #333333;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
}

.loginPage {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 800px;
}

@media (max-width: 576px) {
  .loginPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 0 auto;
    padding: 48px 31px;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: start;
  }
}

.signUpPage {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 800px;
}

@media (max-width: 576px) {
  .signUpPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 48px auto 0 auto;
    padding: 48px 31px;
  }
}

.todoListPage {
  padding: 16px 32px;
}

@media (max-width: 576px) {
  .todoListPage {
    background-image: linear-gradient(175deg, #ffd370 100%, #fff 0%);
  }
}

.todoList_Content {
  width: 500px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .todoList_Content {
    width: 100%;
  }
}

.inputBox {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  margin-bottom: 16px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.inputBox input {
  background: #fff;
  border: none;
  border-radius: 10px;
  position: relative;
  width: 100%;
  height: 47px;
  font-size: 1rem;
  padding-left: 16px;
}

.inputBox a {
  display: block;
  width: 40px;
  height: 39px;
  position: absolute;
  background: #333333;
  color: white;
  font-size: 20px;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  top: 4px;
  right: 4px;
  padding: 10px;
}

.todoList_list {
  background: #fff;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.todoList_list .todoList_tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: space-evenly;
  -ms-flex-pack: space-evenly;
  justify-content: space-evenly;
}

.todoList_list .todoList_tab li {
  width: 100%;
}

.todoList_list .todoList_tab a {
  display: block;
  color: #9f9a91;
  text-decoration: none;
  line-height: 20px;
  font-weight: bold;
  text-align: center;
  padding: 16px;
  border-bottom: 2px solid #efefef;
}

.todoList_list .todoList_tab .active {
  color: #333333;
  border-bottom: 2px solid #333333;
}

.todoList_list .todoList_items {
  padding-top: 23px;
  padding-left: 24px;
  padding-right: 17px;
  padding-bottom: 32px;
}

.todoList_list .todoList_items .todoList_item {
  margin-bottom: 8px;
}

.todoList_list .todoList_items .todoList_label {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
  color: #333333;
  line-height: 20.27px;
}

.todoList_list .todoList_items .todoList_input {
  width: 20px;
  height: 20px;
  border: 1px solid #9f9a91;
  border-radius: 5px;
  margin-right: 16px;
}

.todoList_list .todoList_items .todoList_input:checked ~ span {
  color: #9f9a91;
  text-decoration: line-through;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.todoList_list .todoList_items li {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 17px;
}

.todoList_list .todoList_items li a {
  margin-left: 17px;
  display: block;
  font-size: 14px;
  color: #333333;
  opacity: 0;
}

.todoList_list .todoList_items li:hover a {
  opacity: 1;
}

.todoList_list .todoList_statistics {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.todoList_list .todoList_statistics p {
  color: #333333;
  font-size: 0.875rem;
}

.todoList_list .todoList_statistics a {
  color: #9f9a91;
  font-size: 0.875rem;
  text-decoration: none;
}
/*# sourceMappingURL=all.css.map */

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

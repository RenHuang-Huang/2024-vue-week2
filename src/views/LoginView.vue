<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import showAlert from '@/utils/showAlert'

const isLoading = ref(false)
const email = ref('')
const password = ref('')
const apiUrl = 'https://todolist-api.hexschool.io'
const router = useRouter()
const emailActive = ref(false)
const passwordActive = ref(false)

const login = async () => {
  if (
    !email.value ||
    !password.value ||
    errorEmail.value ||
    password.value.length < 6
  ) {
    return showAlert('錯誤', '請填寫正確資料', 'error', '確認')
  }

  try {
    isLoading.value = true
    await axios
      .post(`${apiUrl}/users/sign_in`, {
        email: email.value,
        password: password.value
      })
      .then((res) => {
        email.value = ''
        password.value = ''
        document.cookie = `todolistToken=${res.data.token}`
        router.push({ path: '/todolist' })
      })
  } catch (error) {
    showAlert('登入失敗', error.response.data.message, 'error', '確認')
  } finally {
    isLoading.value = false
  }
}

const errorEmail = computed(() => {
  if (!email.value) {
    return '請輸入Email'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    return '請輸入正確格式Email'
  }
  return ''
})
</script>

<template>
  <loading v-model:active="isLoading" :is-full-page="true"></loading>
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
      <div class="side">
        <a>
          <img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt="" />
        </a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg" />
      </div>
      <div>
        <form class="formControls">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            v-model="email"
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-on:change="emailActive = true" />
          <span v-if="emailActive && !email">此欄位不可留空</span>
          <span v-else-if="emailActive && errorEmail">{{ errorEmail }}</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="password"
            v-on:change="passwordActive = true" />
          <span v-if="passwordActive && password.length < 6"
            >密碼不得少於6個字</span
          >
          <input
            class="formControls_btnSubmit"
            type="button"
            value="登入"
            v-on:click.prevent="login" />
          <RouterLink class="formControls_btnLink" to="/signUp"
            >註冊帳號</RouterLink
          >
        </form>
      </div>
    </div>
  </div>
</template>

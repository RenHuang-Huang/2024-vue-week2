<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import showAlert from '@/utils/showAlert'

const isLoading = ref(false)
const apiUrl = 'https://todolist-api.hexschool.io'
const router = useRouter()

const [signUpEmail, signUpName, signUpPassword, signUpPassword2] = [
  ref(''),
  ref(''),
  ref(''),
  ref('')
]
const [
  signUpNameActive,
  signUpEmailActive,
  signUpPasswordActive,
  signUpPassword2Active
] = [ref(false), ref(false), ref(false), ref(false)]
const signUp = async () => {
  if (
    !signUpEmail.value ||
    !signUpName.value ||
    !signUpPassword.value ||
    !signUpPassword2.value
  ) {
    return showAlert('錯誤', '請輸入完整資料', 'error', '確認')
  }
  if (signUpPassword.value !== signUpPassword2.value) {
    return showAlert('錯誤', '密碼不一致', 'error', '確認')
  }
  if (errorEmail.value) {
    return showAlert('錯誤', '請輸入正確格式Email', 'error', '確認')
  }
  try {
    isLoading.value = true
    const res = await axios.post(`${apiUrl}/users/sign_up`, {
      email: signUpEmail.value,
      password: signUpPassword.value,
      nickname: signUpName.value
    })
    showAlert('成功', '註冊成功', 'success', '確認')
    signUpEmail.value = ''
    signUpPassword.value = ''
    signUpName.value = ''
    router.push({ path: '/login' })
  } catch (error) {
    showAlert(
      '錯誤',
      `${error.response.data.message} 請重新嘗試`,
      'error',
      '確認'
    )
  } finally {
    isLoading.value = false
  }
}

const errorEmail = computed(() => {
  if (!signUpEmail.value) {
    return '請輸入Email'
  } else if (!/\S+@\S+\.\S+/.test(signUpEmail.value)) {
    return '請輸入正確格式Email'
  }
  return ''
})
</script>
<template>
  <loading v-model:active="isLoading" :is-full-page="true"></loading>
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
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
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            id="email"
            type="text"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signUpEmail"
            v-on:change="signUpEmailActive = true" />
          <span v-if="signUpEmailActive && !signUpEmail">此欄位不可留空</span>
          <span v-else-if="signUpEmailActive && errorEmail">
            {{ errorEmail }}
          </span>
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            required
            v-model="signUpName"
            v-on:change="signUpNameActive = true" />
          <span v-if="signUpNameActive && !signUpName">此欄位不可留空</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signUpPassword"
            v-on:change="signUpPasswordActive = true" />
          <span v-if="signUpPasswordActive && !signUpPassword">
            此欄位不可留空
          </span>
          <label class="formControls_label" for="pwd2">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd2"
            id="pwd2"
            placeholder="請再次輸入密碼"
            required
            v-model="signUpPassword2"
            v-on:change="signUpPassword2Active = true" />
          <span v-if="signUpPassword2Active && !signUpPassword2">
            此欄位不可留空
          </span>
          <input
            class="formControls_btnSubmit"
            type="button"
            value="註冊帳號"
            v-on:click.prevent="signUp" />
          <RouterLink class="formControls_btnLink" to="/login">登入</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<style></style>

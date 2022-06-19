<template>
  <div class="signUpView bg-yellow js-view">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
        <a href="#"><img class="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png"
            alt=""></a>
        <img class="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg">
      </div>
      <div>
        <form class="formControls"
        @submit.prevent="signUp">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label " for="email">Email
            <input class="formControls_input signUp_email" type="text" id="email" name="email"
            placeholder="請輸入 email" required v-model="user.email">
          </label>
          <label class="formControls_label " for="name">您的暱稱
            <input class="formControls_input signUp_nickname" type="text" name="name" id="name"
            placeholder="請輸入您的暱稱" v-model="user.nickname">
          </label>
          <label class="formControls_label" for="pwd">密碼
            <input class="formControls_input signUp_password" type="password" name="pwd" id="pwd"
            placeholder="請輸入密碼" required>
          </label>
          <label class="formControls_label" for="pwd2">再次輸入密碼
            <input class="formControls_input signUp_passwordConfirm" type="password" name="pwd"
            id="pwd2" placeholder="請再次輸入密碼" required v-model="user.password">
          </label>
          <input class="formControls_btnSubmit signUp" type="submit" value="註冊帳號">
          <router-link class="formControls_btnLink js-loginPage" to="/login">登入</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>

<script setup>
import { ref, inject } from 'vue';

const axios = inject('axios');
const swal = inject('$swal');

const user = ref({
  email: '',
  nickname: '',
  password: '',
});

const signUp = async () => {
  try {
    await axios.post('users', { user: user.value });
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '恭喜註冊成功，請移至登入頁面重新登入。',
    });
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.error}`,
    });
  }
};

</script>

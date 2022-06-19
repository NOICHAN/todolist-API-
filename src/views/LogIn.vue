<template>
  <div class="loginView bg-yellow js-view">
  <div class="conatiner loginPage vhContainer ">
    <div class="side">
      <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
      <a href="#"><img class="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt=""></a>
      <img class="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg">
    </div>
    <div>
      <form class="formControls" action="index.html">
        <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
        <label class="formControls_label" for="email">Email
          <input class="formControls_input login_email"
          type="text" id="email" name="email" placeholder="請輸入 email" required v-model="user.email">
        </label>
        <label class="formControls_label" for="pwd">密碼
          <input class="formControls_input login_password"
          type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="user.password">
        </label>
        <input class="formControls_btnSubmit login" type="button" value="登入" @click="logIn">
        <router-link class="formControls_btnLink js-signUpPage" to="/signup">註冊帳號</router-link>
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
import { useRouter } from 'vue-router';

const axios = inject('axios');
const swal = inject('$swal');
const router = useRouter();

const user = ref({
  email: '',
  password: '',
});

const logIn = async () => {
  try {
    const { data, headers } = await axios.post('users/sign_in', { user: user.value });
    document.cookie = `token=${headers.authorization}; max-age=86400;`;
    document.cookie = `nickname=${data.nickname}`;
    axios.defaults.headers.common.Authorization = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '登入成功。',
    });
    router.push('/');
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.message}`,
    });
  }
};

</script>

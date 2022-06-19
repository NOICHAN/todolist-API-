import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);

axios.defaults.baseURL = 'https://todoo.5xcamp.us/';
axios.defaults.headers.common.Authorization = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
app.use(router);
app.use(VueAxios, axios);
app.use(VueSweetalert2);
app.provide('axios', app.config.globalProperties.axios);

app.mount('#app');

<template>
<div class="todoListView bg-half js-view" >
  <nav>
    <h1><a href="#">ONLINE TODO LIST</a></h1>
    <ul v-if="nickname">
      <li class="todo_sm"><a href="#"><span>{{nickname}} 的代辦</span></a></li>
      <li><a href="#" @click.prevent="signOut">登出</a></li>
    </ul>
    <ul v-else>
      <li class="todo_sm">
        <router-link to="/login">登入</router-link>
      </li>
      <li>
        <router-link to="/signup">註冊</router-link>
      </li>
    </ul>
  </nav>
  <div class="conatiner todoListPage vhContainer">
    <div class="todoList_Content" v-if="nickname">
      <div class="inputBox">
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <input type="text" class="js-todoContent" placeholder="請輸入待辦事項" v-model="todoContent">
        <a href="#" @click.prevent="addTodo">
          <i class="js-addTodo">+</i>
        </a>
      </div>
      <div class="todoList_list">
        <ul class="todoList_tab">
          <li v-for="item in type" :key="item.engType">
            <a href="#" :class="{active: item.engType === currentType}"
            @click.prevent="toggleType(item.engType)">{{ item.chtType }}</a></li>
        </ul>
        <div class="todoList_items">
          <ul class="todoList_item">
            <li v-for="item in todolistList" :key="item.id">
                <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
                <input class="todoList_input" type="checkbox" :checked="item.completed_at"
                @change="toggleState(item.id)">
                <span>{{ item.content }}</span>
                <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
                <a href="#">
                    <button type="button" class="js-editTodo"
                    @click="modifyTodo(item.id)">編輯</button>
                    <button type="button" class="js-deleteTodo"
                    @click="deleteTodo(item.id)">刪除</button>
                </a>
            </li>
          </ul>
          <div class="todoList_statistics">
            <p> <span class="js-todoList_statistics">{{ doneProject.length }}</span> 個已完成項目</p>
            <a href="#" class="js-deleteAllTodo" @click.prevent="deleteDoneTodo">清除已完成項目</a>
          </div>
        </div>
      </div>
    </div>
    <h2 v-else>請先登入</h2>
  </div>
</div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';

h2 {
  font-size: 72px;
  text-align: center;
}

</style>

<script setup>
import {
  ref, inject, onMounted, watchEffect,
} from 'vue';

const axios = inject('axios');
const swal = inject('$swal');

const nickname = ref('');
const todolistList = ref([]);
const todolistData = ref({ todos: [] });
const todoContent = ref('');
const doneProject = ref([]);
const type = ref([
  { chtType: '全部', engType: 'all' },
  { chtType: '待完成', engType: 'undone' },
  { chtType: '已完成', engType: 'done' },
]);
const currentType = ref('all');

const getTodolist = async () => {
  try {
    const { data } = await axios.get('todos');
    todolistData.value = data;
    todolistList.value = todolistData.value.todos;
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: '目前服務不可用，請之後重新在試。',
    });
  }
};

const addTodo = async () => {
  try {
    if (!todoContent.value) {
      swal.fire({
        icon: 'error',
        title: '失敗',
        text: '欄位不可為空',
      });
      return;
    }
    await axios.post('todos', { todo: { content: todoContent.value } });
    todoContent.value = '';
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '新增成功。',
    });
    await getTodolist();
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.message}`,
    });
  }
};

const modifyTodo = async (id) => {
  try {
    if (!todoContent.value) {
      swal.fire({
        icon: 'error',
        title: '失敗',
        text: '新增欄位亦是編輯欄位，欄位不可為空',
      });
      return;
    }
    await axios.put(`todos/${id}`, { todo: { content: todoContent.value } });
    todoContent.value = '';
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '修改成功。',
    });
    await getTodolist();
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.message}`,
    });
  }
};

const deleteTodo = async (id) => {
  try {
    await axios.delete(`todos/${id}`);
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '刪除成功。',
    });
    await getTodolist();
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.message}`,
    });
  }
};

const deleteDoneTodo = async () => {
  try {
    const doneTodoList = doneProject.value;
    await Promise.all(doneTodoList.map((item) => axios.delete(`todos/${item.id}`)));
    // ryo code
    //
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '成功清除已完成項目。',
    });
    await getTodolist();
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.message}`,
    });
  }
};

const toggleState = async (id) => {
  try {
    await axios.patch(`todos/${id}/toggle`);
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '切換狀態成功。',
    });
    await getTodolist();
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.message}`,
    });
  }
};

const toggleType = (engType) => {
  currentType.value = engType;
  if (engType === 'all') {
    todolistList.value = todolistData.value.todos;
  } else if (engType === 'undone') {
    todolistList.value = todolistData.value.todos.filter((item) => item.completed_at === null);
  } else {
    todolistList.value = todolistData.value.todos.filter((item) => item.completed_at !== null);
  }
};

const signOut = async () => {
  try {
    await axios.delete('users/sign_out');
    document.cookie = 'token=; max-age=1;';
    document.cookie = 'nickname=; max-age=1;';
    axios.defaults.headers.common.Authorization = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    nickname.value = '';
    swal.fire({
      icon: 'success',
      title: '成功',
      text: '登出成功。',
    });
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: '失敗',
      text: `${error.response.data.message}`,
    });
  }
};

watchEffect(async () => {
  doneProject.value = await todolistData.value.todos.filter((item) => item.completed_at !== null);
  console.log(todolistData.value.todos);
  console.log(doneProject.value);
});

onMounted(() => {
  const getNicknameCookie = document.cookie.replace(/(?:(?:^|.*;\s*)nickname\s*=\s*([^;]*).*$)|^.*$/, '$1');
  if (getNicknameCookie) {
    nickname.value = getNicknameCookie;
    getTodolist();
  }
});

</script>

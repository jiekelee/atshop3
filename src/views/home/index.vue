<template>
  <div>我是home,用户名是：{{ userStore.username }}</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
// 获取仓库
import useUserStore from "@/store/modules/user";
let userStore = useUserStore()
// 目前首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.userInfo()
})
</script>

<style scoped></style>

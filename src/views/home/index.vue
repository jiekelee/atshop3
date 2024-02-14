<template>
  <div>我是home,用户名是：{{ userStore.username }}</div>
</template>

<script setup lang="ts">

import useUserStore from '@/store/modules/user'
let userStore = useUserStore()

</script>

<style scoped></style>

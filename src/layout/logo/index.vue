<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
//引入logo、标题的配置文件
import setting from '@/setting'
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  color: white;
  align-items: center;
  padding: 20px;
  img {
    width: 90px;
  }
  p {
    font-size: $base-menu-logo-fontSize;
    margin-left: 10px;
  }
}
</style>

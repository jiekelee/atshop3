<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <!-- 顶部左侧静态 -->
      <!-- 左侧面包发屑 -->
      <Breadcrumb />
    </div>
    <div class="tabbar_right">
      <!-- 右侧按钮 -->
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script lang="ts">
export default{
  name:"Tabbar"
}
</script>

<style scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>

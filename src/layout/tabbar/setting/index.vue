<template>
  <!-- tabbar右侧 -->
  <el-button type="primary" size="small" @click="updateRefsh" icon="Refresh" circle></el-button>
  <el-button type="primary" size="small" @click="fullScreen" icon="FullScreen" circle></el-button>
  <el-button type="primary" size="small" @click="" icon="Setting" circle></el-button>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0 10px;border-radius: 50%;" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting';
// 获取骨架的小仓库
import useUserStore from '@/store/modules/user';

let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
// 刷新按钮的回调
const updateRefsh = () => {
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
}

// 全屏按钮
const fullScreen = () => {
  let isfull = document.fullscreenElement

  if(!isfull){
    document.documentElement.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
}
</script>

<script lang="ts">
export default{
  name:"Setting"
}
</script>

<style scoped></style>

<template>
  <!-- tabbar右侧 -->
  <el-button type="primary" size="small" @click="" icon="Refresh" circle></el-button>
  <el-button type="primary" size="small" @click="" icon="FullScreen" circle></el-button>
  <el-button type="primary" size="small" @click="" icon="Setting" circle></el-button>
  <img src="../../../public/me.jpg" style="width: 24px; height: 24px; margin: 0 10px" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      admin
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

<script setup lang="ts"></script>

<style scoped></style>

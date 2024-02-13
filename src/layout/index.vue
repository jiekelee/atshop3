<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu :default-active="$route.path" background-color="#001529" text-color="white" active-text-color="yellowgreen">
          <!-- 根据路由动态生态菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">
      <!-- layout组件顶部导航Tabbar -->
      <Tabbar/>
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main">
      <!-- <router-view></router-view> -->
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
//引入路由对象
import {useRoute} from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
//引入右侧内容展示区
import Main from './main/index.vue'
// 引入顶部tabbar组件
import Tabbar from './tabbar/index.vue'
let userStore = useUserStore()

// 获取路由对象
let $route = useRoute();

</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  // background: skyblue;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    // color:white;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-heigth;
    top: 0;
    left: $base-menu-width;
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-heigth);
    background: yellowgreen;
    top: $base-tabbar-heigth;
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;
    box-sizing: border-box;
  }
}
</style>

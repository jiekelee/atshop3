<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" :class="{fold:LayOutSettingStore.fold?true:false}"/>
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
//引入logo、标题的配置文件
import setting from '@/setting'
import useLayOutSettingStore from '@/store/modules/setting';
let LayOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
export default{
  name:"Logo"
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  color: white;
  align-items: center;
  padding: 5px;
  img {
    width: 90px;
    transition: all .2s;
    &.fold{
      width: 40px;
    }
  }
  p {
    font-size: $base-menu-logo-fontSize;
    margin-left: 10px;
  }
}
</style>

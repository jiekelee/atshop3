<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider">111</div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar">2222</div>
        <!-- 内容展示区 -->
        <div class="layout_main">3333</div>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.layout_container{
    width:100%;
    height:100vh;
    background:skyblue;
    .layout_slider{
        width:$base-menu-width;
        height:100vh;
        background:$base-menu-background;
    }
    .layout_tabbar{
        position:fixed;
        width:calc(100% - $base-menu-width);
        height:$base-tabbar-heigth;
        background:red;
        top:0;
        left:$base-menu-width;
    }
    .layout_main{
        
    }
}

</style>
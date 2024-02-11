<template>
    <div>
        我是login
    </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';

ElNotification({
        type:'success',
        message:'登录成功',
        // duration:0
       })

</script>

<style scoped>

</style>
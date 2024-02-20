<template>
    <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类" >
                <el-select style="width:200px;" v-model="categoryStore.c1Id">                    
                    <el-option v-for="(c1,index) in categoryStore.c1Arr" :key="c1.id" :label="c1.ctName" :value="c1.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类">
                <el-select style="width:200px;">
                    
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类">
                <el-select style="width:200px;">
                    
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { onMounted } from 'vue';
let categoryStore = useCategoryStore()

// 挂载完毕后，通知仓库发请求获取一级分类
onMounted(() => {
    getC1()
})
const getC1 = () => {
    categoryStore.getC1()
}



</script>

<style scoped></style>
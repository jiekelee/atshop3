<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          style="width: 200px"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.ctName"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          style="width: 200px"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.ctName"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          style="width: 200px"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.ctName"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { onMounted } from 'vue'
let categoryStore = useCategoryStore()

// 挂载完毕后，通知仓库发请求获取一级分类
onMounted(() => {
  getC1()
})
const getC1 = () => {
  categoryStore.getC1()
}
// 一级分类下拉菜单的change事件，选中值的时候会触发，保证一级分类ID有了再触发
const handler = () => {
  // 需要清空二、三级分类的数据
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  // 通知仓库获取二级分类的数据
  categoryStore.getC2()
}
// 二级分类下拉菜单的change事件，选中值的时候会触发，保证二级分类ID有了再触发
const handler1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
// 接收父组件传过来的scene
defineProps(['scene'])
</script>

<style scoped></style>

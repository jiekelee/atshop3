<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" @click="addSpu"
          :disabled="categoryStore.c3Id ? false : true">
          添加SPU
        </el-button>
        <!-- 展示已有SPU数据 -->
        <el-table border style="margin: 10px 0" :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU"></el-button>
              <el-button type="primary" size="small" icon="Edit" title="修改SKU" @click="updateSpu(row)"></el-button>
              <el-button type="primary" size="small" icon="View" title="查看SKU"></el-button>
              <el-button type="primary" size="small" icon="Delete" title="删除SKU"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 @size-change=""@current-change=""  -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasSpu"
          @size-change="changeSize" />
      </div>
      <!-- 添加SPU|修改SPU子组件 -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加SKU子组件 -->
      <SkuForm v-show="scene == 2" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { SpuData } from '@/api/product/spu/type'
// 引入分类仓库
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqAllSpuData } from '@/api/product/spu'
import type { HasSpuResponseData, Records } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
let categoryStore = useCategoryStore()
// 场景的数据
let scene = ref<number>(0) //0，显示已有SPU；1，添加或修改SPU；2，添加SKU
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
// 存储已有SPU的数据
let records = ref<Records>([])
// 存储已有spu的总个数
let total = ref<number>(0)
// 获取子组件实例SpuForm
let spu = ref<any>()

// 监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
// 获取三级分类下已有的SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器下拉菜单发生变化时触发
const changeSize = () => {
  getHasSpu()
}

// 添加SPU
const addSpu = () => {
  // 切换为场景1
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}

// 子组件spuFrom绑定自定义事件，目前是让子组件通知父组件切换场景为0
const changeScene = (obj:any) => {
  // 子组件spuForm点击取消，变为场景0，展示已有的SPU
  scene.value = obj.flag
  if(obj.params=='update'){
    getHasSpu(pageNo.value)
  }else{
    getHasSpu()
    console.log(obj.params);
    
  }

}

const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件方法，获取完整的已有的SPU数据
  spu.value.initHasSpuData(row)
}
</script>

<style scoped></style>

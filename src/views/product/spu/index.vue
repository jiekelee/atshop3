<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          @click="addSpu"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加SPU
        </el-button>
        <!-- 展示已有SPU数据 -->
        <el-table border style="margin: 10px 0" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SKU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}吗?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SKU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 @size-change=""@current-change=""  -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加SPU|修改SPU子组件 -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加SKU子组件 -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene" />
      <!-- dialog对话框,展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名称" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import type { SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
// 引入分类仓库
import useCategoryStore from '@/store/modules/category'
import {
  reqHasSpu,
  reqAllSpuData,
  reqSkuList,
  reqRemoveSpu,
} from '@/api/product/spu'
import type { HasSpuResponseData, Records } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'
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
// 存储全部的SKU
let skuArr = ref<SkuData[]>([])
// 控制SKU对话框的显示与隐藏
let show = ref<boolean>(false)

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
const changeScene = (obj: any) => {
  // 子组件spuForm点击取消，变为场景0，展示已有的SPU
  scene.value = obj.flag
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
    console.log(obj.params)
  }
}

const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件方法，获取完整的已有的SPU数据
  spu.value.initHasSpuData(row)
}
let sku = ref<any>()
// 添加SKU
const addSku = (row: SpuData) => {
  scene.value = 2
  // 调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 展示该SPU下所有的SKU
const findSku = async (row: SpuData) => {
  let result = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}

// 删除SPU
const deleteSpu = async (row: spuData) => {
  let result = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 路由组件销毁前，清空仓库中关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>

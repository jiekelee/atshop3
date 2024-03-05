<template>
  <el-card>
    <el-table border style="margin: 10px 0;" :data="skuArr">
      <el-table-column label="序号" type="index" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{row,$index}">
          <img :src="row.skuDefaultImg" style="height: 60px;"/>
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="450px" fixed="right">
        <template #="{row,$index}">
          <el-button type="primary" size="small" icon="Top"></el-button>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="primary" size="small" icon="View"></el-button>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 15, 20, 25]"
      :background="true"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"      
      @current-change="getHasSku"
      @size-change="handler"
    />
  </el-card>
</template>

<script setup lang="ts">
import{ref,onMounted} from 'vue'
import{reqSkuList} from '@/api/product/sku'
import type{SkuResponseData} from '@/api/product/sku/type'
import type{SkuData} from '@/api/product/spu/type'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])

onMounted(()=>{
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let result:SkuResponseData = await reqSkuList(pageNo.value,pageSize.value)
  if(result.code == 200){
    total.value = result.data.total
    skuArr.value = result.data.records
  }  
}
// 分页器下拉菜单发生变化时触发
const handler = (pageSizes:number) => {
  getHasSku()
}

</script>

<style scoped></style>

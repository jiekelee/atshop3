<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column label="序号" type="index" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" style="height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="450px" fixed="right">

        <template #="{ row, $index }">
          <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            :color="row.isSale == 1 ? 'yellowgreen' : 'gray'" @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku(row)"></el-button>
          <el-button type="primary" size="small" icon="View" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`确认要删除${row.skuName}吗`" width="200px" @confirm="removeSku(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 15, 20, 25]"
      :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total" @current-change="getHasSku"
      @size-change="handler" />
    <!-- 展示商品详情，抽屉组件 -->
    <el-drawer v-model="drawer">

      <template #header>
        <h4>商品详情</h4>
      </template>

      <template #default>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 0 5px;" v-for="(item, index) in skuInfo.skuAttrValueList" :key="item.id">{{
      item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag type="info" style="margin: 0 5px;" v-for="(item, index) in skuInfo.skuSaleAttrValueList"
              :key="item.id">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="height: 100%;width: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>

    </el-drawer>

  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'
import type { SkuResponseData, SkuInfoData, SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
let skuInfo = ref<SkuData>({})

onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
// 分页器下拉菜单发生变化时触发
const handler = () => {
  getHasSku()
}

const updateSale = async (row: SkuData) => {
  // 如果当前商品的isSale=1,表示当前是上架状态，更新为下架
  // 否则，就与上述情况相反
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale(row.id as number)
    ElMessage({ type: 'success', message: '已下架' })
    // 更新下架后，重新获取SKU数据
    getHasSku(pageNo.value)
  } else {
    // 下架发请求
    await reqSaleSku(row.id as number)
    ElMessage({ type: 'success', message: '已上架' })
    // 更新下架后，重新获取SKU数据
    getHasSku(pageNo.value)
  }
}
const updateSku = (row: SkuData) => {

}
// 查看商品详情
const findSku = async (row: SkuData) => {
  // 抽屉展示出来
  drawer.value = true
  // 获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code == 200) {
    skuInfo.value = result.data
  }
}
// 删除某个已有的SKU
const removeSku = async (id:number) => {
  let result:any = await reqRemoveSku(id as number)
  if(result.code == 200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    // 获取已有的全部商品，skuArr当前页的商品记录数，而不是全部的记录
    getHasSku(skuArr.value.length>1?pageNo.value:pageNo.value-1)
  }else{
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

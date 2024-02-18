<template>
  <div>
  <el-card class="box-card">
    <!-- 卡片添加品牌的按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
    <!-- 表格组件，用于展示已有品牌的数据 -->
    <el-table style="margin: 10px 0;" border :data="trademarkArr">
      <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌logo">
        <template #="{ row, $index }">
          <div style="display: flex; justify-content: center; align-items: center;">
            <img :src="row.logoUrl" style="height: 100px;" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateTrademark"></el-button>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件
    Pagination
      v-model:current-page,设置当前页码
      v-model:page-size,每页展示数据的条数 -->

    <el-pagination @size-change="sizeChange" @current-change="getHasTrademark" v-model:current-page="pageNo"
      v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes" :total="total" />
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
  </el-card>
  <!-- 对话框 -->
  <!-- v-model，用于控制对话框是否隐藏
        title,设置对话框左上角标题
  -->
  
  <el-dialog v-model="dialogFormVisible" title="添加品牌">
    <el-form  style="width: 80%;">
      <el-form-item label="品牌名称" label-width="80px">
        <el-input v-model="trademarkParams.tmName" placeholder="请输入品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="80px">
        <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽 -->
    <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted,reactive } from 'vue';
import { reqHasTrademark ,reqAddOrUpdateTrademark} from '@/api/product/trademark'
import type { Records, TradeMarkResponseData,TradeMark } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import {ElMessage} from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 每页展示数据条数
let limit = ref<number>(3)
// 存储已有品牌数据的总数
let total = ref<number>(0)
// 已有品牌的数据
let trademarkArr = ref<Records>([])
// 控制对话框显示与否
let dialogFormVisible = ref<boolean>(false)
// 定义收集品牌数据
let trademarkParams = reactive<TradeMark>({tmName:'',logoUrl:''})
// 获取已有品牌的接口封装为一个函数，在任何情况下向获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 组件挂载完毕钩子，发一次请求，获取第一页，一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})

const sizeChange = () => {
  getHasTrademark()
}

const addTrademark = () => {
  dialogFormVisible.value = true
  // 打开对话框之前清空数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
}

const updateTrademark = () => {
  dialogFormVisible.value = true
}

function cancel(){
  dialogFormVisible.value = false
}
async function confirm(){
  let result:any = await reqAddOrUpdateTrademark(trademarkParams)
  if(result.code == 200){
    dialogFormVisible.value = false
    ElMessage({
      type:'success',
      message:'添加品牌成功！'
    })
    // 再次发请求获取已有品牌数据
    getHasTrademark()

  }else{
    ElMessage({
      type:'error',
      message:'添加失败'
    })
  }
}
// 上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 上传文件前触发约束文件类型及大小
  // 上传文件格式png|jpg|git 4M
  if(rawFile.type=='image/png'||rawFile.type=='image/jpeg'||rawFile.type=='image/git'){
    if(rawFile.size/1024/1024 <4){
      return true
    }else{
      ElMessage({
        type:'error',
        message:'上传文件大小应小于4M'
      })
      return false
    }
  }else{
    ElMessage({
      type:'error',
      message:'上传文件格式png|jpg|git'
    })
    return false
  }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response,uploadFile) => {
  // 收集上传图片的地址，添加新品牌的时候带给服务器
  trademarkParams.logoUrl = response.result.data
  
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

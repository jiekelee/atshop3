<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片添加品牌的按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTrademark"
      >
        添加品牌
      </el-button>
      <!-- 表格组件，用于展示已有品牌的数据 -->
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌logo">
          <template #="{ row, $index }">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <img :src="row.logoUrl" style="height: 100px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`确认删除:${row.tmName}吗？`"
              width="200px"
              icon="Delete"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件
    Pagination
      v-model:current-page,设置当前页码
      v-model:page-size,每页展示数据的条数 -->

      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="total"
      />
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    </el-card>
    <!-- 对话框 -->
    <!-- v-model，用于控制对话框是否隐藏
        title,设置对话框左上角标题
  -->

    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            v-model="trademarkParams.tmName"
            placeholder="请输入品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
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
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 每页展示数据条数
let limit = ref<number>(3)
// 存储已有品牌数据的总数
let total = ref<number>(0)
// 当前页已有品牌的数据，只表示一页的品牌数据，而不是所有
let trademarkArr = ref<Records>([])
// 控制对话框显示与否
let dialogFormVisible = ref<boolean>(false)
// 定义收集品牌数据
let trademarkParams = reactive<TradeMark>({ tmName: '', logoUrl: '' })
// 获取el-form组件实例
let formRef = ref()
// 获取已有品牌的接口封装为一个函数，在任何情况下向获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
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
// 添加品牌按钮
const addTrademark = () => {
  dialogFormVisible.value = true
  // 打开对话框之前清空数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 第一种写法，TS的问号写法，有el-form组件再去清除，没有就不调用清除方法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')

  // 第二种写法，使用nextTick,当el-form组件存在后再调用清除方法
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

const updateTrademark = (row: TradeMark) => {
  // 清除表单校验的提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })

  dialogFormVisible.value = true

  // 方式一、ES6语法合并对象
  Object.assign(trademarkParams, row)

  // 方式二
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
}

function cancel() {
  dialogFormVisible.value = false
}
async function confirm() {
  // 在发请求之前，要对整个表单进行校验
  // 调用此方法对整个表单进行校验，如果校验全部通过再执行下面的语句
  try {
    await formRef.value.validate()
    let result: any = await reqAddOrUpdateTrademark(trademarkParams)
    if (result.code == 200) {
      dialogFormVisible.value = false
      ElMessage({
        type: 'success',
        message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
      })
      // 再次发请求获取已有品牌数据
      getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    } else {
      ElMessage({
        type: 'error',
        message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
      })
      dialogFormVisible.value = false
    }
  } catch (error) {
    console.error('确认操作出错：', error)
  }
}
// 上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 上传文件前触发约束文件类型及大小
  // 上传文件格式png|jpg|git 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/git'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小应小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式png|jpg|git',
    })
    return false
  }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // 收集上传图片的地址，添加新品牌的时候带给服务器
  trademarkParams.logoUrl = response.result.data
  formRef.value.clearValidate('logoUrl')
}
// 品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 自定义校验规则
  if (value.trim().length > 1) {
    callBack()
  } else {
    callBack(new Error('品牌名称大于两位'))
  }
}

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果上传图片后，有路径
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片必须上传'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [
    // required表示此字段必须校验,表单项前基红星号
    // trigger触发校验规则的时机：blur\change
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, trigger: 'blur', validator: validatorLogoUrl }],
}
// 气泡确认框的回调
const removeTrademark = async (id: number) => {
  // 点击确定按钮，发删除已有品牌请求
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 如果当前页的数据大于1条就显示当前页，否定就跳转到上一页
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
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

<template>
  <div>
    <el-table :data="perssionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name" />
      <el-table-column label="权限值" prop="code" />
      <el-table-column label="修改时间" prop="updateTime" />
      <el-table-column label="操作">
        <template #="{ row, $index }">
          <el-button @click="addPersstion(row)" v-show="row.level == 4 ? false : true" type="primary" size="small">{{
      row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
          <el-button @click="updatePersstion(row)" type="primary" size="small"
            :disabled="row.level == 1 ? true : false">编辑</el-button>
          <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框：新增与修改 -->
    <el-dialog v-model="dialogVisible" :title="persstionParams.id ? '修改菜单' : '新增菜单'" width="500">
      <el-form>
        <el-form-item lable="名称">
          <el-input placeholder="请输入名称" v-model="persstionParams.name"></el-input>
        </el-form-item>
        <el-form-item lable="权限">
          <el-input placeholder="请输入权限值" v-model="persstionParams.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { PermisstionResponseData, PermisstionList, Permisstion, MenuParams } from '@/api/acl/menu/type'
import { reqAllPermisstion, reqAddPermisstionOrUpdate } from '@/api/acl/menu'
import { ElMessage } from 'element-plus'
let perssionArr = ref<PermisstionList>([])
let dialogVisible = ref<boolean>(false)
onMounted(() => {
  getHasPersstion()
})

const getHasPersstion = async () => {
  let result: PermisstionResponseData = await reqAllPermisstion()
  if (result.code == 200) {
    perssionArr.value = result.data
  }
}

const addPersstion = (row: Permisstion) => {
  Object.assign(persstionParams, {
    id:0,
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true
  persstionParams.level = row.level + 1
  persstionParams.pid = row.id as number
}

let persstionParams = reactive<MenuParams>(
  {
    code: '',
    level: 0,
    name: '',
    pid: 0
  }
)
const updatePersstion = (row: Permisstion) => {
  
  Object.assign(persstionParams,row)
  dialogVisible.value = true

}
const save = async () => {
  let result: any = await reqAddPermisstionOrUpdate(persstionParams)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: persstionParams.id?'修改成功':'新增成功'
    })
    getHasPersstion()
  } else {
    ElMessage({
      type: 'error',
      message: persstionParams.id?'修改失败':'新增失败'
    })
  }
}
</script>

<style scoped></style>

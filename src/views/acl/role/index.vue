<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="角色名称:">
          <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="search">
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="Plus" style="margin-bottom: 10px" @click="addRole">
        添加角色
      </el-button>
      <el-table border :data="roleArr">
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column label="角色名称" align="center" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="350px" align="center">
          <template #="{ row, index }">
            <el-button type="primary" size="default" icon="User" @click="setPermisstion(row)"> 分配权限 </el-button>
            <el-button type="primary" size="default" icon="Edit" @click="editRole(row)"> 编辑 </el-button>
            <el-popconfirm :title="`确认要删除${row.roleName}吗?`" @confirm="removeRole(row.id)" width="200px">
              <template #reference>
                <el-button type="primary" size="default" icon="Delete"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
        :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total"
        @current-change="getHasRoleInfo" @size-change="handler" />
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog v-model="isAddRole" :title="roleParams.id ? '修改角色' : '添加角色'" width="500">
      <el-form>
        <el-form-item label="角色名称">
          <el-input placeholder="请输入角色名称" v-model="roleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="isAddRole = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 抽屉 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="selectArr" :props="defaultProps" />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqRoleInfo, reqAddORUpdateRole, reqRemoveRole,reqAllMenuList ,reqSetPermisstion} from '@/api/acl/role'
import {  Records, Role, RoleResponseData,MenuResponseData,MenuList } from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
let isAddRole = ref<boolean>(false)
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let roleArr = ref<Records>([])
let keyword = ref<string>('')
let roleParams = reactive<Role>({
  id: 0,
  roleName: '',
  remark: null,
})
let drawer = ref<boolean>(false)

onMounted(() => {
  getHasRoleInfo()
})

const getHasRoleInfo = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqRoleInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    roleArr.value = result.data.records
  }
}

const handler = () => {
  getHasRoleInfo()
}

const addRole = () => {
  Object.assign(roleParams, {
    id: 0,
    roleName: '',
    remark: null,
  })
  isAddRole.value = true
}

const save = async () => {
  let result: any = await reqAddORUpdateRole(roleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加角色成功',
    })
    isAddRole.value = false
    getHasRoleInfo(roleArr.value.length >= 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '添加角色失败',
    })
  }
}

const editRole = (row: any) => {
  Object.assign(roleParams, row)
  isAddRole.value = true
}

const removeRole = async (roleId: number) => {
  let result: any = await reqRemoveRole(roleId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasRoleInfo(roleArr.value.length >= 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const search = () => {
  getHasRoleInfo()
}
let settingStore = useLayOutSettingStore()
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
let menuArr = ref<MenuList>([])
// 数组用于存储已勾选节点的ID（第四级，最底级的）
let selectArr = ref<number[]>([])
let tree = ref<any>()
// 分配权限
const setPermisstion = async (row:Role) => {
  Object.assign(roleParams,row)
  let result:MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if(result.code == 200){
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value,[])
  }
  drawer.value = true
}
const filterSelectArr = (allData:any,initArr:any) => {
  allData.forEach((item:any)=>{
    if(item.select && item.level == 4){
      initArr.push(item.id)
    }
    if(item.children && item.children.length>0){
      filterSelectArr(item.children,initArr)
    }
  })
  return initArr
}
const confirmClick = async () => {
  // 选中节点的ID
  let arr = tree.value.getCheckedKeys()
  // 半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  // 数组合并
  let permisstionId = arr.concat((arr1))
  let result:any =  await reqSetPermisstion(roleParams.id as number,permisstionId)
  if(result.code == 200){
    drawer.value = false
    ElMessage({
      type:'success',
      message:'分配权限成功'
    })
    window.location.reload()
  }else{
    ElMessage({
      type:'error',
      message:'分配权限失败'
    })
  }
}

// 树形控件
const defaultProps = {
    children: 'children',
    label: 'name',
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

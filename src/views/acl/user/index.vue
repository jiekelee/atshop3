<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="keyword ? false : true" @click="search">
            搜索
          </el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" @click="addUser">
        添加用户
      </el-button>
      <el-button type="primary" size="default" color="pink" :disabled="selectIdArr.length ? false : true"
        @click="deleteSelectUser">
        批量删除
      </el-button>
      <!-- 展示用户信息 -->
      <el-table @selection-change="selectChange" style="margin: 10px 0" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="280px" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="User" @click="setRole(row)">
              分配角色
            </el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">
              编辑
            </el-button>
            <el-popconfirm :title="`你确定要删除吗${row.username}?`" @confirm="deleteUser(row.id)" width="260px">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9]"
        :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total"
        @current-change="getHasUserInfo" @size-change="handler" />
    </el-card>
    <!-- 抽屉 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户信息' : '添加用户' }}</h4>
      </template>

      <template #default>
        <el-form label-width="100px" :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请输入姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请输入昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请输入密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构，某个已有账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>

      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">
              全选
            </el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref<Records>([])
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})

onMounted(() => {
  getHasUserInfo()
})

const getHasUserInfo = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

const handler = () => {
  getHasUserInfo()
}

// 添加用户
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的错误提示信息,等form加载完后再清除
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
const updateUser = (row: User) => {
  drawer.value = true
  // 存储已收集到的用户信息
  Object.assign(userParams, row)
  // 清除上一次的错误提示信息,等form加载完后再清除
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
const save = async () => {
  // 表单每一项都通过校验后再执行以下
  await formRef.value.validate()
  // 添加新用户|更新已有用户信息
  let result = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // 新增跳转到第一页，更新留在当前页,因为下面有刷新语句，所以此句功能失效
    getHasUserInfo(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次，防止修改了自己的账号名
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加用户失败',
    })
  }
}
const cancel = () => {
  drawer.value = false
}
// 检验用户名的函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名至少5位'))
  }
}
const validatorname = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('昵称至少5位'))
  }
}
// 表单校验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
}
let formRef = ref<any>()
let checkAll = ref<boolean>(false)
// 设置不确定状态，仅负责样式控制
let isIndeterminate = ref<boolean>(true)
// 存储所有职位
let allRole = ref<AllRole>([])
// 存储当前用户已有的职位
let userRole = ref<AllRole>([])
// 分配角色的按钮
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(userParams.id)
  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}
// 全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 每个复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  //
  const checkedCount = value.length
  // 当勾选上的项目个数与全部的职位个数相等时，顶部的复选框勾上
  checkAll.value = checkedCount === allRole.value.length
  // 不确定的样式
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}
// 确定按钮的回调，分配职位
const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => item.id),
  }
  let result = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功',
    })
    drawer1.value = false
    getHasUserInfo()
  }
}
// 删除用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUserInfo(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
// 存储批量删除用户的ID
let selectIdArr = ref<User[]>([])
// table复选框被勾选的时候触发
const selectChange = (value: any) => {
  selectIdArr.value = value
}
// 批量删除
const deleteSelectUser = async () => {
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  let result = await reqSelectUser(idList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUserInfo(userArr.value.length >= 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 收集用户输入的搜索关键字
let keyword = ref<string>('')
const search = () => {
  getHasUserInfo()
}
let settingStore = useLayOutSettingStore()
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

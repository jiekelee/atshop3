<template>
  <div>
    <el-card style="height: 80px;">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
      <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
      <el-button type="primary" size="default" color="pink">批量删除</el-button>
      <!-- 展示用户信息 -->
      <el-table style="margin: 10px 0;" border :data="userArr">
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
            <el-button type="primary" size="small" icon="User">分配角色</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateUser">编辑</el-button>
            <el-button type="primary" size="small" icon="Delete">删除</el-button>
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
        <h4>添加用户</h4>
      </template>

      <template #default>
        <el-form label-width="100px">
          <el-form-item label="用户姓名">
            <el-input placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button >取消</el-button>
          <el-button type="primary" >确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqUserInfo } from '@/api/acl/user'
import type { UserResponseData, Records,User } from '@/api/acl/user/type'
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref<Records>([])
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
onMounted(() => {
  getHasUserInfo()
})

const getHasUserInfo = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
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
}
const updateUser = (row:User) => {
  drawer.value = true
}

</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

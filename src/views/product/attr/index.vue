<template>
  <div>
    <!-- 引入三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <!-- <el-button type="primary" icon="Plus" @click="getAttr">查看属性</el-button>
      <el-button type="primary" icon="Plus" @click="addAttr">增加属性</el-button>
      <el-button type="primary" icon="Plus" @click="addAttrValue">增加属性值</el-button> -->
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称" prop="">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.attrName}吗?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
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
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改属性的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性的名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// import { reqAddC1 } from '@/api/product/attr';
import useCategoryStore from '@/store/modules/category'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import {
  reqAttr,
  reqAddAttr,
  reqAddAttrValue,
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '@/api/product/attr'
import { Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
// 存储已有属性与属性值
let attrArr = ref<Attr[]>([])
// 定义card组件内容切换变量
let scene = ref<number>(0) //scene=0，显示table;scene=1展示添加修改属性结构
// 控制编辑模式与查看模式的切换
let flag = ref<boolean>(true)
// const arr = { valueName: '' }
// 收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表三级分类
})
// 准备一个数组，用于存储对应的组件实例el-input
let inputArr = ref<any>([])

//监听仓库三级分类ID的变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类有值才发请求
    if (!categoryStore.c3Id) return
    getAttr()
  },
)

const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制编辑模式与显示模式的切换
  })
  // 获取最后el-input组件
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

const addAttr = () => {
  // 每一次点击时，先清空收集的数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id, //三级分类的ID
    categoryLevel: 3, //代表三级分类
  })
  // reqAddAttr()
  scene.value = 1
}

const updateAttr = (row: Attr) => {
  scene.value = 1
  // ES6-Object.assign，进行对象的合并，深拷贝，切勿用浅拷贝Object.assign(attrParams,row)
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

const cancel = () => {
  scene.value = 0
}

const save = async () => {
  // if (attrParams.id) {
  //   let isEdit = true
  //   deleteAttr(attrParams.id as number, isEdit)
  // }

  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
// 属性值表单元素失去焦点方法
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况1，不能为空
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 非法情况2，
  let repeat = attrParams.attrValueList.find((item) => {
    // 把当前失去焦点的属性值对象从当前数组扣除判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 将重复的属性值从数组中删除
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
  }
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // nextTick,响应式数据发生变化，获取更新后的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

const deleteAttr = async (attrId: number, isEdit: boolean) => {
  if (!isEdit) {
    isEdit = false
  }
  let result: any = await reqRemoveAttr(attrId, isEdit)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAttr()
  } else if (result.code == 202) {
    getAttr()
    return
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 路由组件卸载时，仓库相关的数据清空
onBeforeUnmount(() => {
  // 清空仓库
  categoryStore.$reset()
})
</script>

<style scoped></style>

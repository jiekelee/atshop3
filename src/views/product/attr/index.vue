<template>
  <div>
    <!-- 引入三级分类全局组件 -->
    <Category :scene="scene"/>
    <el-card style="margin: 10px 0">
      <div v-show="scene==0">
        <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true" @click="addAttr">添加属性</el-button>
      <!-- <el-button type="primary" icon="Plus" @click="getAttr">查看属性</el-button>
      <el-button type="primary" icon="Plus" @click="addAttr">增加属性</el-button>
      <el-button type="primary" icon="Plus" @click="addAttrValue">增加属性值</el-button> -->
      <el-table border style="margin: 10px 0" :data="attrArr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称" prop="">
          <template #="{ row, $index }">
            <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">{{ item.valueName
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="updateAttr"></el-button>
            <el-button type="primary" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div v-show="scene==1">
        <!-- 展示添加属性与修改属性的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性的名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" :disabled="attrParams.attrName?false:true" type="primary" size="default" icon="Plus">添加属性值</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
        <el-button type="primary" size="default">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// import { reqAddC1 } from '@/api/product/attr';
import useCategoryStore from '@/store/modules/category'
import { watch, ref,reactive } from 'vue'
import { reqAttr, reqAddAttr, reqAddAttrValue } from '@/api/product/attr'
import { Attr } from '@/api/product/attr/type'
let categoryStore = useCategoryStore()
// 存储已有属性与属性值
let attrArr = ref<Attr[]>([])
// 定义card组件内容切换变量
let scene = ref<number>(1) //scene=0，显示table;scene=1展示添加修改属性结构
// const arr = { valueName: '' }
// 收集新增的属性的数据
let attrParams = reactive<Attr>({
    attrName:"",
    attrValueList:[],
    categoryId:'', //三级分类的ID
    categoryLevel:3,//代表三级分类

})

//监听仓库三级分类ID的变化
watch(() => categoryStore.c3Id, () => {
  // 清空上一次查询的属性与属性值
  attrArr.value = []
  // 保证三级分类有值才发请求
  if (!categoryStore.c3Id) return
  getAttr()
})

const getAttr = async () => {
  const { c3Id } = categoryStore
  let result = await reqAttr(c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

const addAttrValue = () => {
  // console.log('runing123');
  // reqAddAttrValue()
  attrParams.attrValueList.push()

}

const addAttr = () => {
  // reqAddAttr()
  scene.value = 1
}

const updateAttr = () => {
  scene.value = 1
}

const cancel = () => {
  scene.value = 0
}


// {
//     "code":200,
//     "message":"成功",
//     "data":[
//         {
//             "id":27241,
//             "createTime":null,
//             "updateTime":null,
//             "attrName":"运行内存",
//             "categoryId":61,
//             "categoryLevel":3,
//             "attrValueList":[
//                 {
//                     "id":239455,
//                     "createTime":null,
//                     "updateTime":null,
//                     "valueName":"8G",
//                     "attrId":27241
//                 }
//             ]
//         },
//     ],
//     "ok":true
// }
</script>

<style scoped></style>

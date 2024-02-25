// 商品分类全局组件小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseDate } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c1Id: '',
      // 存储一级分类下对应的二级分类数据
      c2Arr: [],
      // 收集二级分类的id
      c2Id: '',
      // 存储二级分类下对应的二级分类数据
      c3Arr: [],
      // 收集三级分类的id
      c3Id: '',
    }
  },

  actions: {
    // 获取一级分类方法
    async getC1() {
      const result: CategoryResponseDate = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    // 获取二级分类方法
    async getC2() {
      const result: CategoryResponseDate = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    // 获取三级分类方法
    async getC3() {
      const result: CategoryResponseDate = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },

  getters: {},
})

export default useCategoryStore

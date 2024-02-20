// 商品分类全局组件小仓库
import {defineStore} from 'pinia'
import { reqC1 } from '@/api/product/attr';
import type { CategoryResponseDate } from '@/api/product/attr/type';
import type { CategoryState } from './types/type';

let useCategoryStore = defineStore('Category',{
    state:():CategoryState => {
        return{
            c1Arr:[],
            c1Id:''
        }
    },

    actions:{
        // 获取一级分类方法
        async getC1(){
           let result:CategoryResponseDate = await reqC1()
           if(result.code == 200){
            this.c1Arr = result.data
           }
        }
    },

    getters:{

    }
})

export default useCategoryStore;
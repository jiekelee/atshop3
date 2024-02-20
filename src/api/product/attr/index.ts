// 属性相关的API文件
import request from '@/utils/request'
import type{c1} from './type'
import type { CategoryResponseDate } from './type'

enum API{
    // 获取一级分类接口地址
    C1_URL='/admin/product/getCategory1',
    // 获取二级分类接口地址
    C2_URL='/admin/product/getCategory2/',
    // 获取三级分类接口地址
    C3_URL='/admin/product/getCategory3/',
    // 添加一级分类接口地址
    ADDC1_URL='/admin/product/addC1'
}

// 获取一级分类的接口方法
export const reqC1 =()=>request.get<any,CategoryResponseDate>(API.C1_URL)

// 添加一级分类的接口方法
export const reqAddC1 =(data:c1)=>request.post<any,any>(API.ADDC1_URL,data)

// 获取二级分类的接口方法
export const reqC2 =(category1Id:number)=>request.get<any,CategoryResponseDate>(API.C2_URL+category1Id)

// 获取三级分类的接口方法
export const reqC3 =(category2Id:number)=>request.get<any,CategoryResponseDate>(API.C3_URL+category2Id)
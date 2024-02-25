// 属性相关的API文件
import request from '@/utils/request'
import type { c1, AttrList1, Attr } from './type'
import type { CategoryResponseDate, AttrResponseData } from './type'

enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  // 获取三级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  // 添加一级分类接口地址
  ADDC1_URL = '/admin/product/addC1',
  // 获取分类下已有的属性与属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加属性
  ADDATTR_URL = '/admin/product/addAttr/',
  // 添加属性值
  ADDATTRVALUE_URL = '/admin/product/addAttrvalue/',
  // 添加或者修改已有的属性的接口
  ADDORUPDATEATTR_URL = '/admin/product/saveattrinfo',
  // 删除某个已有的属性
  DELETEATTR_URL = '/admin/product/deleteattr/'
}

// 获取一级分类的接口方法
export const reqC1 = () => request.get<any, CategoryResponseDate>(API.C1_URL)

// 添加一级分类的接口方法
export const reqAddC1 = (data: c1) =>
  request.post<any, any>(API.ADDC1_URL, data)

// 获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseDate>(API.C2_URL + category1Id)

// 获取三级分类的接口方法
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseDate>(API.C3_URL + category2Id)
// 获取对应分类下的属性与属性值接口
export const reqAttr = (category3Id: number | string) =>
  request.get<any, AttrResponseData>(API.ATTR_URL + `${category3Id}`)
// export const reqAttr = (category1Id:number|string,category2Id:number|string,category3Id:number|string)=>request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`)
// {category1Id}/{category2Id}/{category3Id}

// 添加属性的接口方法
export const reqAddAttr = () => request.post<any, any>(API.ADDATTR_URL)

// 添加属性值的接口方法
export const reqAddAttrValue = () =>
  request.post<any, any>(API.ADDATTRVALUE_URL)

// 新增或者修改已有属性接口
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)

// 删除一个属性
export const reqRemoveAttr = (attrId:number,isEdit:boolean)=>request.delete<any,any>(API.DELETEATTR_URL+`${attrId}/${isEdit}`)
// SKU模块接口管理
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from '@/api/product/sku/type'
enum API {
  // 获取已有SKU数据
  SKU_URL = '/admin/product/list/',
  // 上架
  SALE_URL = '/admin/product/onSale/',
  // 下架
  CANCEL_URL = '/admin/product/cancelSale/',
  // 获取商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除已有的商品
  DELETESKU_URL = '/admin/product/deleteSku/',
}
// 获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

// 已有商品上架请求
export const reqSaleSku = (spuId: number) =>
  request.get<any, any>(API.SALE_URL + spuId)
// 下架的接口
export const reqCancelSale = (spuId: number) =>
  request.get<any, any>(API.CANCEL_URL + spuId)
// 获取商品详情的接口
export const reqSkuInfo = (spuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
// 删除已有的某个SKU
export const reqRemoveSku = (spuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + spuId)

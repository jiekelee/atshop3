// SPU管理模块的接口
import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData
} from '@/api/product/spu/type'

enum API {
  // 获取已有的SPU的数据{page}/{limit}
  HASSPU_URL = '/admin/product/',
  // HASSPU_URL = '/admin/product/spu/getspudata/',//本地API
  // 获取品牌数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // ALLTRADEMARK_URL = '/admin/product/baseTrademark/', //本地API
  // 获取某个SPU下全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色、版本、尺码]
  // ALLSALEATTR_URL = '/admin/product/spu/getallspudata',
  //获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有SPU，
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新增的SKU的请求地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某个已有SPU下全部的售卖SKU
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/'
}

// 获取某个三级分类下已有的SPU分类数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
// 取得全部SPU数据
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
// 取得某个已有的SPU下的全部图片
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
// 获取某个已有SPU下的全部销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取全部销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 获取全部SPU数据
export const reqAllSpuData = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSPUDATA_URL)

// 添加一个SPU接口,更新一个已有的SPU
// data,新增的SPU对象|已有的SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果SPU对象有id,表示更新已有的SPU
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加SKU的请求方法
export const reqAddSku = (data:SkuData)=>request.post<any,any>(API.ADDSKU_URL,data)

// 获取SKU数据
export const reqSkuList = (spuId:number|string)=>request.get<any,SkuInfoData>(API.SKUINFO_URL+spuId)

// 删除已有的SPU
export const reqRemoveSpu = (spuId:number|string)=>request.delete<any,any>(API.REMOVESPU_URL+spuId)
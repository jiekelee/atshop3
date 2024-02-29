// SPU管理模块的接口
import request from '@/utils/request'
import type { HasSpuResponseData,AllTradeMark,SpuHasImg,SaleAttrResponseData,HasSaleAttrResponseData } from '@/api/product/spu/type'

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

  //获取某一个SPU下全部的已有的销售属性接口地址
  // SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/'
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
export const reqAllTradeMark = ()=>request.get<any,AllTradeMark>(API.ALLTRADEMARK_URL)
// 取得某个已有的SPU下的全部图片
export const reqSpuImageList = (spuId:number)=>request.get<any,SpuHasImg>(API.IMAGE_URL+spuId)
// 获取某个已有SPU下的全部销售属性
export const reqSpuHasSaleAttr = (spuId:number)=>request.get<any,SaleAttrResponseData>(API.SPUHASSALEATTR_URL+spuId)

// 获取全部销售属性
export const reqAllSaleAttr = ()=>request.get<any,HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 获取全部SPU数据
export const reqAllSpuData = ()=>request.get<any,HasSaleAttrResponseData>(API.ALLSPUDATA_URL)
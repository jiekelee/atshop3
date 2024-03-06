import type { ResponseData } from '@/api/product/spu/type'

// export interface ResponseData{
//     code:number,
//     message:string,
//     ok:boolean
// }

// 定义SKU对象的TS类型
export interface Attr {
  id?:number
  attrId: number | string
  valueId: number | string
  valueName?:string
}

export interface saleAttr {
    saleAttrId: number | string
    saleAttrValueId: number | string
    id?:number
    saleAttrValueName?:string
  }

export interface SkuData {
    category3Id?: string | number
    spuId?: number | string
    tmId?: number | string
    skuName?: string
    price?: string | number
    weight?: string | number
    skuDesc?: string
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleAttr[]
    skuDefaultImg?: string,
    isSale?:number, //控制商品的上架与下架
    id?:number
  }

// 获取SKU接口返回的数据TS类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取SKU商品详情接口的TS类型
export interface SkuInfoData extends ResponseData{
    data:SkuData
}
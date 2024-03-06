// 服务器全部接口返回的数据类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuSaleAttrList: null | SpuImg[]
  spuImageList: null | SaleAttr[]
}
// 数组：元素都是已有SPU数据类型
export type Records = SpuData[]
// 定义获取已有的SPU接口返回的数据TS类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的TS类型
export interface SpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
// 已有的SPU照片墙数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象TS类型
export interface SaleAttrValue {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
// 存储已有的销售属性值的数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象TS类型
export interface SaleAttr {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
// SPU已有销售属性接口返回数据TS类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU的返回数据TS类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: number | string
  valueId: number | string
}

export interface saleAttr {
  saleAttrId: number | string
  saleAttrValueId: number | string
}

export interface SkuData {
  category3Id: string | number
  spuId: number | string
  tmId: number | string
  skuName: string
  price: string | number
  weight: string | number
  skuDesc: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleAttr[]
  skuDefaultImg: string
  isSale?: number //控制商品的上架与下架
  id?: number
}

// 获取SKU数据接口的TS类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}

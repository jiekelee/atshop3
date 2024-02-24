export interface c1 {
  ctName: string
}

export interface AttrList1 {
  valueName: string, // 属性值名称
  attrId: number // 所属属性的 id
}

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 分类ts类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 相应的分类接口返回数据类型
export interface CategoryResponseDate extends ResponseData {
  data: CategoryObj[]
}

// 对应属性与属性值的ts类型

// 属性值对象的ts类型
export interface AttrValue {
  id?: number,
  valueName: string,
  attrId?: number,
}

// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
// 属性对象
export interface Attr {
  id?: number,
  attrName: string,
  categoryId: number|string,
  categoryLevel: number,
  attrValueList: AttrValueList
}
// 存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
// 属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}

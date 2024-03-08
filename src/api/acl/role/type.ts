import { ResponseData } from '@/api/product/spu/type'

export interface Role {
  id?: number
  createTime?: string
  updateTime?: string
  roleName?: string
  remark?: null
}

export type Records = Role[]

export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 菜单与按钮数据的TS类型
export interface MenuData{
  id:number,
  createTime:string,
  updateTime:string,
  pid:number,
  name:string,
  code:string,
  toCode:string,
  type:number,
  status:null,
  level:number,
  children?:MenuList,
  select:boolean
}

export type MenuList = MenuData[]

export interface MenuResponseData extends ResponseData{
  data:MenuList
}
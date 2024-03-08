import { ResponseData } from "@/api/product/spu/type";

// 菜单数据与按钮数据的TS类型
export interface Permisstion{
    id?:number,
    createTime:string,
    updateTime:string,
    pid:number,
    name:string,
    code:null,
    toCode:null,
    type:number,
    status:null,
    level:number,
    children?:PermisstionList,
    select:boolean
}

export type PermisstionList = Permisstion[]
// 菜单接口返回的数据类型
export interface PermisstionResponseData extends ResponseData{
    data:PermisstionList
}

// 添加与修改菜单携带的参数TS类型
export interface MenuParams{
    code:string, //权限数值
    level:number,
    name:number, //菜单名字
    pid:number,
    id?:number,
}
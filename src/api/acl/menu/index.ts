import request from "@/utils/request";
import {PermisstionResponseData,PermisstionList,MenuParams} from './type'

// 菜单管理模块
enum API{
    ALLPERMISSTION_URL = '/admin/acl/permission',
    ADDPERMISSTION_URL = '/admin/acl/permission/save',
    UPDATEPERMISSTION_URL = '/admin/acl/permission/update',
}

export const reqAllPermisstion = ()=> request.get<any,PermisstionResponseData>(API.ALLPERMISSTION_URL)

export const reqAddPermisstionOrUpdate = (data:MenuParams) => {
    if(data.id){
        return request.put<any,any>(API.UPDATEPERMISSTION_URL,data)
    }else{
        return request.post<any,any>(API.ADDPERMISSTION_URL,data)
    }
}
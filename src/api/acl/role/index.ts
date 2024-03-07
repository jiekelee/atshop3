// 角色管理接口
import request from "@/utils/request"
import { RoleResponseData, Role } from './type'
enum API {
    ALLROLE_URL = '/admin/acl/role/',
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATEROLE_URL = '/admin/acl/role/update',
    REMOVEROLE_URL = '/admin/acl/role/remove/'
}
// 获取所有角色列表
export const reqRoleInfo = (page: number, limit: number, keyword: string) => request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${keyword}`)
// 新增角色
export const reqAddORUpdateRole = (data: Role) =>{
    if(data.id){
        return request.put<any, any>(API.UPDATEROLE_URL, data)
    }else{
        return request.post<any, any>(API.ADDROLE_URL, data)
    }
} 
// 删除角色
export const reqRemoveRole = (roleId:number)=> request.delete(API.REMOVEROLE_URL+roleId)
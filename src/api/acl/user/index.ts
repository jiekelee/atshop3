// 用户管理模块的接口
import type { UserResponseData, User, AllRoleResponseData,SetRoleData } from './type'
import request from '@/utils/request'
enum API {
    // 获取全部已有账号信息
    ALLUSER_URL = '/admin/acl/user/',
    // 添加一个用户
    ADDUSER_URL = '/admin/acl/user/save',
    // 更新用户信息
    UPDATEUSER_URL = '/admin/acl/user/update',
    // 获取全部职位，当前账号所拥有的职位接口
    ALLROLE_URL = '/admin/acl/user/toAssign/',
    // 给已有的用户分配角色的接口
    SETROLE_URL = '/admin/acl/user/doAssignRole',
    // 删除一个账号信息
    DELETEUSER_URL = '/admin/acl/user/remove/',
    // 批量删除账号的接口
    DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}

// 获取用户信息的接口
export const reqUserInfo = (page: number, limit: number,username:string) =>
    request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
// 添加用户接口
export const reqAddOrUpdateUser = (data: User) => {
    // 携带的参数有ID更新
    if (data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}
// 获取全部职位，以及包含当前用户已有的职位
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData > (API.ALLROLE_URL + userId)
// 分配职务 
export const reqSetUserRole = (data:SetRoleData) => request.post<any,any>(API.SETROLE_URL,data)
// 删除一个账号信息
export const reqRemoveUser = (userid:number)=> request.delete<any,any>(API.DELETEUSER_URL+userid)
// 批量删除账号接口
export const reqSelectUser = (idList:number[]) => request.delete<any>(API.DELETEALLUSER_URL,{data:idList})
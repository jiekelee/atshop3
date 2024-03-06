// 用户管理模块的接口
import type { UserResponseData ,User} from './type'
import request from '@/utils/request'
enum API {
    // 获取全部已有账号信息
    ALLUSER_URL = '/admin/acl/user/',
    // 添加一个用户
    ADDUSER_URL = '/admin/acl/user/save',
    // 更新用户信息
    UPDATEUSER_URL = '/admin/acl/user/update',
}

// 获取用户信息的接口
export const reqUserInfo = (page: number, limit: number) =>
    request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}`)
// 添加用户接口
export const reqAddOrUpdateUser = (data:User)=>{
    // 携带的参数有ID更新
    if(data.id){
        return request.put<any,any>(API.UPDATEUSER_URL,data)
    }else{
        return request.post<any,any>(API.ADDUSER_URL,data)
    }
}
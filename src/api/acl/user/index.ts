// 用户管理模块的接口
import type { UserResponseData } from './type'
import request from '@/utils/request'
enum API{
    // 获取全部已有账号信息
    ALLUSER_URL = '/admin/acl/user/'
}

// 获取用户信息的接口
export const reqUserInfo = (page:number,limit:number)=>request.get<any,UserResponseData>(API.ALLUSER_URL+`${page}/${limit}`)
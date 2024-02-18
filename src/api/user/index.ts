import request from '@/utils/request'
import {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
  brandData,
} from './type'

// 项目用户相关的请求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
  GETBRAND_URL = 'http://127.0.0.1:3000/addbrand',
}

// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)

// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)

// 测试获取品牌接口
export const reqGetBrand = (data: brandData) =>
  request.post<any, brandData>(API.GETBRAND_URL, data)

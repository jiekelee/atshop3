import type { ResponseData } from '@/api/product/spu/type'

// 代表一个账号信息的TS类型
export interface User {
  id?: number
  createTime: string
  updateTime: string
  username?: string
  password?: string
  name?: string
  phone: string
  roleName: string
}

// 数组包含全部的用户信息
export type Records = User[]
// 获取全部用户信息的接口返回的TS类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

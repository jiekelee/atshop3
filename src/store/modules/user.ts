//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin } from '@/api/user'
//引入数据类型
import { loginForm } from '@/api/user/type'
//引入操作本地存储的方法
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
//引入路由（常量路由）
import { constantRoute } from '@/router/routes'
import { UserState } from './types/type'

let useUserStore = defineStore('User', {
  //小仓库，存储数据的地方
  state: ():UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes:constantRoute, //仓库存储生成菜单需要的数组
    }
  },

  //异步|逻辑的地方
  actions: {
    async userLogin(data: loginForm) {
      let result = await reqLogin(data)
      //登录请求：成功200-》token
      //登录请求：失败201-》登录失败错误信息
      if (result.code == 200) {
        //pinia仓库存储token
        //由于pinia|vue存储数据其实利用js对象，并非持久化的
        this.token = result.data.token
        //本地存储持久化
        SET_TOKEN(result.data.token as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
  },

  getters: {},
})

export default useUserStore

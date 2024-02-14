//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo } from '@/api/user'
//引入数据类型
import { loginForm } from '@/api/user/type'
//引入操作本地存储的方法
import { SET_TOKEN, GET_TOKEN ,REMOVE_TOKEN} from '@/utils/token'
//引入路由（常量路由）
import { constantRoute } from '@/router/routes'
import { UserState } from './types/type'
import { resultProps } from 'element-plus'

let useUserStore = defineStore('User', {
  //小仓库，存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组
      username: '',
      avatar: '',
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
    // 获取用户信息的方法
    async userInfo() {
      //获取用户信息存储在仓库中,头像，名字
      let result = await reqUserInfo()
      // 如果获取用户信息成功，就存储
      if (result.code == 200) {
        this.username = result.data.checkUser.username
        this.avatar = result.data.checkUser.avatar
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    // 退出登录
    userLogout(){
      // 目前没有mock接口，退出登录接口（通知服务器本地用户唯一标识失效）
      this.token=''
      this.username=''
      this.avatar=''
      REMOVE_TOKEN()
    }
  },

  getters: {},
})

export default useUserStore

//路由鉴权，项目当中路由是否能被访问的设置(某一个路由什么条件下可以访问，什么条件下不能访问)
import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
// 引入进度条的样式
import 'nprogress/nprogress.css'
// 隐藏进度条的小圆圈
nprogress.configure({ showSpinner: false })
// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
let userStore = useUserStore(pinia)
// console.log(userStore);

// 全局守卫：项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  // 设置网页标题为菜单名
  document.title = `${setting.title} - ${to.meta.title}`
  // to,将要访问的路由
  // from,从哪个路由而来
  // next,路由的放行函数
  //访问路由之前的守卫
  // console.log(1111);
  nprogress.start()
  // 获取token，判断用户登录，还是未登录
  let token = userStore.token
  // 获取用户名字
  let username = userStore.username
  // 用户已登录判断
  if (token) {
    // 登录成功，访问Login，不能访问，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功，访问其余六个路由
      // 有用户信息
      if (username) {
        next()
      } else {
        // 如果没用户信息，在守卫处发请求获取了用户信息后再放行
        try {
          // 获取用户信息以后，再放行
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期，获取不到用户信息
          // 用户手动修改了本地存储的token
          // 退出登录，用户相关的数据清空
          userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

// 第一个问题：任意路由切换实现进度条业务 ---nprogress.安装插件：pnpm i progress
// 第二个问题：路由鉴权（路由组件访问权限的设置）
// 全部路由组件：

// 用户未登录：可以访问login，其余六个路由不能访问（指向login）
// 用户登录成功:不可以访问login(指向首页)，其余的路由可以访问

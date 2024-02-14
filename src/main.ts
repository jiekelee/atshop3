import { createApp } from 'vue'
import './styles/index.scss'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import gloablComponent from './components/index'
import router from './router'
//引入仓库
import pinia from '@/store'

const app = createApp(App)
//忽略当前文件ts类型的检测否则有红色提示(打包会失败)
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(gloablComponent)
//注册模板路由
app.use(router)
//安装仓库
app.use(pinia)
// 引入路由鉴权文件
import './permisstion'
app.mount('#app')

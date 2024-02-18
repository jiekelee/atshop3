<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到后台管理系统</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="login">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
//
import { getTime } from '@/utils/time'
let useStore = useUserStore()
//获取路由器
let $router = useRouter()
let $route = useRoute()
let loginForms = ref()

let loginForm = reactive({ username: 'admin', password: 'admin' })

const login = async () => {
  //点击登录按钮后的动作
  //通知仓库发登录请求
  //请求成功->首页显示数据的地方
  //请求失败，弹出登录失败信息

  //保证全部表单校验通过后再发请求
  await loginForms.value.validate()

  try {
    await useStore.userLogin(loginForm)
    //编程式导航，跳转到展示数据的首页
    // 判断路径当中是否有query参数，如果有就跳到query参数，如果没有就跳到首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    //登录成功提示信息

    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
      // duration:0
    })
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
      // message: '密码错误',
      // duration:100000
    })
  }
}

//自定义检验规则
const validatorUsername = (rules: any, value: any, callback: any) => {
  //rules是校检规则对象
  //value:表单元素文本内容
  // console.log(callback);
  if (value.length > 4) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
}

//定义表单检验需要配置的对象
const rules = {
  //规则对象属性:
  //required,代表这个字段务必要校验的
  //min:文本长度至少多少位
  //max:文本长度最多多少位
  //message:错误的提示信息
  //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
  username: [
    // {required:true,message:'用户不能为空',trigger:'blur'},
    // {required:true,min:5,max:10,message:'账号长度至少6位'}
    { trigger: 'change', validator: validatorUsername },
  ],
  password: [],
}

//封装一个函数，显示上午中午晚上
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 60px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>

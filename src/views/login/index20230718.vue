<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12">
        <div class="login-left" style="color: transparent"></div>
      </el-col>
      <el-col :span="12" style="height:100vh">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div class="title-container" style="text-align:center;">
            <!-- <img src="@/assets/login/logo.png" width="120px" height="120px"> -->

            <h1 class="title"><img src="@/assets/index/newLogoA.png" style="height: 30px;width: 30px;position: relative;top: 6px;"> 欢迎使用软件中心试点</h1>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="off"
            />
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="off"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-row style="margin-top:-15px;margin-bottom:10px">
            <el-col :span="12" style="border:1px solid transparent;">
              <!-- <router-link :to="{path:'/register'}" style="font-size: 14px;">注册</router-link> -->
            </el-col>
            <el-col :span="12" style="text-align:right;">
              <el-checkbox v-model="rememberPwd" style="font-size: 14px;color:rgb(33 31 31);">记住密码</el-checkbox>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <!-- <el-col :span="18">
              <el-button
                type="primary"
                style="margin-bottom: 30px;"
                @click.native.prevent="handleToLogin"
              >统一用户登录入口</el-button>
            </el-col> -->
            <el-col :span="12">
              <el-button type="primary" @click="goRegister"  style="margin-bottom: 10px;width:100%">注册</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                :loading="loading"
                type="primary"
                style="margin-bottom: 10px;width:100%"
                @click.native.prevent="handleLogin"
              >登录</el-button>
            </el-col>
          </el-row>
          <div style="height:20px;line-height:20px;margin-bottom: 20px;text-align:right;width:100%;" id="data">
            <el-image :src="require('@/assets/index/word.png')" style="height:12px; width:12px;top:3px" alt="使用规范"></el-image>
            <el-link href="../../../../data/软件使用规范.docx">
              <span style="font-size:12px;padding-left:2px;">使用规范</span>
            </el-link>
            <el-image :src="require('@/assets/index/google.png')" style="height:12px; width:12px;margin-left:10px;top:3px" alt="浏览器"></el-image>
            <el-link href="../../../../data/Chrome_61.0.3163.91.exe"><span style="font-size:12px;padding-left:2px;">浏览器</span></el-link>
          </div>
          <!-- <div style="position: relative">
            <div class="tips">
              <span>Username : admin</span>
              <span>Password : any</span>
            </div>
            <div class="tips">
              <span style="margin-right: 18px">Username : editor</span>
              <span>Password : any</span>
            </div>

            <el-button
              class="thirdparty-button"
              type="primary"
              @click="showDialog = true"
            >
              Or connect with
            </el-button>
          </div> -->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { validUsername } from '@/utils/validate'
import { getInfo } from '@/api/user'
import Md5 from 'js-md5'
import * as appConfig from '/public/config'
import { commonRoutes } from '../../router'
export default {
  name: 'Login',
  data() {
    // eslint-disable-next-line no-unused-vars
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于6个字符'))
      } else {
        callback()
      }
    }
    return {
      rememberPwd:false,
      loginForm: {
        username: null,
        password: null
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.$nextTick(()=>{
      this.$refs.username.focus();
    })
    this.getUserCookie();
  },
  mounted() {
    if (this.loginForm.userName === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    goRegister(){
      this.$router.push({
        path: '/register'
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleToLogin() {
      window.location.href = config.user_service_url + '?client_id=' + config.client_id + '&response_type=code&redirect_uri=' + config.redirect_uri + '&remoteIp=' + config.remote_ip
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if(!Cookies.get("rememberPwd") || (Cookies.get("password")!=this.loginForm.password) ){
            this.loginForm.password = Md5(this.loginForm.password)
          }
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              let roles = localStorage.getItem('roles');
              roles = JSON.parse(roles);
              let commonRoles = roles.filter((v) => ['admin', 'applicationUser', 'SHUser', 'SYUser', 'AFUser', 'XTUser'].includes(v))
              // 判断人员身份
              // if (this.$auth.hasRoleOr(['admin', 'applicationUser', 'SHUser', 'SYUser', 'AFUser', 'XTUser'])) {
              if (commonRoles && commonRoles.length>0) {
                localStorage.setItem('loginType', 'admin');
                this.$router.push({
                  // path: this.redirect || "/admin",
                  path: '/admin',
                  query: this.otherQuery
                })
              }
              else {
                localStorage.setItem('loginType', 'user');

                this.$router.push({
                  path: '/index',
                  // path: this.redirect || "/index",
                  query: this.otherQuery
                })
              }
              this.loading = false
              this.$message.success('登录成功')
              //cookie
              if(this.rememberPwd){
                Cookies.set("username",this.loginForm.username,{expires:30});
                Cookies.set("password",this.loginForm.password,{expires:30});
                Cookies.set("rememberPwd",this.rememberPwd,{expires:30});
              }else{
                Cookies.remove("username");
                Cookies.remove("password");
                Cookies.remove("rememberPwd");
              }
            })
            .catch((e) => {
              this.loading = false
              this.$message.error(e)
            })
        } else {
          // this.$message.error('登录失败')
          return false
        }
      })
    },
    getLoginUserInfo(token) {
      getInfo(token).then(response => {
        const userInfo = response.data
        localStorage.setItem('userInfo', userInfo)
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
    getUserCookie(){
      const username=Cookies.get("username");
      const password=Cookies.get("password");
      const rememberPwd=Cookies.get("rememberPwd");
      this.loginForm.username=username==undefined?this.loginForm.username :username;
      this.loginForm.password=password==undefined?this.loginForm.password :password;
      this.rememberPwd=rememberPwd==undefined?false :Boolean(rememberPwd);
    },
    download(val){
      switch(val){
        case 1:
          let url1='../../../../data/软件使用规范.docx';
          let link=document.createComment('a');
          link.href=url1;
          link.click();
          break;
        case 2:
          let url2='../../../../data/软件使用规范.docx';
          let link2=document.createComment('a');
          // link2.style.display='none';
          link2.href=url2;
          document.body.appendChild(link2);
          link2.click();
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  height: 100vh;
  background: url("~@/assets/login/login.png") center center fixed
    no-repeat;
  background-size: cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: black;
      height: 47px;
      caret-color: black;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #3b5975;
$light_gray: black;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-left {
    height: 100vh;
    // background: url("~@/assets/login/login2.png") no-repeat;
    // background-size: 100% 100%;
  }

  .login-form {
    position: relative;
    border-radius: 5px;
    width: 520px;
    max-width: 100%;
    padding: 40px 35px 0;
    margin: 0 auto;
    // margin-top: 160px;
    overflow: hidden;
    box-shadow: 0px 0px 15px rgba(0,0,0,.2);
    backdrop-filter: blur(1px);
    background: rgba(255,255,255,0.6);
    top:50%;
    transform: translateY(-50%);

  }

  .tips {
    font-size: 14px;
    color: black;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 35px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

<template>
  <div class="login-container">
    <div class="login-form-container" >
     <div 
     v-loading="true"
     element-loading-text="登录中..."
     element-loading-background="rgba(255,255,255,0.2)"
     ></div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
// import { getInfo,getCaptchaBase64, login, getUserServiceCodeUrl } from '@/api/user'
import { getToken, setToken } from '@/utils/auth' // get token from cookie
import * as user from '@/api/user'
import { commonRoutes } from '../../router'
export default {
  name: 'Login',
  data() {
   
    return {
      rememberPwd:false,
      loginForm: {
        username: null,
        password: null,
        uuid: null,
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      access_token: null,
      otherQuery: {},
      codeImage: "",
      token: null,
      code: null,
      redirect: null,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
          this.token = query.token;
          this.code = query.code;
        }
      },
      immediate: true
    },
  },
  created() {
    
  },
  async mounted() {
    if (window.location.href.indexOf('code=') !== -1) {
      await user.getUserServiceToken(window.location.href).then(response => {
          if (response.code === 200) {
            // setToken(response.data.token)
            // this.$router.push('/index')
            // console.log(response.data);
            if(response.data.userInfo.status==1) {
              this.$message.success('登录成功')
              setToken(response.data.token)
              
              // 统一用户
              this.$userServiceSocket.setLoginSession(response.data.accessToken, response.data.refreshToken, response.data.userConfig);
              this.$userServiceSocket.saveToken();
              
              this.$router.push('/index')
            }else{
              this.$message.error('请等待管理员审核')
              this.$router.push('/login')
            }
            
          }
        })
      } else if (window.location.href.indexOf('token=') !== -1) {
        const token = window.location.href.substring(window.location.href.indexOf('token=') + 6, window.location.href.indexOf('token=') + 45)
        await user.checkToken(this.token).then(response => {
          if (response.code === 200) {
             if(response.data.userInfo.status==1) {
              this.$message.success('登录成功')
              setToken(response.data.token)
              // this.$router.push('/index')
              
              // 统一用户
              this.$userServiceSocket.setLoginSession(response.data.accessToken, response.data.refreshToken, response.data.userConfig);
              this.$userServiceSocket.saveToken();
             
              // window.location.replace(url);
             
              this.$router.push({
                  path: this.redirect || "/index",
                  query: this.otherQuery
                 
              })
            }else{
              this.$message.error('请等待管理员审核')
              this.$router.push('/login')
            }
          }
      })
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
  
    
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true

          let loginData = Object.assign({}, this.loginForm)

          // if(!Cookies.get("rememberPwd") || (Cookies.get("password")!=this.loginForm.password) ){
          //   this.loginForm.password = Md5(this.loginForm.password)
          // }
          loginData.password = Md5(this.loginForm.password)
          this.$store.dispatch('user/login', loginData)
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
              this.getCaptchaBase64();
            })
        } else {
          // this.$message.error('登录失败')
          this.getCaptchaBase64();
          return false
        }
      })
    },
    getLoginUserInfo(token) {
      user.getInfo(token).then(response => {
        const userInfo = response.data
        localStorage.setItem('userInfo', userInfo)
      })
    },
   
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect' && cur !== 'token' && cur !== 'code') {
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
  background: url("~@/assets/login/theme1/background.png") center center fixed no-repeat;
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
      padding: 12px 5px 12px 0px;
      color: black;
      height: 32px;
      caret-color: black;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid #ebebeb;
    background:#fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #ebebeb;
$dark_gray: #ebebeb;
$light_gray: black;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form-container{
    height: 100%;
    width: 100%;
    margin: 0 auto;

    position: absolute;
    top:50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);

    
    
    div{
      height: 100%;
    }

    .el-form-item__content{
      background-color: #fff;
    }
  }

  >>> .el-loading-spinner {
    .el-loading-text{
      color: #fff
    }
    .path{
      stroke: #fff
    }
  }

 

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

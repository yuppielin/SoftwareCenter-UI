<template>
  <div class="register-container">
    <el-card class="usercard">
      <div slot="header" style="text-align:right;">
          <el-button type="text" icon="el-icon-error" @click="gotoLogin"></el-button>
      </div>
      <div style="text-align:center;font-size:28px;font-weight:600;margin:20px;">注册</div>
      <el-form name="userForm" ref="userForm" :model="userForm" label-position="top" :rules="rules">
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="用户名:" prop="username" >
            <el-input v-model="userForm.username" size="mini" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名:" prop="realname">
            <el-input v-model="userForm.realname" size="mini" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" prop="idcard">
            <el-input v-model="userForm.idcard" size="mini" placeholder="请输入身份证号" maxlength="18"></el-input>
          </el-form-item>
          <el-form-item label="军官证号:" prop="officerNum">
            <el-input v-model="userForm.officerNum" size="mini" maxlength="8" placeholder="请输入军官证号">
              <span slot="prepend">军字第</span>
              <span slot="append">号</span>
            </el-input>
          </el-form-item>
         
          <!-- <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="军官证号:" prop="officerNum">
                <el-input v-model="userForm.officerNum" size="mini" maxlength="8" placeholder="请输入军官证号">
                  <span slot="prepend">军字第</span>
                  <span slot="append">号</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="联系方式:" prop="tel">
                  <el-input v-model="userForm.tel" size="mini" maxlength="12" placeholder="请输入联系方式"></el-input>
                </el-form-item>
            </el-col>
          </el-row> -->
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码:" prop="password">
            <el-input v-model="userForm.password" size="mini" placeholder="请输入8位以上密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="repeatPwd">
            <el-input v-model="userForm.repeatPwd" size="mini" placeholder="请输入8位以上密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="所属单位:" prop="runit">
            <el-input v-model="userForm.runit" size="mini" placeholder="请输入所属单位，单位须为全称"></el-input>
          </el-form-item>
          <el-form-item label="联系方式:" prop="tel">
            <el-input v-model="userForm.tel" size="mini" maxlength="12" placeholder="请输入联系方式"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div style="color: #aaa;font-size: 12px;padding-top:10px;text-align: right;margin-bottom:30px">
          <!-- 审核联系人：王安歌；联系电话：0201-890081/15311026293(军用手机) -->
        </div>
        <el-form-item style="text-align:center">
          <el-button type="primary"  :loading="loading" @click="register">提  交</el-button>
        </el-form-item>
      </el-row>
      </el-form>
     
    </el-card>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { registerUser } from '@/api/user'
import Md5 from 'js-md5'
// import * as appConfig from '/public/config'
import user from '../../store/modules/user'
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
      } else if (value.length < 8) {
        callback(new Error('密码不能少于8个字符'))
      } else {
        callback()
      }
	}
	const equalToPassword = (rule, value, callback) => {
		if (this.userForm.password !== value) {
			callback(new Error('两次输入的密码不一致'))
		} else {
			callback();
		}
	};
    return {
      userForm: {
        username: null,
        realname:null,
        password: null,
        repeatPwd:null,
        tel:null,
        runit:null,
        officerNum:null,
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        realname: [
          { required: true, trigger: 'blur', message: '真实姓名不能为空' }
        ],
        idcard: [
          { required: true, message: '请输入身份证', trigger: 'blur' }, 
          { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证不合法', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        repeatPwd: [
          { required: true, trigger: 'blur', validator: equalToPassword }
        ],
        tel: [
          { required: true, trigger: 'blur', message: '联试方式不能为空' }
        ],
        runit: [
          { required: true, trigger: 'blur', message: '单位名称不能为空' }
        ],
        officerNum: [
          { required: true, trigger: 'blur', message: '军官证号不能为空'}
        ],
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
      // handler: function(route) {
      //   const query = route.query
      //   if (query) {
      //     this.redirect = query.redirect
      //     this.otherQuery = this.getOtherQuery(query)
      //   }
      // },
      // immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
 
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    gotoLogin(){
      this.$router.push({
        path:'/login'
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
    register(){
		this.$refs.userForm.validate(valid => {
			if (valid) {
        this.loading = true;
        let data = Object.assign({}, this.userForm)
        delete data.repeatPwd;
				registerUser(data).then((response)=>{
					// this.loading = true;
					if(response.code==200){
						this.$message.success(response.msg);
						this.gotoLogin();
					}else {
            this.$message.error(response.msg);
          }
				}).catch((err) => {
          this.loading = false;
        })
			}
		});
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
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  height: 100%;
  background: url("~@/assets/login/login.png") center center fixed no-repeat;
  background-size: cover;
  .el-card__header {
    padding: 0px 10px 0 0;
    border-bottom: 0px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-card__body{
    padding: 0 40px 20px 40px;
  }
  .usercard{
    width:60%;
    height: 620px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top:-280px;
    margin-left: -30%;
  }
  .el-input {
    height: 42px;
    border: 1px solid rgba(0,0,0,0.1);
    border-left: 5px solid rgba(59,89,117,1);
    border-radius: 5px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 5px;
      // padding: 12px 5px 12px 15px;
      padding: 0px 5px;
      color: black;
      height: 40px;
      caret-color: black;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-input-group__append, .el-input-group__prepend{
    border: 0px solid gray;
  }
  .el-input-group__prepend{
    padding: 0 5px;
  }
  // .el-form{
  //   max-width: 750px;
  //   margin: 0 auto;
  // }
  .el-form-item__label{
    padding: 0;
  }
}
</style>


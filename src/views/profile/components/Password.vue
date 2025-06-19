<template>
  <el-form ref="userForm" :model="userForm" :rules="rules">
    <el-form-item label="旧密码" prop="oldPwd">
      <el-input v-model="userForm.oldPwd" show-password autocomplete="off" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPwd">
      <el-input v-model="userForm.newPwd" show-password autocomplete="off" />
    </el-form-item>
    <el-form-item label="确认密码" prop="rePwd">
      <el-input v-model="userForm.rePwd" show-password autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit('userForm')">保存</el-button>
      <!-- <el-button type="info">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import * as user from '@/api/user'
import md5 from 'js-md5'
import { mapGetters } from 'vuex'
export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.userForm.newPwd !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback();
      }
    };
    return {
      userForm: {},
      rules: {
        oldPwd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
        ],
        rePwd: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.user.password !== md5(this.userForm.oldPwd)) {
            this.$message.warning('旧密码不正确')
          } else {
            this.$modal.loading();
            const userInfo = {
              id: this.user.id,
              password: md5(this.userForm.rePwd)
            }
            user.updateUserInfo(userInfo).then(response => {
              if (response.code === 200) {
                this.$cookies.remove('Admin-Token')
                this.$cookies.remove('JSESSIONID')
                // this.$store.commit('reset', '')
                // localStorage.clear()
                this.$store.dispatch('user/logout')
                localStorage.clear()
                sessionStorage.clear()
                this.$message({
                  message: '用户信息更新成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.$router.push({ path: '/login' })
               
              }
              this.$modal.closeLoading();
            })
          }
        }
      })
    }
  }
}
</script>

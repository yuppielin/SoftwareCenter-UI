<template>
  <el-form>
    <el-row :gutter="20">
      <el-col :span="12">
          <el-form-item label="真实姓名">
            <el-input v-model.trim="user.realname" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model.trim="user.idcard" maxlength="18" />
          </el-form-item>
         
      </el-col>
      <el-col :span="12">
        <el-form-item label="军官证号">
            <el-input v-model.trim="user.officerNum" />
        </el-form-item>
        <el-form-item label="座机电话">
          <el-input v-model.trim="user.tel" />
        </el-form-item>
        <!-- <el-form-item label="电子邮箱">
          <el-input v-model.trim="user.email" />
        </el-form-item> -->
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="submit" v-if="user.userId == null">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import * as user from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    submit() {
      const userInfo = {
        id: this.user.id,
        realname: this.user.realname,
        idcard: this.user.idcard,
        officerNum: this.user.officerNum,
        tel: this.user.tel
      }
      user.updateUserInfo(userInfo).then(response => {
        if (response.code === 200) {
          this.$emit('getUserInfo')
          this.$message({
            message: '用户信息更新成功',
            type: 'success',
            duration: 5 * 1000
          })
        }
      })
    }
  }
}
</script>

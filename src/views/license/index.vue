<template>
  <div class="container">
    <el-form ref="form" label-position="top" :model="form" label-width="80px" class="forms">
     
      <el-form-item label="授权码" prop="license" :rules="[{required:true,message:'授权码不能为空',trigger:'blur'}]">
         <el-input type="textarea" rows="12" v-model="form.license"></el-input>
      </el-form-item>

      <div style="color:rgb(101, 97, 97); margin-bottom:50px">
        机器码：{{ maCode }}
        （提供此机器码，用于生成授权码）
      </div>
      <el-form-item align="center">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as license from '@/api/license'
export default {
  name: 'license',
  data() {
    return {
      form:{
        license: ''
      },
      maCode: "",
    };
  },
  created() {
    this.getMaCode();
  },
  methods: {

    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            license.setLicense(this.form.license).then(response => {
              if (response.code === 200) {
                this.$modal.msgSuccess("授权设置成功");
                this.$router.push({
                  path: "/login"
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getMaCode() {
      license.getMaCode().then(response => {
        if (response.code === 200) {
          this.maCode = response.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
    height: 100vh;
    background: url("~@/assets/login/theme1/background.png") 50% fixed no-repeat;
    background-size: cover;
}
.forms {
  width:800px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  padding: 20px;
  background: rgba(255,255,255,0.5);
  border-radius: 6px;
}
::v-deep .el-textarea__inner{
  background-color: rgba(255,255,255,0.5);
}
</style>


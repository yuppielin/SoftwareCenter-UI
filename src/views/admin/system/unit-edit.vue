<template>
    <el-card style="margin:40px 20px 20px 20px;">
        <el-form name="unitForm" ref="unitForm" :model="unitForm" id="unitForm" label-position="right" label-width="100px"  :rules="rules">
                <el-form-item label="单位名称：" prop="name">
                    <el-input size="small" v-model="unitForm.name" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="单位标识：" prop="tag">
                    <el-input size="small" v-model="unitForm.tag" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="单位地址：" prop="address">
                    <el-input size="small" v-model="unitForm.address" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="负责人：" prop="chager">
                    <el-input size="small" v-model="unitForm.chager" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱：" prop="email">
                    <el-input size="small" v-model="unitForm.email" style="width:400px;" 
                    placeholder="user@address.cn"
                    @blur="email_blur"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone">
                    <el-input size="small" v-model="unitForm.phone" style="width:400px;" @blur="phoneCheck"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="background:#05994e;color:white" @click="submitForm('userForm')" size="small">保存</el-button>
                    <el-button type="info" @click="jumpToUser" size="small">关闭</el-button>
                </el-form-item>
        </el-form>
    </el-card>
</template>
<script>
export default {
    data(){
        var validateMailPass = (rule, value, callback) => {
            var verify = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
            if (!verify.test(value)) {
                callback(new Error('邮箱格式错误, 请重新输入'));
            } else {
                callback();
            }
        };
        var validatePhonePass = (rule, value, callback) => {
            var verify = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
            if (!verify.test(value)) {
                callback(new Error('手机格式错误,请重新输入'));
            } else {
                callback();
            }
        };
        return {
            unitForm:{
                name:'',
                tag:'',
                chager:'',
                phone:'',
                email:'',
                address:'',
            },
            rules:{
                name:[
                    {required:true,message:'所属单位不能为空',trigger:'blur'}
                ],
                tag:[
                    {required:true,message:'单位标识不能为空',trigger:'blur'}
                ],
                chager:[
                    {required:true,message:'负责人不能为空',trigger:'blur'},
                ],
                email: [
                    { validator: validateMailPass, trigger: 'blur' }
                ],
                phone: [
                    { validator: validatePhonePass, trigger: 'blur' }
                ],
            }
        }
    },
    methods:{
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      jumpToUser(){
          this.$router.push("/admin/system/unit")
      }
    }
}
</script>
<style scoped lang='scss'>
    .app-container{
         #unitForm{
             margin: 10px 20px 50px 20px;
         }
    }
</style>
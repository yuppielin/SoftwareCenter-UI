<template>
    <el-card style="margin:40px 20px 20px 20px;">
        <el-form name="userForm" ref="userForm" :model="userForm" label-position="right" label-width="120px" id="userForm" :rules="rules">
                <el-form-item label="用户名称：" prop="userName">
                    <el-input size="small" v-model="userForm.userName" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="真实名称：" prop="realName">
                    <el-input size="small" v-model="userForm.realName" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="所属单位：" prop="unit">
                    <el-select v-model="userForm.unit" size="small" 
                        style="width:400px;"
                        placeholder="用户单位"
                        filterable remote reserve-keyword >
                        <el-option label="中科院电子所" value="1"></el-option>
                        <el-option label="中科院光电所" value="2"></el-option>
                        <el-option label="中科院遥感所" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录密码：" prop="password">
                    <el-input size="small" v-model="userForm.password" style="width:400px;" type="password"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱：" prop="email">
                    <el-input size="small" v-model="userForm.email" style="width:400px;" 
                    placeholder="user@address.cn"
                    @blur="email_blur"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone">
                    <el-input size="small" v-model="userForm.phone" style="width:400px;" @blur="phoneCheck"></el-input>
                </el-form-item>
                <el-form-item label="用户头像：" prop="avatar">
                    <el-input size="small" v-model="userForm.avatar" style="width:400px;"></el-input>
                    <el-upload
                    class="upload-demo"
                    action="#">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
                    </el-upload>
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
                callback(new Error('手机格式错误，请重新输入'));
            } else {
                callback();
            }
        };
        return {
            userForm:{
                userName:'',
                realName:'',
                unit:'',
                phone:'',
                email:'',
                password:'',
                avatar:''
            },
            rules:{
                userName:[
                    {required:true,message:'用户名不能为空',trigger:'blur'}
                ],
                unit:[
                    {required:true,message:'所属单位不能为空',trigger:'change'}
                ],
                password:[
                    {required:true,message:'密码不能为空',trigger:'blur'},
                    {min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
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
          this.$router.push("/admin/system/user")
      }
    }
}
</script>
<style scoped lang='scss'>
    .app-container{
         #userForm{
             margin: 10px 20px 50px 20px;
         }
    }
</style>
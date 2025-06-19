<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="12">
        <div style="display: flex;align-items: center;height: 40px;">
          <img style="height:20px;width:20px;" src="@/assets/index/tsQuestion.png" />
          <span style="font-size:16px;font-weight:bold;margin-left:10px;">意见建议</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div
          style="display: flex;align-items: center;height: 40px;justify-content: right;justify-content: flex-end;"
        >
          <el-button icon="el-icon-back" size="small" onclick="history.go(-1)">返回</el-button>
        </div>
      </el-col>
    </el-row>
    <el-card style="height:calc(100vh - 180px);overflow-y:auto;padding:0 200px;">
       <el-form name="tsForm" ref="tsForm" :model="tsForm" label-position="top" id="suggest">
            <el-form-item prop="title" label="标题" :rules="[{required:true,message:'标题不能为空',trigger:'blur'}]">
                <el-input v-model="tsForm.title" size="small" placeholder="意见建议标题" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item prop="content" label="内容" :rules="[{required:true,message:'请填写意见和建议',trigger:'blur'}]">
               <el-input placeholder="意见建议内容"
                v-model="tsForm.content"
                size="small"
                :rows="25"
                :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]"
                type="textarea"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
            <el-form-item  style="text-align:center">
                <el-button size="small" type="primary" @click="replyConfirm">提交</el-button>
            </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>
<script>
import * as suggestion from "@/api/system-suggestion";


export default {
  components: {
  
  },
  data() {
    return {
      tsForm: {
        title: "",
        content: "",
      },
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
   
  },
  methods: {
    
    replyConfirm() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.$refs.tsForm.validate(valid => {
        if (valid) {
          this.$modal.loading();
          suggestion.addSuggestion(this.tsForm).then(response => {
            this.$modal.closeLoading();
            if (response.code === 200) {
              this.$message.success("提交成功，感谢您的反馈");
              this.$router.push({
                path: '/index/list',
              })
            }
          });
        }
      });
    },
  }
};
</script>
<style scoped lang="scss">
::v-deep #suggest .el-input__inner {
    color: #282829;
    font-size: 12px;
    border-color: lightgray !important;
}
::v-deep #suggest .el-textarea__inner {
    border-color: lightgray !important;
}
</style>

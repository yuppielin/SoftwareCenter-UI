<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="12">
        <div style="display: flex;align-items: center;height: 40px;">
          <img style="height:20px;width:20px;" src="@/assets/index/tsQuestion.png" />
          <span style="font-size:16px;font-weight:bold;margin-left:10px;">意见建议</span>
        </div>
      </el-col>
      <!-- <el-col :span="12">
        <div
          style="display: flex;align-items: center;height: 40px;justify-content: right;justify-content: flex-end;"
        >
          <el-button icon="el-icon-back" size="small" onclick="history.go(-1)">返回</el-button>
        </div>
      </el-col> -->
    </el-row>
    <el-card class="custome custome-height">
      <p>感谢您的反馈</p>
      <!-- <el-image :src=''></el-image> -->
      <div>
        <el-button>返回首页</el-button>
      </div>
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
      dialogVisible: false,


      uploadDialogVisible: false,
  
      avatar: "",
      defaultA: 'this.src="' + require("@/assets/index/avatar.png") + '"',
      
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
      this.$modal.loading();
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
     
      this.$refs.tsForm.validate(valid => {
        if (valid) {
          suggestion.addSuggestion(this.tsForm).then(response => {
            this.$modal.closeLoading();
            if (response.code === 200) {
              this.$message.success("提交成功，感谢您的反馈");
              this.dialogVisible = false;
              this.handleTsClick(this.currentTsQuestion);
              // this.$emit("getSoftwareTs");
              this.getTsQuestionList();
            }
          });
        }
      });
    },
    
    deleteSoftwareQuestion(item) {
      this.$confirm("确定删除该评论吗？", "提示", {
        type: "warning"
      }).then(e => {
        ts.delTsQuestion(item.id).then(response => {
          if (response.code === 200) {
            this.$emit("getSoftwareQuestion", this.flag);
            this.$message.success("删除成功");
          }
        });
      });
    },
  
   
    
    
  
  }
};
</script>
<style scoped>
::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;
  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
}
.ts-col-label {
  color: rgba(149, 149, 163, 1);
  font-size: 12px;
}
.ts-col-label > span {
  color: rgba(63, 63, 63, 1);
  font-size: 12px;
}
/deep/ .el-collapse-item__content {
  padding-bottom: 0px !important;
}
/deep/ .el-collapse .is-active .el-collapse-item__header,
/deep/ .el-collapse .is-active .el-collapse-item__content {
  background: rgba(23, 138, 227, 0.05);
}
/deep/ .el-collapse > .is-active {
  border-left: 2px solid rgba(23, 138, 227, 1);
}
.user-avatar {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 10px;
}
/deep/ .el-card__body {
  padding-bottom: 0px !important;
}
/deep/ .el-timeline-item__timestamp {
  color: rgba(23, 138, 227, 1);
}
/deep/ .el-timeline-item__node--normal {
  width: 20px;
  height: 20px;
  left: -5px;
}
/deep/ .el-button span {
  /*color: rgba(23,138,227,1);*/
}
.el-button--primary:active,
/deep/ .el-button--primary.is-active {
  color: #fff;
}
/deep/ .el-collapse {
  border-top: none;
  border-bottom: none;
}
/deep/ .btn-ts .el-button--text {
  color: rgba(86, 86, 86, 1);
}
</style>

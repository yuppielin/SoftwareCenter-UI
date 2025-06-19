<template>
  <div>
    <el-dialog title="软件上传" :visible.sync="yewuVisible">
      <el-card class="custome">
        <div>
          <span class="tips">提示:</span>
          <span class="tips">① 软件段上传，仅对符合指挥信息系统段封装技术体制标准的软件段进行上传/批量上传，自动提取段信息。</span>
          <span class="tips">② 软件上传，为未经过段封装打包工具封装的业务软件，仅支持单个上传。</span>
          <span class="tips">③ 资料上传，上传相关资料。</span>
        </div>
        <el-row :gutter="20" style="text-align: center;">
          <el-col :span="8">
            <div class="uploadClickCard">
              <el-card shadow="hover" @click.native="jumpToUploadSoftware('yewuduan')">
                <el-image
                  style="width: 150px; height: 150px"
                  :src="require('@/assets/code.png')"
                  fit="cover"
                ></el-image>
                <div class="subtitle">软件段上传</div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="uploadClickCard">
              <el-card
                shadow="hover"
                @click.native="jumpToUploadSoftware('yewu')"
              >
                <el-image
                  style="width: 150px; height: 150px"
                  :src="require('@/assets/code.png')"
                  fit="cover"
                ></el-image>
                <div class="subtitle">软件上传</div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="uploadClickCard">
              <el-card
                shadow="hover"
                @click.native="jumpToUploadSoftware('yewuziliao')"
              >
                <el-image
                  style="width: 150px; height: 150px"
                  :src="require('@/assets/code.png')"
                  fit="cover"
                ></el-image>
                <div class="subtitle">资料上传</div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-card>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      yewuVisible: false
    };
  },
  props: ["dialogVisible"],
  watch: {
    dialogVisible(newVal, oldVal) {
      console.log(newVal);
      this.yewuVisible = newVal;
    },
    yewuVisible(newVal, oldVal) {
      console.log(newVal);
      if (newVal === false) {
        this.$emit("closeDialog", false);
      }
    }
  },
  methods: {
    jumpToUploadSoftware(type) {
      if(type === "yewuduan") {
        localStorage.setItem("systemId", 0)
        this.$router.push({ path: "/admin/softwareUpload/applicationUpload" });
      }else if(type ==="yewuziliao"){
        localStorage.setItem("systemId", 0)
        this.$router.push({ path: "/admin/softwareUpload/applicationziliaoUpload" });
      }else {
        localStorage.setItem("systemId", 0)
        this.$router.push({ path: "/admin/softwareUpload/basicSoftwareUpload" });
      }
    }
  }
};
</script>
<style scoped>
.subtitle {
  font-size: large;
  font-weight: 600;
}

.el-card__body:hover {
  background: gray;
}

.uploadClickCard {
  cursor: pointer;
  border: 1px solid rgba(170, 168, 168, 0.5);
}

.uploadClickCard >>> .el-card.is-hover-shadow:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}
.custome{
  margin: 0px;
  max-height: calc(100vh - 100px);
}
::v-deep .el-card__body{
  padding-top: 0px;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
.tips{
  font-size: 12px;
  color:gray;
  line-height: 1.2;
  display: block;
  margin:10px 0;
}
</style>

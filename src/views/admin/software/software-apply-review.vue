<template>
  <el-card class="custome custome-height">
    <CloseBack></CloseBack>
    <el-form label-position="left" label-width="100px" style="padding:0 20px">
      <div class="titleS">软件信息</div>
      <el-divider />
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="软件名称：" prop="name">
            <span style="color: #a1a1a1;font-size:12px;">{{ software.name }}</span>
          </el-form-item>
          <el-form-item label="软件版本：" prop="version">
            <span style="color: #a1a1a1;font-size:12px;">{{ software.version }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="软件Logo：" prop="logo">
            <img :src="software.logo?logoAndPicUrl+software.logo:defaultImg" width="36" height="36" :onerror="defaultImg">
          </el-form-item>
          <el-form-item label="软件来源：" prop="" title="unit">
            <span style="color: #a1a1a1;font-size:12px;">{{ software.source }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="软件描述：" prop="description">
        <span style="color: #a1a1a1;font-size:12px;">{{ software.description }}</span>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <span class="title">
            <i class="el-icon-user" />
            申请人员
          </span>
          <span class="content">
            {{ software.applyUser }}
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">
            <i class="el-icon-menu" />
            申请单位
          </span>
          <span class="content" style="color: #a1a1a1">
            {{ software.applyUnit }}
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">
            <i class="el-icon-date" />
            申请时间
          </span>
          <span class="content">
            {{ parseTime(software.applyTime, '{y}-{m}-{d} {h}:{i}') }}
          </span>
        </el-col>
      </el-row>
      <el-divider />
      <div style="text-align:center;">
        <el-button size="small" type="primary" @click="downloadSoftwareApplyAudit(1)">通过</el-button>
        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
        >
          <div style="text-align:center">
            <el-input v-model="software.opinion" type="textarea" :rows="5" style="margin-bottom:10px;" show-word-limit maxlength="50" placeholder="填写驳回原因" />
            <div style="text-align:center;">
              <el-button size="small" type="primary" @click="downloadSoftwareApplyAudit(2)">确定</el-button>
            </div>
          </div>
          <el-button slot="reference" size="small" type="danger" style="margin-left: 10px" @click="rejectVisible=true">驳回</el-button>
        </el-popover>
        <el-button  size="small" type="info" style="margin-left: 10px" onclick="history.go(-1)">返回</el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script>
// import * as appConfig from '/public/config'
import * as software from '@/api/software'
export default {
  data() {
    return {
      rejectVisible: false,
      defaultImg: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"',
      software: {},
      globalUrl: '',
      userInfo: {},
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  mounted() {
    // this.software = JSON.parse(this.$route.query.softwareInfo)
    this.globalUrl = appConfig.config.url
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    if (this.$route.query.id){
      this.getDownloadSoftwareApplyData(this.$route.query.id);
    }

  },
  methods: {
    downloadSoftwareApplyAudit(state) {
      let data = {
        id: this.software.applyId,
        status: state,
        opinion: this.software.opinion
      }
      software.downloadSoftwareApplyAudit(data).then(response => {
        if (response.code === 200) {
          let msg = state ==1 ? '审核通过' : '驳回成功'
          this.$message.success(msg)
          this.$router.push('/admin/review/apply')
        }
      })
    },
    getDownloadSoftwareApplyData(id) {
      software.getDownloadSoftwareApplyData(id).then(response => {
        if (response.code === 200) {
          // this.$router.push('/admin/software/apply')
          this.software = response.data
        }
      })
    },
  }
}
</script>
<style  scoped>
    .title{
        font-size: 12px;
        font-weight: 600;
        color:#3b5975
    }
    .titleS{
        border-left: 4px #409eff solid;
        line-height: 40px;
        height: 40px;
        padding-left: 10px;
        font-size: 16px;
        background: #c5d7e9;
    }
    .content{
        color: gray;
        margin-left: 10px;
        font-size: 12px;
    }
    .el-divider--horizontal{
        margin:10px 0;
    }
    .el-form-item{
      margin-bottom: 5px;
    }
    [class^=el-icon-] {
      font-size: 12px;
    }
</style>

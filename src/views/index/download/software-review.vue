<template>
  <el-card class="software-item">
    <el-row style="text-align:center">
      <el-col :span="2">
        <img :src="data.logo?logoAndPicUrl+data.logo:defaultImg" width="60px" height="60px" :onerror="defaultImg">
      </el-col>
      <el-col :span="18" style="text-align:left;line-height:20px;">
        <router-link :underline="false" style="color:#3b5975;font-size:18px;margin-right:20px;" :to="{path:'/index/list/'+data.id,query:{version:data.version}}">{{ data.name }}</router-link>
        <div>
          <div style="display:inline-block;width:200px">
            软件类别：<span>{{ data.category }}</span>
          </div>
          <div style="display:inline-block;width:200px;margin-left:40px;">
            研制单位：<span>{{ data.devUnit }}</span>
          </div>
        </div>
        <div>
          软件描述：<span>{{ data.description }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div style="text-align:center">
<!--          <el-button size="small" style="background:rgb(12, 95, 46);color:white;margin-top:20px">通过申请</el-button>-->
          <el-button size="mini" type="primary" style="margin-top:20px" @click="handleCancelDownloadApply">取消申请</el-button>
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <div>
      版本：<span style="color:#3b5975;border:1px solid #3b5975;border-radius:2px;padding:2px 10px;">{{ data.version }}</span>
      <i class="el-icon-date" style="color:#3b5975;margin-left:40px;" />
      上传时间：<span>{{ data.ctime }}</span>
      <i class="el-icon-download" style="margin-left:40px;color:#3b5975;" />
      下载数量：<span>{{ data.downloadCon }}</span>
    </div>
  </el-card>
</template>
<script>
// import * as appConfig from '/public/config'
import * as software from '@/api/software'
export default {
  props: {
    data: {
      type: Object,
      default: null,
      required: true
    }
  },
  data() {
    return {
      selectedVersion: null,
      defaultImg: 'this.src="' + require('@/assets/index/software.png') + '"',
      globalUrl: '',
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  mounted() {
    this.globalUrl = appConfig.config.url
    const item = this.data
    if (item.version.length > 0) {
      this.selectedVersion = item.version[item.version.length - 1]
    }
  },
  methods: {
    handleVersionChange(version) {
      this.selectedVersion = version
    },
    handleCancelDownloadApply() {
      this.$confirm('确定取消 ' + this.data.name + ' 软件的下载申请吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        software.deleteDownloadSoftwareApply(this.data.applyId).then(response => {
          if (response.code === 200) {
            this.$emit('getDownloadApplyList', 0)
            this.$message.success('取消成功')
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
    .software-item{
        font-size: 12px;
        width: 99%;
        margin: 0 auto;
        margin-top:30px;
        ::v-deep .el-card__body{
            padding: 10px;
        }
        ::v-deep .el-button + .el-button{
            margin-left:0px;
        }
        ::v-deep .el-divider--horizontal{
            margin:10px 0;
        }
        span{
            color:rgb(161, 161, 161)
        }
    }
</style>

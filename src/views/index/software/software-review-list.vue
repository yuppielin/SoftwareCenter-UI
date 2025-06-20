<template>
  <el-card id="software-item">
    <el-row style="text-align:center">
      <el-col :span="2">
        <img :src="data.logo == null?defaultImg:logoAndPicUrl+data.logo" width="60px" height="60px" :onerror="defaultImg">
      </el-col>
      <el-col :span="18" style="text-align:left;line-height:20px;">
        <router-link :underline="false" style="color:rgb(8, 151, 151);font-size:18px;margin-right:20px;" :to="{path:'/index/list/'+data.id,query:{version:data.version}}">< {{ data.identity }} >{{ data.name }}</router-link>
        <span style="border:1px solid lightgray;color:gray;border-radius:4px;padding:2px 15px;">待管理员审核</span>
        <div>
          软件类别：<span>{{ data.category }}</span>
        </div>
        <div>
          软件描述：<span>{{ data.description }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div style="text-align:center">
          <el-button size="small" style="background:#05994e;color:white;margin-top:20px" @click="deleteSoftwareVersion">删除软件</el-button>
          <el-button size="small" style="background:#05994e;color:white;margin-left: 10px" @click="goToUploadPage">继续上传</el-button>
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <div>
      版本：<span style="color:#3b5975;border:1px solid #3b5975;border-radius:2px;padding:2px 10px;">{{ data.version }}</span>
      <i class="el-icon-date" style="color:rgb(8, 151, 151);margin-left:40px;" />
      上传时间：<span>{{ data.ctime }}</span>
      <i class="el-icon-download" style="margin-left:40px;color:rgb(8, 151, 151);" />
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
      defaultImg: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"',
      logoUrl: '',
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  watch: {
    data() {
      const item = this.data
      this.selectedVersion = item.version
    }
  },
  mounted() {
    // let sss  = this.data
    // this.logoUrl = appConfig.config.url + this.data.logo
  },
  methods: {
    handleVersionChange(version) {
      this.selectedVersion = version
    },
    goToUploadPage() {
      this.$router.push({
        path: '/index/software/fragment-upload',
        query: { step: this.data.uploadStatus }
      })
      window.localStorage.setItem('softwareData', JSON.stringify(this.data))
    },
    deleteSoftwareVersion() {
      this.$confirm('确定删除软件 ' + this.data.name + ' 的 ' + this.data.version + ' 版本吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        software.deleteSoftwareVersion(this.data.versionId).then(response => {
          if (response.code === 200) {
            this.$message.success('删除成功')
            this.$emit('getAuditSoftwareList')
          } else {
            this.$message.error(response.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
    #software-item{
        font-size: 12px;
        margin: 5px 0;
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
        i{color: #3b5975;}
    }
</style>

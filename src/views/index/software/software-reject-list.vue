<template>
  <el-card id="software-item">
    <el-row style="text-align:center">
      <el-col :span="2">
        <img :src="data.logo == null?defaultImg:logoAndPicUrl+data.logo" width="60px" height="60px" style="z-index:0" :onerror="defaultImg">
        <div class="reject" />
      </el-col>
      <el-col :span="10" style="text-align:left;line-height:20px;">
        <router-link :underline="false" style="color:rgb(8, 151, 151);font-size:18px;margin-right:20px;" :to="{path:'/index/list/'+data.id,query:{version:data.version}}">< {{ data.identity }} >{{ data.name }}</router-link>
        <div>
          软件类别：<span>{{ data.category }}</span>
        </div>
        <div>
          软件描述：<span>{{ data.description }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="border:1px solid red;margin:auto 20px;">
          驳回原因：
          <span v-if="data.opinion">
            {{ data.opinion }}
          </span>
          <span v-else>
            暂无
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div style="text-align:center">
          <el-button size="small" style="background:#05994e;color:white;margin-top:20px" @click="deleteSoftwareVersion">删除软件</el-button>
          <el-button size="small" style="background:#05994e;color:white;margin-left: 10px" @click="updateSoftware">重新申请</el-button>
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <div>
      版本：<span style="color:green;border:1px solid green;border-radius:2px;padding:2px 10px;">{{data.version}}</span>
      <i class="el-icon-date" style="color:rgb(8, 151, 151);margin-left:40px;" />
      上传时间：<span>{{ data.ctime }}</span>
      <i class="el-icon-download" style="margin-left:40px;color:rgb(8, 151, 151);" />
      下载数量：<span>{{ data.downloadCon }}</span>
    </div>
  </el-card>
</template>
<script>
import * as software from '@/api/software'
// import * as appConfig from '/public/config'
export default {
  props: {
    data: {
      type: Object,
      default: null,
      required: true,
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  data() {
    return {
      selectedVersion: null,
      defaultImg: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"'
    }
  },
  mounted() {
    const item = this.data
    if (item.version.length > 0) {
      this.selectedVersion = item.version[item.version.length - 1]
    }
  },
  watch: {
    data() {
      const item = this.data
      this.selectedVersion = item.version
    }
  },
  methods: {
    handleVersionChange(version) {
      this.selectedVersion = version
    },
    updateSoftware() {
      this.$router.push(
        {
          path: '/index/software/fragmentedit/',
          query: {
            id: this.data.id,
            version: this.data.version
          }
        })
    },
    deleteSoftwareVersion() {
      this.$confirm('确定删除软件 ' + this.data.name + ' 的 ' + this.data.version + ' 版本吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        software.deleteSoftwareVersion(this.data.versionId).then(response => {
          if (response.code === 200) {
            this.$message.success('删除成功')
            this.$emit('getRejectSoftwareList')
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
        .reject{
            background-image: url('../../../assets/index/reject.png');
            z-index: 100;
            width: 70px;
            height: 70px;
            background-size: cover;
            position: absolute;
            top:0;
            left: 5px;
        }
        span{
            color:rgb(161, 161, 161)
        }
    }
</style>

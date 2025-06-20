<template>
  <el-card id="software-item">
    <el-row style="text-align:center">
      <el-col :span="2">
        <img :src="data.logo == null?defaultImg:logoAndPicUrl+data.logo" width="60px" height="60px" :onerror="defaultImg">
      </el-col>
      <el-col :span="18" style="text-align:left;line-height:20px">
        <router-link :underline="false" style="color:rgb(8, 151, 151);font-size:18px" :to="{path:'/index/list/'+data.id,query:{version:data.version}}">< {{ data.identity }} >{{ data.name }}</router-link>
        <div style="margin-top:10px">
          <div style="width:200px;display:inline-block;">
            软件版本：
            <el-select v-model="selectedVersion" size="mini" style="width:100px" @change="handleVersionChange">
              <el-option v-for="(version,index) in data.versions" :key="index" :value="version.version" :label="version.version">{{ version.version }}</el-option>
            </el-select>
          </div>
          <div style="width:200px;display:inline-block;margin-left:40px;">
            软件类别：<span>{{ data.category }}</span>
          </div>
        </div>
        <div>
          软件描述：<span>{{ data.description }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div style="text-align:center">
          <el-button size="small" style="background:#05994e;color:white;margin-top:20px" @click="deleteSoftwareVersion">删除软件</el-button>
          <el-button size="small" style="background:#05994e;color:white;margin-left: 10px" @click="updateSoftware">版本升级</el-button>
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <div>
      <div style="width:200px;display:inline-block;">
        <i class="el-icon-date" style="color:rgb(8, 151, 151);" />
        上传时间：<span>{{ data.ctime }}</span>
      </div>
      <div style="width:200px;display:inline-block;margin-left:20px;">
        <i class="el-icon-download" style="color:rgb(8, 151, 151);" />
        下载数量：<span>{{ data.downloadCon }}</span>
      </div>
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
      required: true
    }
  },
  data() {
    return {
      selectedVersion: '',
      defaultImg: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"',
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
    this.selectedVersion = this.data.version
  },
  methods: {
    handleVersionChange(version) {
      this.selectedVersion = version
      this.data.versions.forEach(item => {
        if (item.version === version) {
          this.data.ctime = item.ctime
          this.data.versionId = item.id
          this.data.description = item.description
        }
      })
    },
    updateSoftware() {
      this.$router.push(
        {
          path: '/index/software/fragmentedit/',
          query: {
            id: this.data.id,
            isUpdate: true,
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
            this.$emit('getSoftwareList')
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
    }
</style>

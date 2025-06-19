<template>
  <div class="dashboard-editor-container">
    <div style="margin-bottom:10px;">
      <span style="font-size:20px;"> 系统首页</span>
      <span class="subTitle">更新时间: {{updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row :gutter="10">
            <el-col :span="6">
              <el-card style="background:linear-gradient(92.2000487247347deg, rgba(0, 110, 255, 1) 40%, rgba(24, 144, 255, 1) 100%)" class="topCard">
                <div class="topTitle">月上传数</div>
                <div class="topNum">{{topShow.monthUploadSoftwareNum}}</div>
                <div class="topTitle">
                  较上月
                  <i class="el-icon-caret-bottom"></i>
                  {{topShow.upload_probability}}
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card style="background: linear-gradient(-62.24145939894deg, rgba(26, 223, 140, 1) 0%, rgba(25, 185, 89, 1) 100%);" class="topCard"> 
                <div class="topTitle">待检测数</div>
                <div class="topNum" style="text-align:right;margin-top:-15px">{{topShow.unDetectionSoftwareNum}}</div>
                <div class="topTitle">待发布数</div>
                <div class="topNum" style="text-align:right;margin-top:-15px">{{topShow.unReleaseNum}}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card style="background: linear-gradient(-62.24145939894deg, rgba(235, 157, 12,1) 0%, rgba(153, 123, 67,1) 100%);" class="topCard">
                <div class="topTitle">本月新发布</div>
                <div class="topNum">{{topShow.month_new_release_num}}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card style="background: linear-gradient(-62.24145939894deg, rgba(155, 9, 192,1) 0%, rgba(85, 44, 95,1)  100%);" class="topCard">
                <div class="topTitle">月下载数</div>
                <div class="topNum">{{topShow.monthDownloadSoftwareNum}}</div>
                <div class="topTitle">
                  较上月
                  <i class="el-icon-caret-bottom"></i>
                  {{topShow.download_probability}}
                </div>
              </el-card>
            </el-col>
        </el-row>
         <ChinaMap style="width:100%"/>
      </el-col>
      <el-col :span="8">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card header="热门下载（月）" class="hotCard">
                  <el-table :data="hotData" :show-header="false" size="mini">
                    <el-table-column>
                        <template slot-scope="scoped">
                            <div :style="{'color':scoped.$index==0?'red':scoped.$index==1?'#F57323':scoped.$index==2?'#DFB20A':'black'}">
                              <span >{{scoped.$index+1}}</span>
                              <span class="hotTitle">{{scoped.row.softwareName}}</span>
                            </div>
                            <el-row>
                              <el-col :span="12">
                                <span style="color: rgba(0, 0, 0, 0.65);font-size:12px;">{{scoped.row.downloadCon}}次</span>
                              </el-col>
                              <el-col :span="12" style="text-align:right">
                                <el-button type="text" size="mini" @click="downloadSoftware(scoped.row.versionId)">下载</el-button>
                              </el-col>
                            </el-row>
                            <!-- <div style="font-size:12px;">
                              {{scoped.row.offerUnit}}  上传
                            </div> -->
                            <div  class="hotDesc" v-show="scoped.$index<3">
                              {{scoped.row.description}}
                            </div>
                        </template>
                    </el-table-column>
                  </el-table>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card header="热门讨论（月）" class="hotCard">
                <el-table :data="hotTs" :show-header="false" size="mini">
                    <el-table-column>
                        <template slot-scope="scoped">
                            <div :style="{'color':scoped.$index==0?'red':scoped.$index==1?'#F57323':scoped.$index==2?'#DFB20A':'black'}" >
                              <span >{{scoped.$index+1}}</span>
                              <span class="hotTitle">{{scoped.row.softwareName}}</span>
                            </div>
                            <div style="text-align:right">
                              <el-button type="text" size="mini" @click="jumpToSoftware(scoped.row.softwareId, scoped.row.versionId)">去看看</el-button>
                            </div>
                            <div  class="hotDesc" v-show="scoped.$index<3">
                              {{scoped.row.description}}
                            </div>
                        </template>
                    </el-table-column>
                  </el-table>
              </el-card>
            </el-col>
          </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import ChinaMap from './components/china/chinaMap'
import * as analysis from "@/api/analysis"
import * as software from '@/api/software'
export default {
  name: 'DashboardAdmin',
  components: {
    ChinaMap:()=>import('./components/china/chinaMap')
  },
  data() {
    return {
        hotData:[],
        hotTs:[],
        topShow: {
          monthUploadSoftwareNum: 0,
          monthDownloadSoftwareNum: 0,
          unReleaseNum: 0,
          download_probability: "-100.00%",
          upload_probability: "-100.00%",
          month_new_release_num: 0,
          unDetectionSoftwareNum: 4
        },
        updateTime: null,
        userInfo: null
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.updateTime = new Date()
    this.getSystemData()
    this.hotDownload()
    this.hotDiscuss()
  },
  methods: {
    downloadSoftware(versionId) {
      // software.downloadSoftware(this.userInfo.userId,versionId).then(response => {
      //   if (response.code === 200) {
      //     window.location.href = response.data
      //   }
      // })
      software.downloadSoftwareFile(this.userInfo.userId, versionId);
    },
    getSystemData() {
      analysis.getSystemData().then(response => {
        if(response.code == 200){
          this.topShow = response.data
        }
      })
    },
    hotDownload() {
      analysis.hotDownload(10).then(response => {
        if(response.code == 200){
          this.hotData = response.data.list
        }
      })
    },
    hotDiscuss() {
      analysis.hotDiscuss(10).then(response => {
        if(response.code == 200){
          this.hotTs = response.data.list
        }
      })
    },
    jumpToSoftware(id, versionId) {
      this.$router.push({
        path: "/admin/softwareDetail/" + id,
        query:{
          version: versionId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.topCard{
  font-family: 'Microsoft YaHei ', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  font-style: normal;
  height: 140px;
  .topTitle{
    color:#EFEFEF;
    font-size:14px;
    line-height: 25px;
    height: 25px;
    font-weight: 400;
  }
  .topNum{
    font-weight: 700;
    font-style: normal;
    font-size: 30px;
    color: #FFFFFF;
    line-height: 38px;
    margin:10px 0;
  }
}
::v-deep .hotCard{
  height: calc(100vh - 140px);
  overflow-y:auto;
  .hotTitle{
    margin-left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 600;
    width: 170px;
    display: inline-flex;
  }
  .hotDesc{
    color:#7C7C7C;
    font-size:12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 40px;
    max-height: 40px;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
  }
  .el-table th.is-leaf, .el-table td {
    border-bottom: 0px solid #dfe6ec;
  }
}
.subTitle{
  font-size:14px;
  margin-left: 20px;
  color:rgba(0, 0, 0, 0.45)
}
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;
  // margin-top: 70px;
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

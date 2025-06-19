<template>
  <div class="dashboard-editor-container">
    <div style="margin-bottom:10px;">
      <span style="font-size:20px;">综合展示</span>
      <span class="subTitle">更新时间: {{updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
    </div>
    <el-row style="display: flex;">
      <div style="width: 25%">
        <el-card class="topCard topCard-2">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview1.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="16">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">本月新发布数</span>
                <br />
                <span style="font-size: 40px;line-height: 40px;">{{ topShow.month_new_release_num }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div style="width: 25%">
        <el-card class="topCard topCard-3">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview2.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="16">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">待审核数</span>
                <br />
                <span style="font-size: 40px;line-height: 40px;">{{ topShow.unReleaseNum }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <!-- <div style="width: 20%">
        <el-card class="topCard topCard-4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview3.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="16">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">待检测数</span>
                <br />
                <span
                  style="font-size: 40px;line-height: 40px;"
                >{{ topShow.unDetectionSoftwareNum }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div> -->
      <div style="width: 25%">
        <el-card class="topCard topCard-5">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview4.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="8">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">月上传数</span>
                <br />
                <span
                  style="font-size: 40px;line-height: 40px;"
                >{{ topShow.monthUploadSoftwareNum }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="margin-top: 50%;">
                较上月
                <br />
                <img
                  v-if="topShow.upload_probability.indexOf('+')!=-1"
                  :src="require('@/assets/index/up.png')"
                />
                <img
                  v-if="topShow.upload_probability.indexOf('-')!=-1"
                  :src="require('@/assets/index/down.png')"
                />
                {{topShow.upload_probability}}
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div style="width: 25%">
        <el-card class="topCard topCard-6">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview5.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="8">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">月下载数</span>
                <br />
                <span
                  style="font-size: 40px;line-height: 40px;"
                >{{ topShow.monthDownloadSoftwareNum }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="margin-top: 50%;">
                较上月
                <br />
                <img
                  v-if="topShow.download_probability.indexOf('+')!=-1"
                  :src="require('@/assets/index/up.png')"
                />
                <img
                  v-if="topShow.download_probability.indexOf('-')!=-1"
                  :src="require('@/assets/index/down.png')"
                />
                {{topShow.download_probability}}
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-row>
    <el-row style="display: flex; flex-wrap: wrap;">
      <!-- 运行生态分析视图 -->
      <div style="width: 50%">
        <el-card style="margin: 10px;height:340px;">
          <div slot="header" class="padding">
            <img src="@/assets/index/hotData.png" width="16" height="16" />
            &nbsp;
            <span>运行生态分析视图</span>
          </div>
          <line-chart :options="lineChartData"></line-chart>
        </el-card>
      </div>
      
      <!-- 开发生态分析视图 -->
      <div style="width: 50%">
        <el-card style="margin: 10px;height:340px;">
          <div slot="header" class="padding">
            <img src="@/assets/index/hotDission.png" width="16" height="16" />
            &nbsp;
            <span>开发生态分析视图</span>
          </div>
          <pie-chart :data="pieChartData" height="290px"></pie-chart>
        </el-card>
      </div>
      
      <!-- 下载排行榜 -->
      <div style="width: 50%">
        <el-card style="margin: 10px;height:450px;">
          <div slot="header"  class="padding">
            <img src="@/assets/index/hotData.png" width="16" height="16" />
            &nbsp;
            <span>下载排行榜（月度）</span>
          </div>
          <el-table :data="hotData" :show-header="false">
            <el-table-column width="80px" align="center">
              <template slot-scope="scoped">
                <img v-if="scoped.$index+1==1" src="@/assets/index/1.png" width="20" height="20" />
                <img
                  v-else-if="scoped.$index+1==2"
                  src="@/assets/index/2.png"
                  width="20"
                  height="20"
                />
                <img
                  v-else-if="scoped.$index+1==3"
                  src="@/assets/index/3.png"
                  width="20"
                  height="20"
                />
                <span v-else>{{ scoped.$index+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="softwareName" show-overflow-tooltip>
              <template slot-scope="scoped">
                <el-link @click="downloadSoftware(scoped.row.versionId)">{{scoped.row.softwareName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-progress
                  class="hotpercentage"
                  :show-text="false"
                  :percentage="scope.$index*10"
                  color="#e6ebf5"
                  style="define-back-color:blue"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      
      <!-- 热门讨论 -->
      <div style="width: 50%">
        <el-card style="margin: 10px;height:450px;">
          <div slot="header"  class="padding">
            <img src="@/assets/index/hotDission.png" width="16" height="16" />
            &nbsp;
            <span>热门讨论（月度）</span>
          </div>
          <el-table :data="hotTs" :show-header="false">
            <el-table-column width="80px" align="center">
              <template slot-scope="scoped">
                <img v-if="scoped.$index+1==1" src="@/assets/index/1.png" width="20" height="20" />
                <img
                  v-else-if="scoped.$index+1==2"
                  src="@/assets/index/2.png"
                  width="20"
                  height="20"
                />
                <img
                  v-else-if="scoped.$index+1==3"
                  src="@/assets/index/3.png"
                  width="20"
                  height="20"
                />
                <span v-else>{{ scoped.$index+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="softwareName" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" width="100px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="jumpToSoftware(scope.row.softwareId, scope.row.versionId)"
                >去看看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-row>
  </div>
</template>

<script>
// import ChinaMap from './components/china/chinaMap'
import * as analysis from "@/api/analysis";
import * as software from "@/api/software";
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'

export default {
  name: "DashboardAdmin",
  components: {
    ChinaMap: () => import("./components/china/chinaMap"),
    LineChart,
    PieChart
  },
  data() {
    return {
      hotData: [],
      hotTs: [],
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
      userInfo: null,
      mapNum: 0,
      isMap: false,
      // 添加线形图数据
      lineChartData: {
        xAxis: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
        expectedData: [30, 32, 35, 38, 36, 40, 42], // CPU使用率
        actualData: [50, 52, 55, 52, 55, 58, 60],   // 内存使用率
        networkData: [10, 12, 15, 12, 15, 17, 18]   // 网络流量
      },
      // 添加饼图数据
      pieChartData: [
        { value: 320, name: 'JavaScript' },
        { value: 240, name: 'Python' },
        { value: 149, name: 'Java' },
        { value: 100, name: 'C++' },
        { value: 490, name: 'Go' }
      ]
    };
  },
  mounted() {
    this.mapNum = Math.random()
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.updateTime = new Date();
    this.getSystemData();
    this.hotDownload();
    this.hotDiscuss();
  },
  methods: {
    resetMap(){
      //this.$refs.ChinaMap.drawChinaMap();
      //console.log("==============",this.$refs.ChinaMap)
      this.$refs.ChinaMap.drawChinaMap('chinaMap')
      console.log("==============",this.$refs.ChinaMap.drawChinaMap('chinaMap'))
    },
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
        if (response.code == 200) {
          this.topShow = response.data;
        }
      });
    },
    hotDownload() {
      analysis.hotDownload(10).then(response => {
        if (response.code == 200) {
          this.hotData = response.data.list;
        }
      });
    },
    hotDiscuss() {
      analysis.hotDiscuss(5).then(response => {
        if (response.code == 200) {
          this.hotTs = response.data.list;
        }
      });
    },
    jumpToSoftware(id, versionId) {
      this.$router.push({
        path: "/admin/softwareDetail/" + id,
        query: {
          version: versionId
        }
      });
    }
  }
};
</script>
<style>
.hotpercentage /deep/ .el-progress-bar__outer {
  background-color: #05994e;
}
</style>
<style lang="scss" scoped>
.topCard {
  margin: 10px;
  height: 140px;
}

::v-deep .hotCard {
  height: calc(100vh - 140px);
  overflow-y: auto;
  .hotTitle {
    margin-left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 600;
    width: 170px;
    display: inline-flex;
  }
  .hotDesc {
    color: #7c7c7c;
    font-size: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 40px;
    max-height: 40px;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
  }
  .el-table th.is-leaf,
  .el-table td {
    border-bottom: 0px solid #dfe6ec;
  }
}
.subTitle {
  font-size: 14px;
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.45);
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

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.padding {
  img {
    position: relative;
    top:3px
  }
  .span {

   }
}
</style>

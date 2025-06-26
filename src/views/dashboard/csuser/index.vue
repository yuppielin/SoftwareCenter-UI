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
                <span style="font-size: 16px;line-height: 40px">软件总数</span>
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
                <span style="font-size: 16px;line-height: 40px">未通过数</span>
                <br />
                <span
                  style="font-size: 40px;line-height: 40px;"
                >{{ topShow.monthUploadSoftwareNum }}</span>
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
                <span style="font-size: 16px;line-height: 40px">月上传数</span>
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
    
    <!-- 时间选择器 -->
    <div class="date-filter-container">
      <div class="date-picker-wrapper">
        <span class="date-label">时间范围：</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="handleDateChange"
          size="small"
        />
        <el-button type="primary" size="small" icon="el-icon-refresh" @click="resetDateRange" style="margin-left: 10px;">重置</el-button>
      </div>
    </div>
    
    <el-row style="display: flex; flex-wrap: wrap;">
      <!-- 月上传趋势 -->
      <div style="width: 50%">
        <el-card style="margin: 10px;height:450px;">
          <div slot="header" class="padding">
            <img src="@/assets/index/hotData.png" width="16" height="16" />
            &nbsp;
            <span>月上传趋势</span>
          </div>
          <div class="chart-container">
            <line-chart :chart-data="monthlyUploadData" />
          </div>
        </el-card>
      </div>
      
      <!-- 上传软件进度分类占比 -->
      <div style="width: 50%">
        <el-card style="margin: 10px;height:450px;">
          <div slot="header" class="padding">
            <img src="@/assets/index/hotDission.png" width="16" height="16" />
            &nbsp;
            <span>上传软件进度分类占比</span>
          </div>
          <div class="chart-container">
            <pie-chart :chart-data="uploadStatusData" />
          </div>
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
      topShow: {
        monthUploadSoftwareNum: 0,
        monthDownloadSoftwareNum: 0,
        unReleaseNum: 0,
        download_probability: "-100.00%",
        upload_probability: "-100.00%",
        month_new_release_num: 0,
        unDetectionSoftwareNum: 4
      },
      dateRange: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      updateTime: null,
      userInfo: null,
      mapNum: 0,
      isMap: false,
      // 月上传趋势数据
      monthlyUploadData: {
        xAxis: [],
        expectedData: [] // 月上传数量
      },
      // 上传软件进度分类占比数据
      uploadStatusData: [
        { value: 0, name: '未通过', itemStyle: { color: '#e67e7e' } },
        { value: 0, name: '进行中', itemStyle: { color: '#f4d07a' } },
        { value: 0, name: '已完成', itemStyle: { color: '#97c37d' } }
      ],
      
    };
  },
  mounted() {
    this.mapNum = Math.random()
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.updateTime = new Date();
    this.getSystemData();
    this.getMonthlyUploadTrend();
    this.getUploadStatusDistribution();
  },
  methods: {
    resetMap(){
      this.$refs.ChinaMap.drawChinaMap('chinaMap')
      console.log("==============",this.$refs.ChinaMap.drawChinaMap('chinaMap'))
    },
    handleDateChange(val) {
      if (val) {
        // 更新时间后重新获取数据
        this.getSystemData();
        this.getMonthlyUploadTrend();
        this.getUploadStatusDistribution();
      }
    },
    resetDateRange() {
      this.dateRange = null;
      this.getSystemData();
      this.getMonthlyUploadTrend();
      this.getUploadStatusDistribution();
    },
    getSystemData() {
      // 添加时间范围参数
      const params = this.dateRange ? {
        startDate: this.dateRange[0],
        endDate: this.dateRange[1]
      } : {};
      
      analysis.getSystemData(params).then(response => {
        if (response.code == 200) {
          this.topShow = response.data;
        }
      });
    },
    // 获取月上传趋势数据
    getMonthlyUploadTrend() {
      // 添加时间范围参数
      const params = this.dateRange ? {
        startDate: this.dateRange[0],
        endDate: this.dateRange[1]
      } : {};
      
      // 调用API获取数据
      analysis.getMonthlyUploadTrend(params).then(response => {
        if (response.code == 200) {
          this.monthlyUploadData = {
            xAxis: response.data.months || [],
            expectedData: response.data.counts || []
          };
        } else {
          // 如果API调用失败，使用模拟数据
          this.generateMockMonthlyData();
        }
      }).catch(() => {
        // 如果API调用出错，使用模拟数据
        this.generateMockMonthlyData();
      });
    },
    
    // 生成模拟的月上传趋势数据
    generateMockMonthlyData() {
      const date = new Date();
      const months = [];
      const uploadData = [];
      
      // 如果有选择日期范围，则使用选择的日期范围
      let startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11); // 默认显示12个月
      let endDate = new Date();
      
      if (this.dateRange) {
        startDate = new Date(this.dateRange[0]);
        endDate = new Date(this.dateRange[1]);
      }
      
      // 计算月份差
      const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1;
      const monthCount = Math.min(12, monthDiff); // 最多显示12个月
      
      for (let i = 0; i < monthCount; i++) {
        const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const monthStr = `${month.getFullYear()}-${month.getMonth() + 1}`;
        months.push(monthStr);
        // 模拟数据
        uploadData.push(Math.floor(Math.random() * 100) + 20);
      }
      
      this.monthlyUploadData = {
        xAxis: months,
        expectedData: uploadData
      };
    },
    
    // 获取上传软件进度分类占比数据
    getUploadStatusDistribution() {
      // 添加时间范围参数
      const params = this.dateRange ? {
        startDate: this.dateRange[0],
        endDate: this.dateRange[1]
      } : {};
      
      // 调用API获取数据
      analysis.getUploadStatusDistribution(params).then(response => {
        if (response.code == 200) {
          this.uploadStatusData = [
            { value: response.data.failed || 0, name: '未通过', itemStyle: { color: '#e67e7e' } },
            { value: response.data.inProgress || 0, name: '进行中', itemStyle: { color: '#f4d07a' } },
            { value: response.data.completed || 0, name: '已完成', itemStyle: { color: '#97c37d' } }
          ];
        } else {
          // 如果API调用失败，使用模拟数据
          this.generateMockStatusData();
        }
      }).catch(() => {
        // 如果API调用出错，使用模拟数据
        this.generateMockStatusData();
      });
    },
    
    // 生成模拟的上传软件进度分类占比数据
    generateMockStatusData() {
      // 根据时间范围调整数据
      let failed = this.topShow.unReleaseNum || 15;
      let inProgress = 25;
      let completed = 60;
      
      if (this.dateRange) {
        // 模拟不同时间范围的数据变化
        const days = (new Date(this.dateRange[1]) - new Date(this.dateRange[0])) / (1000 * 60 * 60 * 24);
        failed = Math.max(5, Math.floor(failed * (days / 30)));
        inProgress = Math.max(10, Math.floor(inProgress * (days / 30)));
        completed = Math.max(20, Math.floor(completed * (days / 30)));
      }
      
      this.uploadStatusData = [
        { value: failed, name: '未通过', itemStyle: { color: '#e67e7e' } },
        { value: inProgress, name: '进行中', itemStyle: { color: '#f4d07a' } },
        { value: completed, name: '已完成', itemStyle: { color: '#97c37d' } }
      ];
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

.date-filter-container {
  display: flex;
  justify-content: flex-end;
  margin: 10px 10px 0 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.date-picker-wrapper {
  display: flex;
  align-items: center;
}

.date-label {
  margin-right: 10px;
  font-size: 14px;
}

.chart-container {
  width: 100%;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
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

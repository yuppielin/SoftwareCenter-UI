<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <span style="font-size:20px;">数据概况</span>
    </div>
    <el-row :gutter="12">
      <el-col :span="4">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: blue;" class="el-icon-s-help"></i>在库软件总数</div>
          <div class="topNum">{{topShowInfo.softwareAllNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: green;" class="el-icon-s-help"></i>通用软件数</div>
          <div class="topNum">{{topShowInfo.softwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i>软件模型数</div>
          <div class="topNum">{{topShowInfo.softwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: purple;" class="el-icon-s-help"></i>软件段数</div>
          <div class="topNum">{{topShowInfo.fragmentNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: #da586a;" class="el-icon-s-help"></i>待审核数</div>
          <div class="topNum">{{topShowInfo.unAuditSoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: red;" class="el-icon-s-help"></i>未通过数</div>
          <div class="topNum">{{topShowInfo.DetectionRejectSoftwareNum}}</div>
        </el-card>
      </el-col>
    </el-row>
    <div style="margin-top:20px;text-align:right;">
      <el-date-picker
        v-model="search.date"
        size="small"
        style="margin-left:10px;"
        type="daterange"
        align="right"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
      <el-button size="small" type="primary" icon="el-icon-search" style="margin-left:10px;height:30px" @click="handleSearch">搜索</el-button>
    </div>
    <!---上传下载趋势-->
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
      <MultiLineChart :option="softwareOption" />
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
      <MultiLineChart :option="softwareOptionDownload" />
    </el-row>-->
    <el-row :gutter="32" style="margin-top:10px;">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <span style="font-weight: bold;">上传趋势</span>
          <MultiLineChart :option="softwareOption" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <span style="font-weight: bold;">下载趋势</span>
          <MultiLineChart :option="softwareOptionDownload" />
        </div>
      </el-col>
    </el-row>
    <!---软件占比--->
    <el-row :gutter="32" style="margin-top:0px;">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <span style="font-weight: bold;">软件类型占比</span>
          <PieDoughnut :option="softwareTypeOption" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <span style="font-weight: bold;">软件审核状态</span>
          <PieDoughnut :option="softwareAuditOption" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChartSoftware from "./components/PieChartSoftware.vue";
import PieChartPermission from "./components/PieChartPermission.vue";
import BarChartSoftware from "./components/BarChartSoftware";
import MultiLineChart from "./components/MultiLineChart1.vue";
import MultiBarChart from "./components/MultiBarChart.vue";
import PieDoughnut from "./components/PieDoughnut";
import * as statistics from "@/api/statistics";
import * as analysis from "@/api/analysis";
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};

export default {
  name: "DashboardAdmin",
  components: {
    PieChartSoftware,
    PieChartPermission,
    BarChartSoftware,
    MultiLineChart,
    MultiBarChart,
    PieDoughnut
  },
  data() {
    return {
      topShowInfo: {
        DetectionRejectSoftwareNum: 5,
        detection_probability: "0%",
        detection_change_probability: "-100.00%",
        unAuditSoftwareNum: 33,
        fragmentNum: 65,
        unTrySoftwareNum: 0,
        softwareAllNum: 99,
        unDetectionSoftwareNum: 4,
        softwareNum: 19
      },
      lineChartData: lineChartData.newVisitis,
      plateformPieData: [],
      attributePieData: [],
      categoryPieData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      search: {
        offerUnit: "",
        type: "",
        date: ""
      },
      softwareOption: {
        title: "上传趋势",
        subTitle: "",
        legend: ["软件", "软件段", "软件模型"],
        xAxis: ["5-21", "5-22", "5-23", "5-24", "5-25", "5-26", "5-27"],
        seriesA: [121, 125, 12, 33, 212, 33, 44],
        seriesB: [142, 11, 33, 44, 151, 313, 55],
        seriesC: [20, 15, 5, 10, 25, 30, 18]
      },
      softwareOptionDownload: {
        title: "下载趋势",
        subTitle: "",
        legend: ["软件", "软件段", "软件模型"],
        xAxis: ["5-21", "5-22", "5-23", "5-24", "5-25", "5-26", "5-27"],
        seriesA: [12, 121, 12, 33, 12, 33, 44],
        seriesB: [12, 121, 33, 44, 111, 33, 77],
        seriesC: [5, 25, 10, 15, 20, 12, 8]
      },
      typeOption: {
        legend: ["上传量", "下载量"],
        xAxis: [],
        seriesA: [],
        seriesB: []
      },
      typeUploadOption: {
        legend: ["上传量", "下载量"],
        xAxis: [],
        seriesA: [],
        seriesB: []
      },
      softwareTypeOption: {
        title: "软件类型占比",
        total: 0,
        totalText: "总数",
        legend: ["通用软件", "软件模型", "软件段"],
        data: [
          { name: "通用软件", value: 0 },
          { name: "软件模型", value: 0 },
          { name: "软件段", value: 0 }
        ]
      },
      softwareAuditOption: {
        title: "软件段审核状态",
        total: 0,
        totalText: "总数",
        legend: ["已通过", "未审核", "未通过"],
        data: [
          { name: "已通过", value: 0 },
          { name: "未审核", value: 0 },
          { name: "未通过", value: 0 }
        ]
      },
      updateTime: null
    };
  },
  mounted() {
    this.updateTime = new Date();
    this.setBaseData()
    this.getTopShowInfo();
    this.handleSearch();
    this.initSoftwareTypeData();
  },
  methods: {
    setBaseData() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.search.date = []
      this.search.date.push(this.parseTime(start,'{y}-{m}-{d} {h}:{m}:{s}'))
      this.search.date.push(this.parseTime(end,'{y}-{m}-{d} {h}:{m}:{s}'))
    },
    getTopShowInfo() {
      analysis.getDataSituation().then(response => {
        if (response.code == 200) {
          this.topShowInfo = response.data;
          this.initSoftwareTypeData();
        }
      });
    },
    handleSearch() {
      console.log(this.search.date, "this.search.date");
      let start = null;
      let end = null;
      if (this.search.date) {
        start = this.search.date[0];
        end = this.search.date[1];
      }
      this.uploadTrendFunction(start, end);
      this.downloadTrendFunction(start, end);
      this.softwareProportionFunction(start, end);
    },
    uploadTrendFunction(start, end) {
      if (start != null && end != null) {
        analysis.uploadTrend(start, end).then(response => {
          if (response.code == 200) {
            let uploadTrendList = response.data;
            if (uploadTrendList.length > 0) {
              this.softwareOption.xAxis = [];
              this.softwareOption.seriesA = [];
              this.softwareOption.seriesB = [];
              this.softwareOption.seriesC = [];
              uploadTrendList.forEach(item => {
                this.softwareOption.xAxis.push(item.date);
                this.softwareOption.seriesA.push(item.software);
                this.softwareOption.seriesB.push(item.fragment);
                this.softwareOption.seriesC.push(item.softwareModel || 0);
              });
            }
          }
        });
      } else {
        analysis.uploadTrendNull().then(response => {
          if (response.code == 200) {
            let uploadTrendList = response.data;
            if (uploadTrendList.length > 0) {
              this.softwareOption.xAxis = [];
              this.softwareOption.seriesA = [];
              this.softwareOption.seriesB = [];
              this.softwareOption.seriesC = [];
              uploadTrendList.forEach(item => {
                this.softwareOption.xAxis.push(item.date);
                this.softwareOption.seriesA.push(item.software);
                this.softwareOption.seriesB.push(item.fragment);
                this.softwareOption.seriesC.push(item.softwareModel || 0);
              });
            }
          }
        });
      }
    },
    downloadTrendFunction(start, end) {
      if (start != null && end != null) {
        analysis.downloadTrend(start, end).then(response => {
          if (response.code == 200) {
            let downloadTrendList = response.data;
            if (downloadTrendList.length > 0) {
              this.softwareOptionDownload.xAxis = [];
              this.softwareOptionDownload.seriesA = [];
              this.softwareOptionDownload.seriesB = [];
              this.softwareOptionDownload.seriesC = [];
              downloadTrendList.forEach(item => {
                this.softwareOptionDownload.xAxis.push(item.date);
                this.softwareOptionDownload.seriesA.push(
                  item.software_download
                );
                this.softwareOptionDownload.seriesB.push(
                  item.fragment_download
                );
                this.softwareOptionDownload.seriesC.push(
                  item.softwareModel_download || 0
                );
              });
            }
          }
        });
      } else {
        analysis.downloadTrendNull().then(response => {
          if (response.code == 200) {
            let downloadTrendList = response.data;
            if (downloadTrendList.length > 0) {
              this.softwareOptionDownload.xAxis = [];
              this.softwareOptionDownload.seriesA = [];
              this.softwareOptionDownload.seriesB = [];
              this.softwareOptionDownload.seriesC = [];
              downloadTrendList.forEach(item => {
                this.softwareOptionDownload.xAxis.push(item.date);
                this.softwareOptionDownload.seriesA.push(
                  item.software_download
                );
                this.softwareOptionDownload.seriesB.push(
                  item.fragment_download
                );
                this.softwareOptionDownload.seriesC.push(
                  item.softwareModel_download || 0
                );
              });
            }
          }
        });
      }
    },
    softwareProportionFunction(start, end) {
      if (start != null && end != null) {
        analysis.softwareProportion(start, end).then(response => {
          if (response.code == 200) {
            let softwareProportionList = response.data;
            if (softwareProportionList.length > 0) {
              softwareProportionList.forEach(item => {
                if (item.pic1_byCategory) {
                  this.softwareTypeOption.total = this.topShowInfo.softwareAllNum;
                  this.softwareTypeOption.data[0].value = this.topShowInfo.softwareNum;
                  this.softwareTypeOption.data[1].value = this.topShowInfo.softwareNum;
                  this.softwareTypeOption.data[2].value = this.topShowInfo.fragmentNum;
                  
                  this.softwareAuditOption.total = this.topShowInfo.fragmentNum;
                  this.softwareAuditOption.data[1].value = this.topShowInfo.unAuditSoftwareNum;
                  this.softwareAuditOption.data[2].value = this.topShowInfo.DetectionRejectSoftwareNum;
                  this.softwareAuditOption.data[0].value = this.topShowInfo.fragmentNum - this.topShowInfo.unAuditSoftwareNum - this.topShowInfo.DetectionRejectSoftwareNum;
                }
              });
            }
          }
        });
      } else {
        analysis.softwareProportionNull().then(response => {
          if (response.code == 200) {
            let softwareProportionList = response.data;
            if (softwareProportionList.length > 0) {
              softwareProportionList.forEach(item => {
                if (item.pic1_byCategory) {
                  this.softwareTypeOption.total = this.topShowInfo.softwareAllNum;
                  this.softwareTypeOption.data[0].value = this.topShowInfo.softwareNum;
                  this.softwareTypeOption.data[1].value = this.topShowInfo.softwareNum;
                  this.softwareTypeOption.data[2].value = this.topShowInfo.fragmentNum;
                  
                  this.softwareAuditOption.total = this.topShowInfo.fragmentNum;
                  this.softwareAuditOption.data[1].value = this.topShowInfo.unAuditSoftwareNum;
                  this.softwareAuditOption.data[2].value = this.topShowInfo.DetectionRejectSoftwareNum;
                  this.softwareAuditOption.data[0].value = this.topShowInfo.fragmentNum - this.topShowInfo.unAuditSoftwareNum - this.topShowInfo.DetectionRejectSoftwareNum;
                }
              });
            }
          }
        });
      }
    },
    initSoftwareTypeData() {
      // 初始化软件类型占比数据
      this.softwareTypeOption.total = this.topShowInfo.softwareAllNum;
      this.softwareTypeOption.data[0].value = this.topShowInfo.softwareNum; // 通用软件
      this.softwareTypeOption.data[1].value = this.topShowInfo.softwareNum; // 软件模型
      this.softwareTypeOption.data[2].value = this.topShowInfo.fragmentNum; // 软件段

      // 初始化软件段审核状态数据
      this.softwareAuditOption.total = this.topShowInfo.fragmentNum;
      // 未审核数量
      this.softwareAuditOption.data[1].value = this.topShowInfo.unAuditSoftwareNum;
      // 未通过数量
      this.softwareAuditOption.data[2].value = this.topShowInfo.DetectionRejectSoftwareNum;
      // 已通过数量 = 总数 - 未审核数量 - 未通过数量
      this.softwareAuditOption.data[0].value = this.topShowInfo.fragmentNum - this.topShowInfo.unAuditSoftwareNum - this.topShowInfo.DetectionRejectSoftwareNum;
    }
  }
};
</script>

<style lang="scss" scoped>
.topCard {
  font-family: "Microsoft YaHei ", "Microsoft YaHei", sans-serif;
  font-weight: 400;
  font-style: normal;
  height: 140px;
  .topTitle {
    color: gray;
    font-size: 14px;
    line-height: 25px;
    height: 25px;
    font-weight: 400;
  }
  .topNum {
    font-weight: 700;
    font-style: normal;
    font-size: 30px;
    line-height: 38px;
    margin: 10px 0;
    margin-left: 16px;
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
  margin-top: 20px;
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
</style>

<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <span style="font-size:20px;">数据概况</span>
    </div>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: blue;" class="el-icon-s-help"></i>软件总数</div>
          <div class="topNum">{{topShowInfo.softwareAllNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i>软件段总数</div>
          <div class="topNum">{{topShowInfo.fragmentNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i>在网软件总数</div>
          <div class="topNum">{{topShowInfo.softwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i>待审批</div>
          <div class="topNum">{{topShowInfo.unAuditSoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: green;" class="el-icon-s-help"></i>待试用</div>
          <div class="topNum">{{topShowInfo.unTrySoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: green;" class="el-icon-s-help"></i>待安检</div>
          <div class="topNum">{{topShowInfo.unDetectionSoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: #da586a;" class="el-icon-s-help"></i>安检不合格数</div>
          <div class="topNum">{{topShowInfo.DetectionRejectSoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard">
          <div class="topTitle"><i style="color: #da586a;" class="el-icon-s-help"></i>安检不合格率</div>
          <div class="topNum">{{topShowInfo.detection_probability}}</div>
          <div class="topTitle">
            较上月
            <img v-if="topShowInfo.detection_change_probability.indexOf('+')!=-1" :src="require('@/assets/index/up.png')" />
            <img v-if="topShowInfo.detection_change_probability.indexOf('-')!=-1" :src="require('@/assets/index/down.png')" />
            {{topShowInfo.detection_change_probability}}
          </div>
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
          <span style="font-weight: bold;">软件讨论类型占比</span>
          <PieDoughnut :option="softwareTsOption" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top:0px;">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <span style="font-weight: bold;">软件评分占比</span>
          <PieDoughnutStar :option="softwareStarOption" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <span style="font-weight: bold;">软件段评分占比</span>
          <PieDoughnutStar :option="segmentStarOption" />
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
import PieDoughnutStar from "./components/PieDoughnutStar";
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
    PieDoughnut,
    PieDoughnutStar
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
        legend: ["软件", "软件段"],
        xAxis: ["5-21", "5-22", "5-23", "5-24", "5-25", "5-26", "5-27"],
        seriesA: [121, 125, 12, 33, 212, 33, 44],
        seriesB: [142, 11, 33, 44, 151, 313, 55]
      },
      softwareOptionDownload: {
        title: "下载趋势",
        subTitle: "",
        legend: ["软件", "软件段"],
        xAxis: ["5-21", "5-22", "5-23", "5-24", "5-25", "5-26", "5-27"],
        seriesA: [12, 121, 12, 33, 12, 33, 44],
        seriesB: [12, 121, 33, 44, 111, 33, 77]
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
        legend: [
          "态势感知",
          "联合筹划",
          "行动控制",
          "作战值班",
          "联合训练",
          "支援保障",
          "资源管理"
        ],
        data: [
          { name: "态势感知", value: 0 },
          { name: "联合筹划", value: 0 },
          { name: "行动控制", value: 0 },
          { name: "作战值班", value: 0 },
          { name: "联合训练", value: 0 },
          { name: "支援保障", value: 0 },
          { name: "资源管理", value: 0 }
        ]
      },
      softwareTsOption: {
        title: "软件讨论类型占比",
        total: 0,
        totalText: "总讨论量",
        legend: ["问题", "建议", "需求"],
        data: [
          { name: "问题", value: 0 },
          { name: "建议", value: 0 },
          { name: "需求", value: 0 }
        ]
      },
      softwareStarOption: {
        title: "软件评分占比",
        legend: [
          "5星",
          "4星半",
          "4星",
          "3星半",
          "3星",
          "2星半",
          "2星",
          "1星半",
          "1星",
          "半星"
        ],
        data: [
          { name: "5星", value: 0 },
          { name: "4星半", value: 0 },
          { name: "4星", value: 0 },
          { name: "3星半", value: 0 },
          { name: "3星", value: 0 },
          { name: "2星半", value: 0 },
          { name: "2星", value: 0 },
          { name: "1星半", value: 0 },
          { name: "1星", value: 0 },
          { name: "半星", value: 0 }
        ]
      },
      segmentStarOption: {
        title: "软件段评分占比",
        legend: [
          "5星",
          "4星半",
          "4星",
          "3星半",
          "3星",
          "2星半",
          "2星",
          "1星半",
          "1星",
          "半星"
        ],
        data: [
          { name: "5星", value: 0 },
          { name: "4星半", value: 0 },
          { name: "4星", value: 0 },
          { name: "3星半", value: 0 },
          { name: "3星", value: 0 },
          { name: "2星半", value: 0 },
          { name: "2星", value: 0 },
          { name: "1星半", value: 0 },
          { name: "1星", value: 0 },
          { name: "半星", value: 0 }
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
              uploadTrendList.forEach(item => {
                this.softwareOption.xAxis.push(item.date);
                this.softwareOption.seriesA.push(item.software);
                this.softwareOption.seriesB.push(item.fragment);
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
              uploadTrendList.forEach(item => {
                this.softwareOption.xAxis.push(item.date);
                this.softwareOption.seriesA.push(item.software);
                this.softwareOption.seriesB.push(item.fragment);
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
              downloadTrendList.forEach(item => {
                this.softwareOptionDownload.xAxis.push(item.date);
                this.softwareOptionDownload.seriesA.push(
                  item.software_download
                );
                this.softwareOptionDownload.seriesB.push(
                  item.fragment_download
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
              downloadTrendList.forEach(item => {
                this.softwareOptionDownload.xAxis.push(item.date);
                this.softwareOptionDownload.seriesA.push(
                  item.software_download
                );
                this.softwareOptionDownload.seriesB.push(
                  item.fragment_download
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
                  if (item.pic1_byCategory.length > 0) {
                    this.softwareTypeOption.legend = [];
                    this.softwareTypeOption.data = [];
                    this.softwareTypeOption.total = item.pic1_total;
                    item.pic1_byCategory.forEach(Element => {
                      this.softwareTypeOption.legend.push(Element.name);
                      this.softwareTypeOption.data.push(Element);
                    });
                  }
                } else if (item.pic2_demandByCategory) {
                  if (item.pic2_demandByCategory.length >0 ) {
                    this.softwareTsOption.total = item.pic2_total;
                    this.softwareTsOption.data = [];
                    item.pic2_demandByCategory.forEach(element => {
                      this.softwareTsOption.data.push({
                        name: element.c_name,
                        value: element.value
                      });
                    });
                  }
                } else if (item.pic3_bySoftwareScore) {
                  this.softwareStarOption.data[0].value =
                    item.pic3_bySoftwareScore["9~9.9"];
                  this.softwareStarOption.data[1].value =
                    item.pic3_bySoftwareScore["8~8.9"];
                  this.softwareStarOption.data[2].value =
                    item.pic3_bySoftwareScore["7~7.9"];
                  this.softwareStarOption.data[3].value =
                    item.pic3_bySoftwareScore["6~6.9"];
                  this.softwareStarOption.data[4].value =
                    item.pic3_bySoftwareScore["5~5.9"];
                  this.softwareStarOption.data[5].value =
                    item.pic3_bySoftwareScore["4~4.9"];
                  this.softwareStarOption.data[6].value =
                    item.pic3_bySoftwareScore["3~3.9"];
                  this.softwareStarOption.data[7].value =
                    item.pic3_bySoftwareScore["2~2.9"];
                  this.softwareStarOption.data[8].value =
                    item.pic3_bySoftwareScore["1~1.9"];
                  this.softwareStarOption.data[9].value =
                    item.pic3_bySoftwareScore["0~0.9"];
                } else if (item.pic4_byFragmentScore) {
                  this.segmentStarOption.data[0].value =
                    item.pic4_byFragmentScore["9~9.9"];
                  this.segmentStarOption.data[1].value =
                    item.pic4_byFragmentScore["8~8.9"];
                  this.segmentStarOption.data[2].value =
                    item.pic4_byFragmentScore["7~7.9"];
                  this.segmentStarOption.data[3].value =
                    item.pic4_byFragmentScore["6~6.9"];
                  this.segmentStarOption.data[4].value =
                    item.pic4_byFragmentScore["5~5.9"];
                  this.segmentStarOption.data[5].value =
                    item.pic4_byFragmentScore["4~4.9"];
                  this.segmentStarOption.data[6].value =
                    item.pic4_byFragmentScore["3~3.9"];
                  this.segmentStarOption.data[7].value =
                    item.pic4_byFragmentScore["2~2.9"];
                  this.segmentStarOption.data[8].value =
                    item.pic4_byFragmentScore["1~1.9"];
                  this.segmentStarOption.data[9].value =
                    item.pic4_byFragmentScore["0~0.9"];
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
                  if (item.pic1_byCategory.length > 0) {
                    this.softwareTypeOption.legend = [];
                    this.softwareTypeOption.data = [];
                    this.softwareTypeOption.total = item.pic1_total;
                    item.pic1_byCategory.forEach(Element => {
                      this.softwareTypeOption.legend.push(Element.name);
                      this.softwareTypeOption.data.push(Element);
                    });
                  }
                } else if (item.pic2_demandByCategory) {
                  if (item.pic2_demandByCategory.length == 1) {
                    this.softwareTsOption.total = item.pic2_total;
                    this.softwareTsOption.data[0].value =
                      item.pic2_demandByCategory[0].question;
                    this.softwareTsOption.data[1].value =
                      item.pic2_demandByCategory[0].suggest;
                    this.softwareTsOption.data[2].value =
                      item.pic2_demandByCategory[0].demand;
                  }
                } else if (item.pic3_bySoftwareScore) {
                  this.softwareStarOption.data[0].value =
                    item.pic3_bySoftwareScore["0~0.9"];
                  this.softwareStarOption.data[1].value =
                    item.pic3_bySoftwareScore["1~1.9"];
                  this.softwareStarOption.data[2].value =
                    item.pic3_bySoftwareScore["2~2.9"];
                  this.softwareStarOption.data[3].value =
                    item.pic3_bySoftwareScore["3~3.9"];
                  this.softwareStarOption.data[4].value =
                    item.pic3_bySoftwareScore["4~4.9"];
                  this.softwareStarOption.data[5].value =
                    item.pic3_bySoftwareScore["5~5.9"];
                  this.softwareStarOption.data[6].value =
                    item.pic3_bySoftwareScore["6~6.9"];
                  this.softwareStarOption.data[7].value =
                    item.pic3_bySoftwareScore["7~7.9"];
                  this.softwareStarOption.data[8].value =
                    item.pic3_bySoftwareScore["8~8.9"];
                  this.softwareStarOption.data[9].value =
                    item.pic3_bySoftwareScore["9~9.9"];
                } else if (item.pic4_byFragmentScore) {
                  this.segmentStarOption.data[0].value =
                    item.pic4_byFragmentScore["0~0.9"];
                  this.segmentStarOption.data[1].value =
                    item.pic4_byFragmentScore["1~1.9"];
                  this.segmentStarOption.data[2].value =
                    item.pic4_byFragmentScore["2~2.9"];
                  this.segmentStarOption.data[3].value =
                    item.pic4_byFragmentScore["3~3.9"];
                  this.segmentStarOption.data[4].value =
                    item.pic4_byFragmentScore["4~4.9"];
                  this.segmentStarOption.data[5].value =
                    item.pic4_byFragmentScore["5~5.9"];
                  this.segmentStarOption.data[6].value =
                    item.pic4_byFragmentScore["6~6.9"];
                  this.segmentStarOption.data[7].value =
                    item.pic4_byFragmentScore["7~7.9"];
                  this.segmentStarOption.data[8].value =
                    item.pic4_byFragmentScore["8~8.9"];
                  this.segmentStarOption.data[9].value =
                    item.pic4_byFragmentScore["9~9.9"];
                }
              });
            }
          }
        });
      }
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

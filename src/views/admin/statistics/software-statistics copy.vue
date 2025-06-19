<template>
  <div class="app-container">
    <div style="margin-top:20px;text-align:right;">
<!--      <el-select-->
<!--        v-model="search.offerUnit"-->
<!--        size="small"-->
<!--        style="width:200px;"-->
<!--        placeholder="提供单位"-->
<!--        filterable-->
<!--        remote-->
<!--        reserve-keyword-->
<!--      >-->
<!--        <el-option label="中科院电子所" value="1" />-->
<!--        <el-option label="中科院光电所" value="2" />-->
<!--        <el-option label="中科院遥感所" value="3" />-->
<!--      </el-select>-->
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
      <el-button size="small" type="primary" style="margin-left:10px" @click="handleSearch">搜索</el-button>
<!--      <el-button size="small" style="background:gray;color:white">报告导出</el-button>-->
    </div>
    <el-row :gutter="32" style="margin-top:30px;">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <bar-chart-software :data="plateformPieData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <pie-chart-permission :data="attributePieData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <pie-chart-software :data="categoryPieData" />
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
      <MultiLineChart :option="softwareOption" />
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <MultiBarChart class="chart-wrapper" :option="typeOption" />
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <MultiBarChart class="chart-wrapper" :option="typeUploadOption" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChartSoftware from './components/PieChartSoftware.vue'
import PieChartPermission from './components/PieChartPermission.vue'
import BarChartSoftware from './components/BarChartSoftware'
import MultiLineChart from './components/MultiLineChart.vue'
import MultiBarChart from './components/MultiBarChart.vue'
import * as statistics from '@/api/statistics'
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
}

export default {
  name: 'DashboardAdmin',
  components: {
    PieChartSoftware,
    PieChartPermission,
    BarChartSoftware,
    MultiLineChart,
    MultiBarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      plateformPieData: [],
      attributePieData: [],
      categoryPieData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      search: {
        offerUnit: '',
        type: '',
        date: ''
      },
      softwareOption: {
        title: '',
        subTitle: '',
        legend: ['上传量', '下载量'],
        xAxis: [],
        seriesA: [],
        seriesB: []
      },
      typeOption: {
        legend: ['上传量', '下载量'],
        xAxis: [],
        seriesA: [],
        seriesB: []
      },
      typeUploadOption: {
        legend: ['上传量', '下载量'],
        xAxis: [],
        seriesA: [],
        seriesB: []
      },
      platformOption: {
        legend: ['上传量', '下载量'],
        xAxis: ['Windows', 'Linux', '申威平台', '龙芯平台', '兆芯平台', '其他'],
        seriesA: [1, 8, 11, 19, 30, 49, 18, 49, 98],
        seriesB: [12, 12, 12, 12, 33, 44, 12, 45, 88]
      }
    }
  },
  mounted() {
    this.getSoftwareUploadStatByCategory(null, null)
    this.getSoftwareUploadStatByDevUnit(null, null)
    this.getSoftwareStatByPlatform(null, null)
    this.getSoftwareStatByAttribute(null, null)
    this.getSoftwareStatByCategory(null, null)
    this.getSoftwareStatByType(null, null)
  },
  methods: {
    handleSearch() {
      let start
      let end
      if (this.search.date) {
        start = this.search.date[0]
        end = this.search.date[1]
      }
      this.getSoftwareUploadStatByCategory(start, end)
      this.getSoftwareUploadStatByDevUnit(start, end)
      this.getSoftwareStatByPlatform(start, end)
      this.getSoftwareStatByAttribute(start, end)
      this.getSoftwareStatByCategory(start, end)
      this.getSoftwareStatByType(start, end)
    },
    getSoftwareStatByPlatform(start, end) {
      statistics.getSoftwareStatByPlatform(start, end).then(response => {
        if (response.code === 200) {
          this.plateformPieData = response.data
        }
      })
    },
    getSoftwareStatByAttribute(start, end) {
      statistics.getSoftwareStatByAttribute(start, end).then(response => {
        if (response.code === 200) {
          this.attributePieData = response.data
        }
      })
    },
    getSoftwareStatByCategory(start, end) {
      statistics.getSoftwareStatByCategory(start, end).then(response => {
        if (response.code === 200) {
          this.categoryPieData = response.data
        }
      })
    },
    getSoftwareStatByType(start, end) {
      statistics.getUploadStaticticsType(start, end).then(response => {
        if (response.code === 200) {
          this.typeUploadOption.xAxis = response.data.type
          this.typeUploadOption.seriesA = response.data.upload
          this.typeUploadOption.seriesB = response.data.download
        }
      })
    },
    getSoftwareUploadStatByCategory(start, end) {
      statistics.getSoftwareUploadStatByCategory(start, end).then(response => {
        if (response.code === 200) {
          this.typeOption.xAxis = response.data.category
          this.typeOption.seriesA = response.data.upload
          this.typeOption.seriesB = response.data.download
        }
      })
    },
    getSoftwareUploadStatByDevUnit(start, end) {
      statistics.getSoftwareUploadStatByDevUnit(start, end).then(response => {
        if (response.code === 200) {
          this.softwareOption.xAxis = response.data.devUnit
          this.softwareOption.seriesA = response.data.upload
          this.softwareOption.seriesB = response.data.download
        }
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

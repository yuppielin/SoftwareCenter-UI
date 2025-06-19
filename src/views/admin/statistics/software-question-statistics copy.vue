<template>
  <div class="app-container">
    <div style="margin-top:20px;text-align:right;">
      <el-date-picker
        v-model="search.date"
        size="small"
        style="margin-left:10px;"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
      <el-button size="small" type="primary" style="margin-left:10px" @click="handleSearch">搜索</el-button>
<!--      <el-button size="small" style="background:gray;color:white">报告导出</el-button>-->
    </div>
    <el-row style="background:#fff;padding:16px 16px 0;margin:10px  0 32px 0;">
      <MultiLineChart :option="questionOption" />
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <MultiBarChart class="chart-wrapper" :option="typeOption" />
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <MultiBarChart class="chart-wrapper" :option="typeQuestionOption" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
  components: {
    MultiLineChart,
    MultiBarChart
  },
  data() {
    return {
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
      questionOption: {
        title: '',
        subTitle: '',
        legend: ['技术支持', '回复'],
        xAxis: [],
        seriesA: [],
        seriesB: []
      },
      typeQuestionOption: {
        title: '',
        subTitle: '',
        legend: ['技术支持', '回复'],
        xAxis: [],
        seriesA: [],
        seriesB: []
      },
      platformOption: {
        legend: ['技术支持', '回复'],
        xAxis: ['Windows', 'Linux', '申威平台', '龙芯平台', '兆芯平台', '其他'],
        seriesA: [1, 8, 11, 19, 30, 49, 18, 49, 98],
        seriesB: [12, 12, 12, 12, 33, 44, 12, 45, 88]
      },
      typeOption: {
        legend: ['技术支持', '回复'],
        xAxis: [],
        seriesA: [],
        seriesB: []
      }
    }
  },
  mounted() {
    this.getSoftwareQuestionStatByCategory(null, null)
    this.getSoftwareQuestionStatByDate(null, null)
    this.getQuestionStaticticsType(null, null)
  },
  methods: {
    handleSearch() {
      let start
      let end
      if (this.search.date) {
        start = this.search.date[0]
        end = this.search.date[1]
      }
      this.getSoftwareQuestionStatByCategory(start, end)
      this.getSoftwareQuestionStatByDate(start, end)
      this.getQuestionStaticticsType(start, end)
    },
    getSoftwareQuestionStatByCategory(start, end) {
      statistics.getSoftwareQuestionStatByCategory(start, end).then(response => {
        if (response.code === 200) {
          this.typeOption.seriesA = response.data.question
          this.typeOption.seriesB = response.data.answer
          this.typeOption.xAxis = response.data.category
        }
      })
    },
    getQuestionStaticticsType(start, end) {
      statistics.getQuestionStaticticsType(start, end).then(response => {
        if (response.code === 200) {
          this.typeQuestionOption.seriesA = response.data.question
          this.typeQuestionOption.seriesB = response.data.answer
          this.typeQuestionOption.xAxis = response.data.type
        }
      })
    },
    getSoftwareQuestionStatByDate(start, end) {
      statistics.getSoftwareQuestionStatByDate(start, end).then(response => {
        if (response.code === 200) {
          this.questionOption.seriesA = response.data.question
          this.questionOption.seriesB = response.data.answer
          this.questionOption.xAxis = response.data.date
        }
      })
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

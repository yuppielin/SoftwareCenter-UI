<template>
  <div class="app-container">
    <h2>数据概况</h2>
    
    <div class="data-overview">
      <el-row :gutter="20" type="flex" justify="space-between" v-loading="loading.overview">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card orange">
            <div class="icon-wrapper"><i class="el-icon-s-data"></i></div>
            <div class="data-label">反馈总数</div>
            <div class="data-value">{{ statData.totalFeedback || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card green">
            <div class="icon-wrapper"><i class="el-icon-s-opportunity"></i></div>
            <div class="data-label">软件需求数</div>
            <div class="data-value">{{ statData.demandCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card yellow">
            <div class="icon-wrapper"><i class="el-icon-warning"></i></div>
            <div class="data-label">软件问题数</div>
            <div class="data-value">{{ statData.problemCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card purple">
            <div class="icon-wrapper"><i class="el-icon-s-claim"></i></div>
            <div class="data-label">未处理数</div>
            <div class="data-value">{{ statData.pendingCount || 0 }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    
     <div style="margin-top:20px;text-align:right;">
       <el-date-picker size="small" style="margin-left:10px;"
        v-model="search.date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button size="small" type="primary" style="color:white;margin-left:10px" @click="handleSearch">搜索</el-button>
      <el-button size="small" type="primary" style="color:white;margin-left:10px">报告导出</el-button>
    </div>
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin:10px  0 32px 0;">
      <BarChartDemand></BarChartDemand>
    </el-row> -->
    <h2>运营反馈趋势</h2>
    <el-row style="background:#fff;padding:16px 16px 0;margin:10px 0 32px 0;">
      <div v-loading="loading.trend" style="height: 450px; width: 100%;">
        <MultiLineChart :option="questionOption"></MultiLineChart>
      </div>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix title-container">
            <span class="chart-title">反馈类型占比</span>
          </div>
          <div class="chart-container" v-loading="loading.feedbackType">
            <div ref="feedbackTypeChart" style="width: 100%; height: 400px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix title-container">
            <span class="chart-title">反馈状态占比</span>
          </div>
          <div class="chart-container" v-loading="loading.feedbackStatus">
            <div ref="feedbackStatusChart" style="width: 100%; height: 400px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;"> 
          <MultiBarChart class="chart-wrapper" :option="typeOption"></MultiBarChart>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <MultiBarChart class="chart-wrapper" :option="typeOption"></MultiBarChart>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import MultiLineChart from './components/MultiLineChart.vue'
import MultiBarChart from './components/MultiBarChart.vue'
import BarChartDemand from './components/BarChartDemand.vue'
import * as echarts from 'echarts'
import { getDemandStatisticsOverview, getDemandStatisticsTrend, getDemandStatisticsByType, getDemandStatisticsByStatus } from '@/api/demand'
import { parseTime } from '@/utils/index'

export default {
  components: {
    MultiLineChart,
    MultiBarChart,
    BarChartDemand
  },
  data() {
    return {
      statData: {
        totalFeedback: 0,
        demandCount: 0,
        problemCount: 0,
        pendingCount: 0
      },
      loading: {
        overview: false,
        trend: false,
        feedbackType: false,
        feedbackStatus: false
      },
      feedbackTypeChart: null,
      feedbackStatusChart: null,
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
      search:{
        offerUnit:'',
        type:'',
        date:''
      },
      questionOption:{
        title:'',
        subTitle:'',
        legend:['软件需求','软件问题','软件建议'],
        xAxis:[],
        seriesA:[],
        seriesB:[],
        seriesC:[]
      },
      // platformOption:{
      //   legend:['需求','建议'],
      //   xAxis:['Windows', 'Linux', '申威平台', '龙芯平台', '兆芯平台','其他'],
      //   seriesA:[1,8,11,19,30,49,18,49,98],
      //   seriesB:[12,12,12,12,33,44,12,45,88]
      // },
      // typeOption:{
      //   legend:['需求','建议'],
      //   xAxis:['应用软件','支撑软件','共性软件','系统软件','工具软件','其他'],
      //   seriesA:[1,8,11,19,30,49,18,49,98],
      //   seriesB:[12,12,12,12,33,44,12,45,88]
      // },
    }
  },
  computed: {
    dateRange() {
      if (this.search.date && this.search.date.length === 2) {
        return {
          startDate: parseTime(this.search.date[0], '{y}-{m}-{d}'),
          endDate: parseTime(this.search.date[1], '{y}-{m}-{d}')
        }
      }
      return {
        startDate: '',
        endDate: ''
      }
    }
  },
  methods: {
    async getStatData() {
      this.loading.overview = true
      try {
        const res = await getDemandStatisticsOverview()
        if (res.code === 200) {
          const data = res.data
          this.statData = {
            totalFeedback: data.totalCount || 0,
            demandCount: data.demandCount || 0,
            problemCount: data.questionCount || 0,
            pendingCount: data.pendingCount || 0
          }
        } else {
          this.$message.error('获取概览数据失败')
        }
      } catch (error) {
        console.error('获取概览数据出错:', error)
        this.$message.error('获取概览数据出错')
      } finally {
        this.loading.overview = false
      }
    },
    async getTrendData() {
      this.loading.trend = true
      try {
        const { startDate, endDate } = this.dateRange
        const res = await getDemandStatisticsTrend(startDate, endDate)
        if (res.code === 200) {
          const trendData = res.data.trend || []
          
          // 处理趋势数据
          const xAxisData = []
          const demandData = []
          const questionData = []
          const suggestData = []
          
          trendData.forEach(item => {
            xAxisData.push(item.date)
            demandData.push(item.demandCount)
            questionData.push(item.questionCount)
            suggestData.push(item.suggestCount)
          })
          
          // 更新图表数据
          this.questionOption.xAxis = xAxisData
          this.questionOption.seriesA = demandData
          this.questionOption.seriesB = questionData
          this.questionOption.seriesC = suggestData
        } else {
          this.$message.error('获取趋势数据失败')
        }
      } catch (error) {
        console.error('获取趋势数据出错:', error)
        this.$message.error('获取趋势数据出错')
      } finally {
        this.loading.trend = false
      }
    },
    async initFeedbackTypeChart() {
      this.loading.feedbackType = true
      
      try {
        const { startDate, endDate } = this.dateRange
        const res = await getDemandStatisticsByType(startDate, endDate)
        
        if (res.code === 200) {
          const typeData = res.data.typeData || []
          
          // 处理类型数据
          const feedbackTypeData = typeData.map(item => {
            let color = '#81b0d5'
            if (item.type === '软件需求') {
              color = '#e8c872'
            } else if (item.type === '软件问题') {
              color = '#e07a5f'
            }
            
            return {
              name: item.type,
              value: item.count,
              itemStyle: { color }
            }
          })
          
          this.feedbackTypeChart = echarts.init(this.$refs.feedbackTypeChart)
          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: feedbackTypeData.map(item => item.name)
            },
            series: [
              {
                name: '反馈类型',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['50%', '60%'],
                data: feedbackTypeData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                label: {
                  show: true,
                  formatter: '{b}\n{d}%'
                },
                labelLine: {
                  show: true
                }
              }
            ]
          }
          this.feedbackTypeChart.setOption(option)
        } else {
          this.$message.error('获取反馈类型数据失败')
        }
      } catch (error) {
        console.error('获取反馈类型数据出错:', error)
        this.$message.error('获取反馈类型数据出错')
      } finally {
        this.loading.feedbackType = false
      }
    },
    async initFeedbackStatusChart() {
      this.loading.feedbackStatus = true
      
      try {
        const { startDate, endDate } = this.dateRange
        const res = await getDemandStatisticsByStatus(startDate, endDate)
        
        if (res.code === 200) {
          const statusData = res.data.statusData || []
          
          // 处理状态数据
          const feedbackStatusData = statusData.map(item => {
            let color = '#81b29a'
            if (item.status === '未处理') {
              color = '#e07a5f'
            } else if (item.status === '处理中') {
              color = '#e8c872'
            }
            
            return {
              name: item.status,
              value: item.count,
              itemStyle: { color }
            }
          })
          
          this.feedbackStatusChart = echarts.init(this.$refs.feedbackStatusChart)
          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: feedbackStatusData.map(item => item.name)
            },
            series: [
              {
                name: '反馈状态',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['50%', '60%'],
                data: feedbackStatusData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                label: {
                  show: true,
                  formatter: '{b}\n{d}%'
                },
                labelLine: {
                  show: true
                }
              }
            ]
          }
          this.feedbackStatusChart.setOption(option)
        } else {
          this.$message.error('获取反馈状态数据失败')
        }
      } catch (error) {
        console.error('获取反馈状态数据出错:', error)
        this.$message.error('获取反馈状态数据出错')
      } finally {
        this.loading.feedbackStatus = false
      }
    },
    handleSearch() {
      this.getStatData()
      this.getTrendData()
      this.initCharts()
    },
    initCharts() {
      this.$nextTick(() => {
        this.initFeedbackTypeChart()
        this.initFeedbackStatusChart()
      })
    },
    handleResize() {
      if (this.feedbackTypeChart) {
        this.feedbackTypeChart.resize()
      }
      if (this.feedbackStatusChart) {
        this.feedbackStatusChart.resize()
      }
    }
  },
  created() {
    this.getStatData()
    this.getTrendData()
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.feedbackTypeChart) {
      this.feedbackTypeChart.dispose()
      this.feedbackTypeChart = null
    }
    if (this.feedbackStatusChart) {
      this.feedbackStatusChart.dispose()
      this.feedbackStatusChart = null
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 18px;
  font-weight: 500;
  font-size: 22px;
}
.data-overview {
  margin-bottom: 30px;
}
.data-card {
  border-radius: 4px;
  padding: 25px 15px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  height: 140px;
  width: 100%;
  justify-content: center;
}
.icon-wrapper {
  font-size: 24px;
  margin-right: 10px;
  vertical-align: middle;
  margin-bottom: 8px;
}
.data-label {
  font-size: 16px;
  color: #606266;
  margin-bottom: 15px;
}
.data-value {
  font-size: 32px;
  font-weight: bold;
}
.orange {
  border-top: 3px solid #E6A23C;
}
.orange .data-value {
  color: #E6A23C;
}
.green {
  border-top: 3px solid #67C23A;
}
.green .data-value {
  color: #67C23A;
}
.yellow {
  border-top: 3px solid #F5A623;
}
.yellow .data-value {
  color: #F5A623;
}
.purple {
  border-top: 3px solid #8E44AD;
}
.purple .data-value {
  color: #8E44AD;
}
.box-card {
  height: 100%;
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
}
.box-card .el-card__header {
  padding: 16px;
  border-bottom: 1px solid #EBEEF5;
  box-sizing: border-box;
  background-color: #f8f8f8;
}
.box-card .el-card__body {
  padding-top: 20px;
}
.chart-title {
  font-size: 18px;
  font-weight: 500;
  display: inline-block;
  color: #333;
  position: relative;
  padding-left: 5px;
}
.title-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 10px;
  border-left: 3px solid #e74c3c;
}
.chart-container {
  width: 100%;
  height: 400px;
  padding-top: 15px;
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

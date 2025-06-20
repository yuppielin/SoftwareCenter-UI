<template>
  <div class="dev-analysis-container">

    <el-row :gutter="20" class="dashboard-container">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>开发生态概览</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">开发单位数量</div>
                <div class="data-value">{{ statData.devUnitCount || 0 }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">软件项目数量</div>
                <div class="data-value">{{ statData.softwareCount || 0 }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">开发者数量</div>
                <div class="data-value">{{ statData.developerCount || 0 }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">本月新增项目</div>
                <div class="data-value">{{ statData.newProjectCount || 0 }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>软件开发趋势</span>
          </div>
          <div class="chart-container" v-loading="loading.trend">
            <div ref="trendChart" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>软件类别分布</span>
          </div>
          <div class="chart-container" v-loading="loading.category">
            <div ref="categoryChart" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getSystemData, softwareProportionNull } from '@/api/analysis'

export default {
  name: 'DevAnalysis',
  data() {
    return {
      statData: {
        devUnitCount: 0,
        softwareCount: 0,
        developerCount: 0,
        newProjectCount: 0
      },
      loading: {
        trend: false,
        category: false
      },
      trendChart: null,
      categoryChart: null
    }
  },
  methods: {
    getStatData() {
      getSystemData().then(response => {
        if (response.code === 20000) {
          this.statData = {
            devUnitCount: response.data.devUnitCount || 0,
            softwareCount: response.data.softwareCount || 0,
            developerCount: response.data.developerCount || 0,
            newProjectCount: response.data.newProjectCount || 0
          }
        } else {
          this.$message.error('获取统计数据失败')
        }
      }).catch(error => {
        console.error('获取统计数据错误:', error)
        this.$message.error('获取统计数据出错')
      })
    },
    initTrendChart() {
      this.loading.trend = true
      
      // 模拟数据，实际项目中应该从API获取
      const xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      const data = [10, 15, 20, 25, 30, 35, 40, 42, 45, 50, 55, 60]
      
      this.trendChart = echarts.init(this.$refs.trendChart)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '软件项目数',
          type: 'line',
          data: data,
          smooth: true,
          itemStyle: {
            color: '#409EFF'
          }
        }]
      }
      this.trendChart.setOption(option)
      this.loading.trend = false
    },
    initCategoryChart() {
      this.loading.category = true
      
      softwareProportionNull().then(response => {
        if (response.code === 20000) {
          const chartData = response.data.map(item => {
            return {
              name: item.name,
              value: item.value
            }
          }) || []
          
          this.categoryChart = echarts.init(this.$refs.categoryChart)
          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: chartData.map(item => item.name)
            },
            series: [
              {
                name: '软件类别',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: chartData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
          this.categoryChart.setOption(option)
        } else {
          this.$message.error('获取软件类别分布数据失败')
        }
        this.loading.category = false
      }).catch(error => {
        console.error('获取软件类别分布错误:', error)
        this.$message.error('获取软件类别分布出错')
        this.loading.category = false
      })
    },
    handleResize() {
      if (this.trendChart) {
        this.trendChart.resize()
      }
      if (this.categoryChart) {
        this.categoryChart.resize()
      }
    }
  },
  created() {
    this.getStatData()
  },
  mounted() {
    this.$nextTick(() => {
      this.initTrendChart()
      this.initCategoryChart()
      window.addEventListener('resize', this.handleResize)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.trendChart) {
      this.trendChart.dispose()
      this.trendChart = null
    }
    if (this.categoryChart) {
      this.categoryChart.dispose()
      this.categoryChart = null
    }
  }
}
</script>

<style scoped>
.dev-analysis-container {
  padding: 20px;
}
.dashboard-container {
  margin-bottom: 20px;
}
.chart-row {
  margin-top: 20px;
}
.data-item {
  text-align: center;
  padding: 15px;
}
.data-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}
.data-value {
  font-size: 24px;
  color: #409EFF;
  font-weight: bold;
}
.chart-container {
  width: 100%;
  height: 320px;
}
</style>

<template>
  <div class="runtime-analysis-container">
    <h2>运行生态分析</h2>
    
    <el-row :gutter="20" class="dashboard-container">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>运行生态概览</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">部署总量</div>
                <div class="data-value">{{ statData.deployCount || 0 }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">当前在线数</div>
                <div class="data-value">{{ statData.onlineCount || 0 }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">下载总量</div>
                <div class="data-value">{{ statData.downloadCount || 0 }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="data-item">
                <div class="data-title">本月部署量</div>
                <div class="data-value">{{ statData.monthlyDeployCount || 0 }}</div>
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
            <span>软件下载趋势</span>
          </div>
          <div class="chart-container" v-loading="loading.downloadTrend">
            <div ref="downloadTrendChart" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>热门软件排行</span>
          </div>
          <div class="chart-container" v-loading="loading.hotSoftware">
            <div ref="hotSoftwareChart" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getSystemData, downloadTrendNull, hotDownload } from '@/api/analysis'

export default {
  name: 'RuntimeAnalysis',
  data() {
    return {
      statData: {
        deployCount: 0,
        onlineCount: 0,
        downloadCount: 0,
        monthlyDeployCount: 0
      },
      loading: {
        downloadTrend: false,
        hotSoftware: false
      },
      downloadTrendChart: null,
      hotSoftwareChart: null
    }
  },
  methods: {
    getStatData() {
      getSystemData().then(response => {
        if (response.code === 20000) {
          this.statData = {
            deployCount: response.data.deployCount || 0,
            onlineCount: response.data.onlineCount || 0,
            downloadCount: response.data.downloadCount || 0,
            monthlyDeployCount: response.data.monthlyDeployCount || 0
          }
        } else {
          this.$message.error('获取统计数据失败')
        }
      }).catch(error => {
        console.error('获取统计数据错误:', error)
        this.$message.error('获取统计数据出错')
      })
    },
    initDownloadTrendChart() {
      this.loading.downloadTrend = true
      
      downloadTrendNull().then(response => {
        if (response.code === 20000) {
          const xData = response.data.xData || []
          const yData = response.data.yData || []
          
          this.downloadTrendChart = echarts.init(this.$refs.downloadTrendChart)
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
              name: '下载量',
              type: 'line',
              data: yData,
              smooth: true,
              itemStyle: {
                color: '#67C23A'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(103, 194, 58, 0.3)'
                  }, {
                    offset: 1, color: 'rgba(103, 194, 58, 0.1)'
                  }]
                }
              }
            }]
          }
          this.downloadTrendChart.setOption(option)
        } else {
          this.$message.error('获取下载趋势数据失败')
        }
        this.loading.downloadTrend = false
      }).catch(error => {
        console.error('获取下载趋势数据错误:', error)
        this.$message.error('获取下载趋势数据出错')
        this.loading.downloadTrend = false
      })
    },
    initHotSoftwareChart() {
      this.loading.hotSoftware = true
      
      hotDownload(10).then(response => {
        if (response.code === 20000) {
          const data = response.data || []
          const names = data.map(item => item.name)
          const values = data.map(item => item.value)
          
          this.hotSoftwareChart = echarts.init(this.$refs.hotSoftwareChart)
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: names,
              axisLabel: {
                interval: 0,
                rotate: 30
              }
            },
            series: [
              {
                name: '下载量',
                type: 'bar',
                data: values,
                itemStyle: {
                  color: '#409EFF'
                }
              }
            ]
          }
          this.hotSoftwareChart.setOption(option)
        } else {
          this.$message.error('获取热门软件数据失败')
        }
        this.loading.hotSoftware = false
      }).catch(error => {
        console.error('获取热门软件数据错误:', error)
        this.$message.error('获取热门软件数据出错')
        this.loading.hotSoftware = false
      })
    },
    handleResize() {
      if (this.downloadTrendChart) {
        this.downloadTrendChart.resize()
      }
      if (this.hotSoftwareChart) {
        this.hotSoftwareChart.resize()
      }
    }
  },
  created() {
    this.getStatData()
  },
  mounted() {
    this.$nextTick(() => {
      this.initDownloadTrendChart()
      this.initHotSoftwareChart()
      window.addEventListener('resize', this.handleResize)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.downloadTrendChart) {
      this.downloadTrendChart.dispose()
      this.downloadTrendChart = null
    }
    if (this.hotSoftwareChart) {
      this.hotSoftwareChart.dispose()
      this.hotSoftwareChart = null
    }
  }
}
</script>

<style scoped>
.runtime-analysis-container {
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
  color: #67C23A;
  font-weight: bold;
}
.chart-container {
  width: 100%;
  height: 320px;
}
</style>

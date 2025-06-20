<template>
  <div class="runtime-analysis-container">
    <h2>运行生态分析</h2>
    
    <div class="data-overview">
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card blue">
            <div class="icon-wrapper"><i class="el-icon-s-home"></i></div>
            <div class="data-label">部署总量</div>
            <div class="data-value">{{ statData.deployCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card green">
            <div class="icon-wrapper"><i class="el-icon-s-data"></i></div>
            <div class="data-label">当前在线数</div>
            <div class="data-value">{{ statData.onlineCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card orange">
            <div class="icon-wrapper"><i class="el-icon-download"></i></div>
            <div class="data-label">下载总量</div>
            <div class="data-value">{{ statData.downloadCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card purple">
            <div class="icon-wrapper"><i class="el-icon-s-promotion"></i></div>
            <div class="data-label">本月部署量</div>
            <div class="data-value">{{ statData.monthlyDeployCount || 0 }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <div class="filter-container">
      <div class="left-controls">
        <el-button type="primary" icon="el-icon-document" size="small" @click="generateReport">生成报告</el-button>
      </div>
      <div class="right-controls">
        <div class="date-range">
          <el-date-picker
            v-model="dateRange[0]"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            size="small"
          ></el-date-picker>
          <span class="date-separator">至</span>
          <el-date-picker
            v-model="dateRange[1]"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
          ></el-date-picker>
        </div>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">搜索</el-button>
      </div>
    </div>

   
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix title-container">
            <span class="chart-title"><i class="el-icon-s-platform" style="color: #67C23A;"></i> 运行平台分布</span>
          </div>
          <div class="chart-container" v-loading="loading.platformDistribution">
            <div ref="platformDistributionChart" style="width: 100%; height: 400px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix title-container">
            <span class="chart-title"><i class="el-icon-s-cooperation" style="color: #F56C6C;"></i> 版本分布</span>
          </div>
          <div class="chart-container" v-loading="loading.versionDistribution">
            <div ref="versionDistributionChart" style="width: 100%; height: 400px"></div>
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
      dateRange: [
        this.getDefaultStartDate(),
        this.getDefaultEndDate()
      ],
      statData: {
        deployCount: 0,
        onlineCount: 0,
        downloadCount: 0,
        monthlyDeployCount: 0
      },
      loading: {
        downloadTrend: false,
        hotSoftware: false,
        platformDistribution: false,
        versionDistribution: false
      },
      downloadTrendChart: null,
      hotSoftwareChart: null,
      platformDistributionChart: null,
      versionDistributionChart: null
    }
  },
  methods: {
    getDefaultStartDate() {
      const date = new Date()
      date.setDate(1)
      return this.formatDate(date)
    },
    getDefaultEndDate() {
      const date = new Date()
      return this.formatDate(date)
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
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
    handleSearch() {
      this.initCharts()
    },
    generateReport() {
      this.$message.success('正在生成报告，请稍候...')
      setTimeout(() => {
        this.$notify({
          title: '成功',
          message: '运行生态分析报告已生成，请到"我的报告"中查看',
          type: 'success',
          duration: 3000
        })
      }, 2000)
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
              data: xData,
              axisLabel: {
                rotate: 30,
                interval: 0
              }
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
                color: '#E6A23C'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(230, 162, 60, 0.3)'
                  }, {
                    offset: 1, color: 'rgba(230, 162, 60, 0.1)'
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
                  color: function(params) {
                    const colorList = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#8E44AD', '#16A085', '#2980B9']
                    return colorList[params.dataIndex % colorList.length]
                  }
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
    initPlatformDistributionChart() {
      this.loading.platformDistribution = true
      
      // 模拟平台分布数据
      const platformData = [
        { name: 'Windows', value: 45 },
        { name: 'Linux', value: 32 },
        { name: 'macOS', value: 18 },
        { name: 'Android', value: 3 },
        { name: 'iOS', value: 2 }
      ]
      
      this.platformDistributionChart = echarts.init(this.$refs.platformDistributionChart)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: platformData.map(item => item.name)
        },
        series: [
          {
            name: '运行平台',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: platformData,
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
      this.platformDistributionChart.setOption(option)
      this.loading.platformDistribution = false
    },
    initVersionDistributionChart() {
      this.loading.versionDistribution = true
      
      // 模拟版本分布数据
      const versionData = [
        { name: 'v1.0.0', value: 5 },
        { name: 'v1.1.0', value: 8 },
        { name: 'v1.2.0', value: 12 },
        { name: 'v2.0.0', value: 20 },
        { name: 'v2.1.0', value: 25 },
        { name: 'v2.2.0', value: 30 }
      ]
      
      this.versionDistributionChart = echarts.init(this.$refs.versionDistributionChart)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: versionData.map(item => item.name)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '用户数',
            type: 'bar',
            data: versionData.map(item => item.value),
            itemStyle: {
              color: '#F56C6C'
            }
          }
        ]
      }
      this.versionDistributionChart.setOption(option)
      this.loading.versionDistribution = false
    },
    initCharts() {
      this.$nextTick(() => {
        this.initDownloadTrendChart()
        this.initHotSoftwareChart()
        this.initPlatformDistributionChart()
        this.initVersionDistributionChart()
      })
    },
    handleResize() {
      if (this.downloadTrendChart) {
        this.downloadTrendChart.resize()
      }
      if (this.hotSoftwareChart) {
        this.hotSoftwareChart.resize()
      }
      if (this.platformDistributionChart) {
        this.platformDistributionChart.resize()
      }
      if (this.versionDistributionChart) {
        this.versionDistributionChart.resize()
      }
    }
  },
  created() {
    this.getStatData()
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
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
    if (this.platformDistributionChart) {
      this.platformDistributionChart.dispose()
      this.platformDistributionChart = null
    }
    if (this.versionDistributionChart) {
      this.versionDistributionChart.dispose()
      this.versionDistributionChart = null
    }
  }
}
</script>

<style scoped>
.runtime-analysis-container {
  padding: 20px;
}
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
.blue {
  border-top: 3px solid #409EFF;
}
.blue .data-value {
  color: #409EFF;
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
.purple {
  border-top: 3px solid #8E44AD;
}
.purple .data-value {
  color: #8E44AD;
}
.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  justify-content: space-between;
  background-color: #f5f7fa;
  padding: 25px;
  border-radius: 4px;
}
.left-controls {
  display: flex;
  align-items: center;
}
.right-controls {
  display: flex;
  align-items: center;
}
.date-range {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.date-separator {
  margin: 0 10px;
}
.chart-row {
  margin-top: 30px;
}
.chart-container {
  width: 100%;
  height: 400px;
  padding-top: 15px;
}
.box-card {
  height: 100%;
  margin-bottom: 20px;
}
.box-card .el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #EBEEF5;
  box-sizing: border-box;
  height: 65px;
}

.box-card .el-card__body {
  padding-top: 20px;
}

.chart-title {
  font-size: 20px;
  font-weight: 500;
  display: inline-block;
  text-align: center;
}

.chart-title i {
  margin-right: 10px;
  font-size: 22px;
  vertical-align: middle;
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

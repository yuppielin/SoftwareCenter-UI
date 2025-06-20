<template>
  <div class="dev-analysis-container">
    <h2>数据概况</h2>
    
    <div class="data-overview">
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card orange">
            <div class="icon-wrapper"><i class="el-icon-s-data"></i></div>
            <div class="data-label">研发项目总数</div>
            <div class="data-value">{{ statData.projectCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card green">
            <div class="icon-wrapper"><i class="el-icon-s-check"></i></div>
            <div class="data-label">完成项目数</div>
            <div class="data-value">{{ statData.finishedCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card yellow">
            <div class="icon-wrapper"><i class="el-icon-s-custom"></i></div>
            <div class="data-label">开发人员总数</div>
            <div class="data-value">{{ statData.developerCount || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card purple">
            <div class="icon-wrapper"><i class="el-icon-s-opportunity"></i></div>
            <div class="data-label">本月代码提交量</div>
            <div class="data-value">{{ statData.monthlyCommits || 0 }}</div>
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
            <span class="chart-title"><i class="el-icon-s-platform" style="color: #E74C3C;"></i> 开发语言使用情况</span>
          </div>
          <div class="chart-container" v-loading="loading.language">
            <div ref="languageChart" style="width: 100%; height: 400px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix title-container">
            <span class="chart-title"><i class="el-icon-s-grid" style="color: #3498DB;"></i> 技术栈使用情况</span>
          </div>
          <div class="chart-container" v-loading="loading.techStack">
            <div ref="techStackChart" style="width: 100%; height: 400px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getSystemData, uploadTrendNull, downloadTrendNull } from '@/api/analysis'

export default {
  name: 'DevAnalysis',
  data() {
    return {
      dateRange: [
        this.getDefaultStartDate(),
        this.getDefaultEndDate()
      ],
      statData: {
        devUnitCount: 38,
        projectCount: 68,
        finishedCount: 46,
        developerCount: 253,
        monthlyCommits: 1289
      },
      loading: {
        uploadTrend: false,
        downloadTrend: false,
        language: false,
        techStack: false
      },
      uploadTrendChart: null,
      downloadTrendChart: null,
      languageChart: null,
      techStackChart: null
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
          const data = response.data || {}
          this.statData = {
            devUnitCount: data.devUnitCount || 38,
            projectCount: data.projectCount || 68,
            finishedCount: data.finishedCount || 46,
            developerCount: data.developerCount || 253,
            monthlyCommits: data.monthlyCommits || 1289
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
          message: '开发生态分析报告已生成，请到"我的报告"中查看',
          type: 'success',
          duration: 3000
        })
      }, 2000)
    },
    initUploadTrendChart() {
      this.loading.uploadTrend = true
      
      uploadTrendNull().then(response => {
        if (response.code === 20000 && response.data) {
          const { xData = [], yData = [] } = response.data
          
          this.uploadTrendChart = echarts.init(this.$refs.uploadTrendChart)
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
            series: [
              {
                name: '软件',
                type: 'line',
                data: yData.softwareData || [],
                smooth: true,
                itemStyle: {
                  color: '#FFA500'
                }
              },
              {
                name: '软件段',
                type: 'line',
                data: yData.moduleData || [],
                smooth: true,
                itemStyle: {
                  color: '#4CAF50'
                }
              }
            ]
          }
          this.uploadTrendChart.setOption(option)
        } else {
          // 使用模拟数据
          const xData = this.generateDateRange()
          const softwareData = Array(xData.length).fill(0)
          const moduleData = Array(xData.length).fill(0)
          
          this.uploadTrendChart = echarts.init(this.$refs.uploadTrendChart)
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
            series: [
              {
                name: '软件',
                type: 'line',
                data: softwareData,
                smooth: true,
                itemStyle: {
                  color: '#FFA500'
                }
              },
              {
                name: '软件段',
                type: 'line',
                data: moduleData,
                smooth: true,
                itemStyle: {
                  color: '#4CAF50'
                }
              }
            ]
          }
          this.uploadTrendChart.setOption(option)
        }
        this.loading.uploadTrend = false
      }).catch(() => {
        // 使用模拟数据
        const xData = this.generateDateRange()
        const softwareData = Array(xData.length).fill(0)
        const moduleData = Array(xData.length).fill(0)
        
        this.uploadTrendChart = echarts.init(this.$refs.uploadTrendChart)
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
          series: [
            {
              name: '软件',
              type: 'line',
              data: softwareData,
              smooth: true,
              itemStyle: {
                color: '#FFA500'
              }
            },
            {
              name: '软件段',
              type: 'line',
              data: moduleData,
              smooth: true,
              itemStyle: {
                color: '#4CAF50'
              }
            }
          ]
        }
        this.uploadTrendChart.setOption(option)
        this.loading.uploadTrend = false
      })
    },
    initLanguageChart() {
      this.loading.language = true
      
      // 模拟开发语言使用情况数据
      const languageData = [
        { name: 'Java', value: 42 },
        { name: 'JavaScript', value: 28 },
        { name: 'Python', value: 18 },
        { name: 'C++', value: 15 },
        { name: 'C#', value: 12 },
        { name: 'PHP', value: 8 },
        { name: 'Go', value: 7 },
        { name: '其他', value: 10 }
      ]
      
      this.languageChart = echarts.init(this.$refs.languageChart)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: languageData.map(item => item.name)
        },
        series: [
          {
            name: '开发语言',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: languageData,
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
      this.languageChart.setOption(option)
      this.loading.language = false
    },
    initTechStackChart() {
      this.loading.techStack = true
      
      // 模拟技术栈使用情况数据
      const techStackData = [
        { name: 'Spring Boot', value: 35 },
        { name: 'React', value: 25 },
        { name: 'Vue', value: 23 },
        { name: 'Angular', value: 15 },
        { name: 'Django', value: 12 },
        { name: 'Flask', value: 10 },
        { name: 'Express', value: 8 },
        { name: 'Laravel', value: 7 }
      ]
      
      this.techStackChart = echarts.init(this.$refs.techStackChart)
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
          data: techStackData.map(item => item.name).reverse()
        },
        series: [
          {
            name: '使用数量',
            type: 'bar',
            data: techStackData.map(item => item.value).reverse(),
            itemStyle: {
              color: function(params) {
                const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']
                return colorList[params.dataIndex % colorList.length]
              }
            }
          }
        ]
      }
      this.techStackChart.setOption(option)
      this.loading.techStack = false
    },
    generateDateRange() {
      const dates = []
      const start = new Date('2025-06-05')
      const end = new Date('2025-06-20')
      
      let current = new Date(start)
      while (current <= end) {
        dates.push(`2025-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`)
        current.setDate(current.getDate() + 1)
      }
      
      return dates
    },
    initCharts() {
      this.$nextTick(() => {
        this.initLanguageChart()
        this.initTechStackChart()
      })
    },
    handleResize() {
      if (this.languageChart) {
        this.languageChart.resize()
      }
      if (this.techStackChart) {
        this.techStackChart.resize()
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
    if (this.uploadTrendChart) {
      this.uploadTrendChart.dispose()
      this.uploadTrendChart = null
    }
    if (this.downloadTrendChart) {
      this.downloadTrendChart.dispose()
      this.downloadTrendChart = null
    }
    if (this.languageChart) {
      this.languageChart.dispose()
      this.languageChart = null
    }
    if (this.techStackChart) {
      this.techStackChart.dispose()
      this.techStackChart = null
    }
  }
}
</script>

<style scoped>
.dev-analysis-container {
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
.rate-compare {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
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
.yellow {
  border-top: 3px solid #F5A623;
}
.yellow .data-value {
  color: #F5A623;
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
.red {
  border-top: 3px solid #F56C6C;
}
.red .data-value {
  color: #F56C6C;
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

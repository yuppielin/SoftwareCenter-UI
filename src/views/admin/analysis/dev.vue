<template>
  <div class="dev-analysis-container">
    <h2>数据概况</h2>
    
    <div class="data-overview">
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card orange">
            <div class="icon-wrapper"><i class="el-icon-s-data"></i></div>
            <div class="data-label">研发项目总数</div>
            <div class="data-value">{{ statData.totalProjects || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card green">
            <div class="icon-wrapper"><i class="el-icon-s-check"></i></div>
            <div class="data-label">完成项目数</div>
            <div class="data-value">{{ statData.completedProjects || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card yellow">
            <div class="icon-wrapper"><i class="el-icon-s-custom"></i></div>
            <div class="data-label">开发人员总数</div>
            <div class="data-value">{{ statData.totalDevelopers || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="data-card purple">
            <div class="icon-wrapper"><i class="el-icon-s-opportunity"></i></div>
            <div class="data-label">软件版本更新数</div>
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
import { getDataOverview, getLanguageUsage, getTechStackUsage, getReport } from '@/api/ecosystem-analysis'

export default {
  name: 'DevAnalysis',
  data() {
    return {
      dateRange: [null, null],
      statData: {
        totalProjects: 0,
        completedProjects: 0,
        totalDevelopers: 0,
        monthlyCommits: 0
      },
      loading: {
        overview: false,
        language: false,
        techStack: false,
        report: false
      },
      languageChart: null,
      techStackChart: null
    }
  },
  methods: {
    getStatData() {
      this.loading.overview = true
      getDataOverview(this.dateRange[0], this.dateRange[1]).then(response => {
        if (response.code === 200) {
          const data = response.data || {}
          this.statData = {
            totalProjects: data.totalProjects || 0,
            completedProjects: data.completedProjects || 0,
            totalDevelopers: data.totalDevelopers || 0,
            monthlyCommits: data.monthlyCommits || 0
          }
        } else {
          this.$message.error('获取统计数据失败')
        }
        this.loading.overview = false
      }).catch(error => {
        console.error('获取统计数据错误:', error)
        this.$message.error('获取统计数据出错')
        this.loading.overview = false
      })
    },
    handleSearch() {
      this.getStatData()
      this.initCharts()
    },
    generateReport() {
      this.loading.report = true
      getReport(this.dateRange[0], this.dateRange[1]).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: '开发生态分析报告已生成，请到"我的报告"中查看',
            type: 'success',
            duration: 3000
          })
        } else {
          this.$message.error('生成报告失败')
        }
        this.loading.report = false
      }).catch(error => {
        console.error('生成报告错误:', error)
        this.$message.error('生成报告出错')
        this.loading.report = false
      })
    },
    initLanguageChart() {
      this.loading.language = true
      
      getLanguageUsage(this.dateRange[0], this.dateRange[1]).then(response => {
        if (response.code === 200 && response.data) {
          const languageData = response.data || []
          
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
        } else {
          this.$message.error('获取语言使用情况数据失败')
        }
        this.loading.language = false
      }).catch(error => {
        console.error('获取语言使用情况错误:', error)
        this.$message.error('获取语言使用情况出错')
        this.loading.language = false
      })
    },
    initTechStackChart() {
      this.loading.techStack = true
      
      getTechStackUsage(this.dateRange[0], this.dateRange[1]).then(response => {
        if (response.code === 200 && response.data) {
          const techStackData = response.data || []
          
          // 按值排序并取前8个
          const sortedData = [...techStackData].sort((a, b) => b.value - a.value).slice(0, 8)
          
          // 计算Y轴最大值，大于最大数据值的1/3
          const maxValue = Math.max(...sortedData.map(item => item.value))
          const yAxisMax = Math.ceil(maxValue * 1.33)
          
          this.techStackChart = echarts.init(this.$refs.techStackChart)
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: sortedData.map(item => item.name),
              axisLabel: {
                interval: 0,
                rotate: 30
              }
            },
            yAxis: {
              type: 'value',
              max: yAxisMax,
              axisLabel: {
                formatter: '{value}'
              },
              minInterval: 1
            },
            series: [
              {
                name: '使用数量',
                type: 'bar',
                data: sortedData.map(item => item.value),
                itemStyle: {
                  color: function(params) {
                    const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']
                    return colorList[params.dataIndex % colorList.length]
                  }
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}'
                }
              }
            ]
          }
          this.techStackChart.setOption(option)
        } else {
          this.$message.error('获取技术栈使用情况数据失败')
        }
        this.loading.techStack = false
      }).catch(error => {
        console.error('获取技术栈使用情况错误:', error)
        this.$message.error('获取技术栈使用情况出错')
        this.loading.techStack = false
      })
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

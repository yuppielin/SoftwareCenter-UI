<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions() {
      this.chart.setOption({
        dataZoom: [
          {
            show: false,
            height: 0,
            start: this.chartData.xAxis.length < 30 ? 0 : 50,
            end: 100
          },
          {
            type: 'inside',
            zoomLock: true
          }
        ],
        xAxis: {
          data: this.chartData.xAxis,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#000'
            },
            interval: 0,
            rotate: 20// 顺时针旋转20度
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#000'
            }
          }
        },
        legend: {
          data: ['月上传数量'],
          textStyle: {
            color: '#000'
          },
        },
        series: [{
          name: '月上传数量', 
          itemStyle: {
            normal: {
              color: '#3b5ff9',
              lineStyle: {
                color: '#3b5ff9',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: this.chartData.expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    }
  }
}
</script>

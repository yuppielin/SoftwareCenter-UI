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
    options: {
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
    options: {
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
            start: this.options.xAxis.length < 30 ? 0 : 50,
            end: 100
          },
          {
            type: 'inside',
            zoomLock: true
          }
        ],
        xAxis: {
          data: this.options.xAxis,
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
          data: ['CPU使用率', '内存使用率', '网络流量'],
          textStyle: {
            color: '#000'
          },
        },
        series: [{
          name: 'CPU使用率', itemStyle: {
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
          data: this.options.expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '内存使用率',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#5fc27e',
              lineStyle: {
                color: '#5fc27e',
                width: 2
              }
            }
          },
          data: this.options.actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '网络流量',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ffcc00',
              lineStyle: {
                color: '#ffcc00',
                width: 2
              }
            }
          },
          data: this.options.networkData || [],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>

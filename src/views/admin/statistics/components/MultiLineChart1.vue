<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

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
      default: '300px'
    },
    option: {
      type: Object,
      default: null,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    option: {
      deep: true,
      handler(val) {
        this.initChart()
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

      this.chart.setOption({
        dataZoom: [
          {
            show: false,
            height: 0,
            start: this.option.xAxis.length < 30 ? 0 : 50,
            end: 100
          },
          {
            type: 'inside',
            zoomLock: true
          }
        ],
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 30,
          left: '2%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: this.option.legend,
          textStyle: {
            color: '#000'
          },
          x: 'right',
          icon: 'circle'
        },
        xAxis: [{
          data: this.option.xAxis,
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            textStyle: {
              color: '#000'
            },
            interval: 0,
            rotate: 20// 顺时针旋转20度
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#000'
            }
          },
          textStyle: {
            color: '#000'
          }
        }],
        // toolbox: {
        //     show: true,
        //     feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //     }
        // },
        series: [
          {
            name: this.option.legend[0],
            itemStyle: {
              normal: {
                // color: '#FF005A',
                color: 'orange',
                lineStyle: {
                  // color: '#FF005A',
                  color: 'orange',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
            data: this.option.seriesA,
            areaStyle: {
              color: 'rgba(255,165,0,0.1)'
            },
            // markPoint: {
            //   data: [
            //     { type: 'max', name: 'Max' },
            //     { type: 'min', name: 'Min' }
            //   ]
            // },
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // },
            animationDuration
          },
          {
            name: this.option.legend[1],
            type: 'line',
            itemStyle: {
              normal: {
                color: '#2bb56e',
                lineStyle: {
                  color: '#2bb56e',
                  width: 2
                }
                // areaStyle: {
                //   color: '#f3f8ff'
                // }
              }
            },
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
            data: this.option.seriesB,
            // areaStyle: {
            //   color: '#2bb56e',
            // },
            // markPoint: {
            //   data: [
            //     { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
            //     { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
            //   ]
            // },
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // },
            animationDuration
          }
        ]
      })
    }
  }
}
</script>

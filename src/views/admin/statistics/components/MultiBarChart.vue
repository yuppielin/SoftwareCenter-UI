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
      chart: null,
      selected: {}
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
            start: this.option.xAxis.length < 20 ? 0 : 50,
            end: 100
          },
          {
            type: 'inside',
            zoomLock: true
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 40,
          left: '2%',
          right: '6%',
          bottom: '10%',
          containLabel: true
        },
        legend: {
          data: this.option.legend,
          textStyle: {
            color: '#000'
          }
        },
        xAxis: [{
          type: 'category',
          data: this.option.xAxis,
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
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#000'
            }
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
            type: 'bar',
            data: this.option.seriesA,
            // markPoint: {
            //   data: [
            //     { type: 'max', name: 'Max' },
            //     { type: 'min', name: 'Min' }
            //   ]
            // },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            },
            animationDuration
          },
          {
            name: this.option.legend[1],
            type: 'bar',
            data: this.option.seriesB,
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            },
            animationDuration
          }
        ]
      })
    }
  }
}
</script>

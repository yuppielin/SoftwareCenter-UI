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
      default: '100%'
    },
    data: {
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
    data: {
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
            startValue: 0,
            endValue: 10
          },
          {
            type: 'inside',
            zoomLock: true,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
            zoomOnMouseWheel: false
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.data.software,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            textStyle: {
              color: '#000'
            },
            interval: 0,
            rotate: 20//顺时针旋转20度
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
        series: [
          {
            name: '评分',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: this.data.score,
            animationDuration
          }
          // {
          //   name: '成果问题',
          //   type: 'bar',
          //   stack: 'vistors',
          //   barWidth: '60%',
          //   data: [80, 52, 200, 334, 390, 330, 220],
          //   animationDuration
          // }, {
          //   name: '技术支持',
          //   type: 'bar',
          //   stack: 'vistors',
          //   barWidth: '60%',
          //   data: [30, 52, 200, 334, 390, 330, 220],
          //   animationDuration
          // }
        ]
      })
    }
  }
}
</script>

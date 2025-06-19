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
    data: {
      type: Array,
      default: null
    },
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
    }
  },
  data() {
    return {
      chart: null,
      selected: {}
    }
  },
  watch: {
    data() {
      for (let i = 0; i < this.data.length; i++) {
        const name = this.data[i].name
        this.selected[name] = i < 4
      }
      this.initChart()
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.initChart()
      })
    }, 20)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getEqualNewLineString(params, length) {
      let text = ''
      const count = Math.ceil(params.length / length)
      if (count > 1) {
        for (let z = 1; z <= count; z++) {
          text += params.substr((z - 1) * length, length)
          if (z < count) {
            text += '\n'
          }
        }
      } else {
        text += params.substr(0, length)
      }
      return text
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          top: 40,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          left: 'center',
          bottom: '10',
          type: 'scroll',
          selected: this.selected,
          textStyle: {
            color: '#000'
          },
          pageIconColor: '#000',
          pageIconInactiveColor: '#000',
          pageFormatter: '',
          pageButtonItemGap: -6
        },
        series: [
          {
            name: '软件分类统计',
            type: 'pie',
            // roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            minAngle: 0,
            startAngle: 270,
            label: {
              normal: {
                formatter: (params) => {
                  return this.getEqualNewLineString(params.name, 10)
                }
              },
              emphasis: {
                show: true
              }

            }
          }
        ]
      })
      // window.addEventListener('resize', () => {
      //   setTimeout(() => {
      //     this.chart && this.chart.resize()
      //   }, 100)
      // }, false
      // )
    }
  }
}
</script>
<style scoped>
  .chart-box {
    height: 98%;
  }
</style>

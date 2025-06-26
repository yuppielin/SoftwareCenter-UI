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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            name: '软件资源类型',
            type: 'pie',
            // roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            // avoidLabelOverlap: false,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            // itemStyle: {
            //   borderRadius: 10,
            //   borderColor: '#fff',
            //   borderWidth: 2
            // },
            // label: {
            //   show: false,
            //   position: 'center'
            // },
            // emphasis: {
            //     label: {
            //     show: true,
            //     fontSize: '40',
            //     fontWeight: 'bold'
            //     }
            // },
            // labelLine: {
            //   show: false
            // },
            data: this.data,
            minAngle: 0,
            startAngle: 170,
            avoidLabelOverlap: true
          }
        ]
      })
    }
  }
}
</script>

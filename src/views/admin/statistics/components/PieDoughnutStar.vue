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
    formatData(data){
      let sData=[];
      data.forEach(item => {
          let sItem={
            value:item.value,
            name:item.name,
            itemStyle:{
              normal:{
                color:{
                  type:"linear",
                  colorStops:[
                    {offset:0,color:"#00FDFF"},
                    {offset:1,color:"#02364F"},
                  ]
                }
              }
            }
          }
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          show: false
          // text: this.option.title,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient:'vertical',
          // bottom:'5%',
          // left:"right",
          // right:"10%"
          x:'right',
          y:'center',
          icon:'path://M 200 200 l-40 100 100 -80 -120 0 100 80 -40 -120 -40 120z'
        },
        series: [
          {
            name: this.option.title,
            type: 'pie',
            radius: ['40%','60%'],
            avoidLabelOverlap:false,
            data: this.option.data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            // minAngle: 0,
            // startAngle: 270,
            label: {
              normal: {
                formatter: (params) => {
                  return this.getEqualNewLineString(params.name, 10)
                },
                show: false
              },
              emphasis: {
                show:true,
              }
            },
            lableLine:{
                show:false
            }
          }
        ]
      })
    }
  }
}
</script>
<style scoped>
  .chart-box {
    height: 98%;
  }
</style>

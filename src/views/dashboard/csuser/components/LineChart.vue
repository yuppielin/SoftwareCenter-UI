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
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          },
          formatter: function(params) {
            let result = params[0].name + '<br/>';
            const item = params[0];
            result += 
              '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:' + 
              item.color + '"></span>' +
              item.seriesName + ': ' + 
              item.value + '<br/>';
            return result;
          }
        },
        grid: {
          top: 50,
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          data: this.chartData.xAxis,
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true,
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: 12
            },
            interval: 'auto',
            rotate: 0,
            formatter: function(value) {
              // 优化日期显示，如果格式为MM-DD，保持原样
              if (/^\d{1,2}-\d{1,2}$/.test(value)) {
                return value;
              }
              // 如果是完整日期格式，只显示月和日
              if (value.indexOf('-') !== -1) {
                const parts = value.split('-');
                if (parts.length >= 3) {
                  return parts[1] + '-' + parts[2];
                }
              }
              return value;
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#f5f5f5'],
              width: 1,
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: 12
            },
            formatter: function(value) {
              return Math.floor(value); // 确保只显示整数
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#f5f5f5'],
              width: 1,
              type: 'dashed'
            }
          },
          minInterval: 1, // 强制使用整数间隔
          splitNumber: 3, // 默认显示3个刻度
          boundaryGap: [0, '20%'], // 下方从0开始，上方留出20%的空间
          scale: false, // 不自动调整，使用固定间隔
          min: 0, // 强制从0开始
          max: function(value) {
            // 计算最大值，并确保多显示2个刻度
            let maxVal = Math.ceil(value.max);
            if (maxVal <= 3) {
              return 3; // 如果最大值小于等于3，显示0-3的刻度
            } else {
              // 根据最大值计算合适的刻度间隔
              let interval = Math.ceil(maxVal / 3); // 基础间隔
              return maxVal + interval * 2; // 最大值上方多出2个刻度
            }
          }
        },
        legend: {
          data: ['月上传数量'],
          textStyle: {
            color: '#666',
            fontSize: 12
          },
          top: 10,
          right: '4%',
          icon: 'circle'
        },
        series: [{
          name: '月上传数量', 
          itemStyle: {
            normal: {
              color: '#3b5ff9',
              lineStyle: {
                color: '#3b5ff9',
                width: 3
              }
            }
          },
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: false, // 只在hover时显示标记点
          type: 'line',
          data: this.chartData.expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(59,95,249,0.3)'
            }, {
              offset: 0.8,
              color: 'rgba(59,95,249,0)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        }]
      })
    }
  }
}
</script>

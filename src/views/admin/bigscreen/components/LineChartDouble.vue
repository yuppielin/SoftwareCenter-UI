<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "3.5rem"
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
    };
  },
  watch: {
    options: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions();
    },
    setOptions() {
      this.chart.setOption({
        // dataZoom: [
        //   {
        //     show: false,
        //     height: 0,
        //     start: this.options.xaxisData.length < 30 ? 0 : 50,
        //     end: 100
        //   },
        //   {
        //     type: "inside",
        //     zoomLock: true
        //   }
        // ],
        xAxis: {
          type: "category",
          data: this.options.xaxisData,
          boundaryGap: false,
          splitArea: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff"
            },
            interval: 0,
            // rotate: 20 // 顺时针旋转20度
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          // splitLine: {
          //   show: false
          // },
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },

        legend: {
          data: ["上传", "下载"],
          textStyle: {
            color: "#fff"
          },
          left: 0,
          top: 20
        },
        series: [
          {
            name: "上传",
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2
                }
              }
            },
            smooth: true,
            type: "line",
            data: this.options.uploadNum,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          },
          {
            name: "下载",
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  width: 2
                }
              }
            },
            data: this.options.downloadNum,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          }
        ]
      });
    }
  }
};
</script>

<template>
  <div :class="className" :style="{minHeight:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

const animationDuration = 6000;

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
      default: "190px"
	},
	sizes: {
		type: Number,
		default: 10
	},
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.initChart();
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
      let names = [];
      let values = [];
      this.data.forEach(function(val) {
        names.push(val.name);
        values.push(val.value);
	  });
		//   console.log(this.sizes);

	  if(this.data.length<this.sizes) {
		  let i = 0;
		  for(i=0;i<this.sizes-this.data.length;i++) {
			  names.push('');
			  values.push('')
		  }
	  }
	//   console.log(names);
	  let index = 0;
	//   this.chart.showLoading();
      this.chart.setOption({
        title: {
          text: ""
        },
		// backgroundColor: "transparent",
        // backgroundColor: "red",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legeng: {},
        grid: {
          left: "3%",
          right: "4%",
		  bottom: "3%",
		  top: 0,
          containLabel: true
        },
        xAxis: {
			type: "value",
			boundaryGap: [0, 0.01],

			splitLine: {
				show: false
			},
			splitArea: {
				show: false
			},
			axisLabel: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLine: {
				show: false
			}
        },
        yAxis: {
		  type: "category",
		  inverse: true,
		//   splitLine: {
		// 	show: false
		//   },
        //   splitArea: {
        //     show: false
        //   },
          axisLabel: {
            inside: true,
            color: "#fff"
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10,
          data: names
        },
        series: [
          {
            name: "",
			type: "bar",
			// barCategoryGap: '40%',
			// barGap: '15%',
			barMaxWidth: '15',
			label: {
              show: true,
              position: 'right'
            },
            data: values,
            itemStyle: {
				normal: {
					color: function(colors) {
						var colorList = [
							"#fc8251",
							"#5470c6",
							"#9a60b4",
							"#ef6567",
							"#f9c956",
							"#3ba272"
						];
						// return colorList[colors.dataIndex]
						if (colors.dataIndex == colorList.length) {
							index = 0;
						}
						index++;
						return colorList[index];
					},
					barBorderRadius: 4
				},
				
            }
          }
        ]
	  });
	//   this.chart.hide（Loadig
    }
  }
};
</script>

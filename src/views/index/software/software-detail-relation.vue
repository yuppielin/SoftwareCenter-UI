<template>
    <el-dialog
    title="软件关联关系"
    :visible.sync="visible"
    :before-close="beforeClose"
    >
      <div id="echartMain" style="height:500px;width:100%"></div>
    </el-dialog>
  </div>
</template>

<script>
import echarts  from 'echarts'
import * as software from "@/api/software";

export default {
  name: 'software-relation',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      myChart: null,
      visible: false,
      echartData:{}
    }
  },
   watch: {
    dialogVisible(newVal, oldVal) {
      this.visible = newVal;
      if (newVal) {
        this.$nextTick(() => {
            // this.initEcharts();
            this.getSoftwareRelation();
        })
      }
     
    },
  },
  created() {
    // this.getSoftwareTimeline()

  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
     
  },
  methods: {
    initEcharts() {
        this.myChart = echarts.init(document.getElementById('echartMain'))
        let nodes = this.echartData.nodes;
        let links = this.echartData.links;
    
        let option = {
            series:[{
                type: 'graph',
                layout: 'force',
                symbolSize: 20,
                symbol:'circle',
                roam:false,
                edgeSymbol: ["none", "arrow"],
                force: {
                    repulsion: 500
                },
                itemStyle: {
                    color: "#a1a1a1"
                },
                label: {
                    show: true,
                    position: "bottom",
                    distance: 5,
                    fotSize: 18,
                    align: "center"
                },
                nodes: nodes,
                links: links,
                linkStyle: {
                    opacity: 0.9,
                    width:2,
                    curveness:0
                }
            }]
        }
        this.myChart.setOption(option)
    },
    getSoftwareRelation() {
        
        let versionId = this.data.id;
        software.getSoftwareRelation(versionId).then(response => {
          if (response.code === 200) {
            this.echartData = response.data;
            this.initEcharts();
          }
        });
    },
    beforeClose() {
      this.$emit("closeSoftwareRelation");
    },
  }
}
</script>

<style scoped >
</style>

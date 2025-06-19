<template>
  <div>
    <div id="guanxi" />

    <el-card v-for="(item,index) in dependencyData" :key="index" style="width:23.8%;float:left;margin:5px 10px;background-color: #0a76a4">
      <img width="60px" height="60px;" :src="item.logo == null?defaultS:logoAndPicUrl+item.logo" :onerror="defaultS" style="float:left;">
      <div style="float:left;margin-left:10px;line-height:30px">
        <div style="font-weight:600">
          <el-link :underline="false" style="color: white;margin-right: 2px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis" v-if="item.softwareName">名称：{{ item.softwareName }}</el-link>
          <el-link :underline="false" style="color: red"  v-else>该软件未录入</el-link>
          <el-tag type="warning" size="mini" v-if="item.versionNames">
            {{ item.versionNames }}
          </el-tag>
        </div>
        <div>标识：{{ item.name }}</div>
      </div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
import * as software from '@/api/software'
import { getSoftwareDependency } from '../../../api/software'
// import * as appConfig from '/public/config'
export default {
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          logoAndPicUrl: appConfig.config.urlFilePrefix
        }
      }
    }
  },
  data() {
    return {
      defaultS: 'this.src="' + require('@/assets/index/software.png') + '"',
      dependencyData: []
    }
  },
  mounted() {
    this.getSoftwareDependency(this.$route.params.id)
  },
  methods: {
    getSoftwareDependency(softwareId) {
      software.getSoftwareDependency(softwareId).then(response => {
        if (response.code === 200) {
          const softwareDependency = response.data
          this.dependencyData = softwareDependency.children.filter(item => item.name.startsWith('S'))
          this.drawguanxi(softwareDependency)
        }
      })
    },
    drawguanxi(softwareData) {
      const myChart = echarts.init(document.getElementById('guanxi'))
      myChart.showLoading()
      const data = softwareData
      // $.get('data/asset/data/flare.json', function (data) {
      myChart.hideLoading()
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [data],
            left: '2%',
            right: '2%',
            top: '8%',
            bottom: '20%',
            symbol: 'emptyCircle',
            orient: 'vertical',
            expandAndCollapse: true,
            label: {
              normal: {
                position: 'top',
                // rotate:-90,
                verticalAlign: 'middle',
                align: 'center',
                fontSize: 14,
                color: '#fff'
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'bottom',
                  // rotate: -90,
                  verticalAlign: 'middle',
                  align: 'center',
                  fontSize: 12
                }
              }
            },
            animationDurationUpdate: 750
          }
        ]
      }
      myChart.setOption(option)
      // });
      // var myChartContainer = document.getElementById('gunxi')
      // var resizeMyChartContainer = function() {
      //     myChartContainer.style.height = window.innerHeight * 0.65 + 'px';
      //     myChartContainer.style.width = window.innerWidth * 0.75 + 'px';
      // };
      // 设置容器高和宽
      //  resizeMyChartContainer();
      // 自适应高和宽
      window.onresize = function() {
        // resizeMyChartContainer();
        myChart.resize()
      }
    }
  }
}
</script>
<style scoped>
    #guanxi{
        height: 300px;
        width:calc(100vw - 200px);
        text-align: center;
        margin:0 auto;
    }
</style>

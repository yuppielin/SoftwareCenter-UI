<template>
  <div style="margin:60px 20px 0 20px;">
    <div slot="title">
      <i class="el-icon-s-operation" />
      <span style="font-weight:600;margin-left:10px;">软件及软件的依赖关系({{ softwareData.length }})</span>
    </div>
    <el-card v-for="(item,index) in softwareData" :key="index" style="margin-top:10px;" @click.native="drawguanxi(item.id)">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-row :gutter="10">
            <el-col :span="14">
              <div style="width:100px;height:100px;float:left;">
                <img :src="logoAndPicUrl+item.logo" width="90" height="90" style="margin:15px;">
              </div>
              <div style="margin-left: 20px;height:90px;float:left;">
                <h2>{{ item.name }}</h2>
                <span class="content">{{ item.content }}</span>
              </div>
            </el-col>
            <el-col :span="6" style="text-align:right;">
              <el-rate v-model="item.rate" show-score text-color="#ff9900" score-template="{value}" style="margin-top:35px" disabled />
            </el-col>
            <el-col :span="4" style="text-align:right;">
              <el-button size="small" style="background: #05994e;color: white;margin-top:30px;">立即下载</el-button>
            </el-col>
          </el-row>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <div :id="'draw_'+item.id" class="guanxi" />-->
<!--           {{drawguanxi(item.id)}}-->
<!--        </el-col>-->
      </el-row>

    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
// import * as appConfig from '/public/config'
export default {
  data() {
    return {
      activeNames: ['1'],
      softwareData: [
        {
          id: 1,
          name: '腾讯软件',
          logo: require('@/assets/index/software.png'),
          version: '1.2.1',
          content: '高清互联网电视、视频等',
          size: '123.3M',
          rate: 4.3
        },
        {
          id: 2,
          name: 'QQ软件',
          logo: require('@/assets/index/software.png'),
          version: '1.2.1',
          content: '高清互联网电视、视频等',
          size: '123.3M',
          rate: 4.3
        },
        {
          id: 3,
          name: '安全软件',
          logo: require('@/assets/index/software.png'),
          version: '1.2.1',
          content: '高清互联网电视、视频等',
          size: '123.3M',
          rate: 4.3
        }
      ],
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  methods: {
    drawguanxi(id) {
      const myChart = echarts.init(document.getElementById('draw_' + id))
      myChart.showLoading()
      const data = {
        'name': '在线交付软件',
        'children': [
          { 'name': '统一用户软件', 'value': 3938 },
          { 'name': '安装部署软件', 'value': 3812 },
          { 'name': '软件运维软件', 'value': 6714 },
          { 'name': '容器调度软件', 'value': 743 }
        ]
      }
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
            top: '20%',
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
                fontSize: 14
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
      this.$nextTick(() => {
        myChart.setOption(option)
      })

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
 .guanxi{
        height: 100px;
        width:;
        text-align: center;
        margin:0 auto;
    }
</style>

<template>
  <div class="app-container">
     <div style="margin-top:20px;text-align:right;">
       <el-date-picker size="small" style="margin-left:10px;"
        v-model="search.date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button size="small" type="primary" style="color:white;margin-left:10px" >搜索</el-button>
      <el-button size="small" style="background:gray;color:white" >报告导出</el-button>
    </div>
    <el-row style="background:#fff;padding:16px 16px 0;margin:10px  0 32px 0;">
      <BarChartDemand></BarChartDemand>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin:10px  0 32px 0;">
      <MultiLineChart :option="questionOption"></MultiLineChart>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;"> 
          <MultiBarChart class="chart-wrapper" :option="typeOption"></MultiBarChart>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div style="background:#fff;padding:16px 16px 0;margin:0  0 32px 0;">
          <MultiBarChart class="chart-wrapper" :option="typeOption"></MultiBarChart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MultiLineChart from './components/MultiLineChart.vue'
import MultiBarChart from './components/MultiBarChart.vue'
import BarChartDemand from './components/BarChartDemand.vue'

export default {
  components: {
    MultiLineChart,
    MultiBarChart,
    BarChartDemand
  },
  data() {
    return {
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      search:{
        offerUnit:'',
        type:'',
        date:''
      },
      questionOption:{
        title:'',
        subTitle:'',
        legend:['需求','建议'],
        xAxis:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        seriesA:[1,8,11,19,30,49,18,49,98],
        seriesB:[12,12,12,12,33,44,12,45,88]
      },
      platformOption:{
        legend:['需求','建议'],
        xAxis:['Windows', 'Linux', '申威平台', '龙芯平台', '兆芯平台','其他'],
        seriesA:[1,8,11,19,30,49,18,49,98],
        seriesB:[12,12,12,12,33,44,12,45,88]
      },
      typeOption:{
        legend:['需求','建议'],
        xAxis:['应用软件','支撑软件','共性软件','系统软件','工具软件','其他'],
        seriesA:[1,8,11,19,30,49,18,49,98],
        seriesB:[12,12,12,12,33,44,12,45,88]
      },
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;
  margin-top: 20px;
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

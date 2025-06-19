<template>
  <div id="container">
    <header>
      <h1>在线产品交付-软件资源中心</h1>
      <div class="showTime"></div>
      <td style="text-align: right;" width="50%" align="right">
        <div class="toHome">
          <i class="fa fa fa-arrow-right"></i> &nbsp;
          <a @click.stop="goManage" style="color: #fff;font-size: 14px">后台管理</a>
        </div>
      </td>
    </header>
	<el-row :gutter="10" class="mainbox_top">
      <el-col :span="3">
        <el-card class="topCard bg-blue">
          <div class="topTitle"><i style="color: blue;" class="el-icon-s-help"></i>在网系统总数量</div>
          <div class="topNum">{{topShowInfo.softwareAllNum}}</div>
          <!-- <div class="topTitle">
                  软件段总数
                  <span style="margin-left:40px;">{{topShowInfo.fragmentNum}}</span>
          </div>-->
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard bg-green">
          <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i>软件段总数</div>
          <div class="topNum">{{topShowInfo.fragmentNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard bg-purple">
          <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i>在网软件总数</div>
          <div class="topNum">{{topShowInfo.softwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard bg-blue">
          <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i>待审批</div>
          <div class="topNum">{{topShowInfo.unAuditSoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard bg-green">
          <div class="topTitle"><i style="color: green;" class="el-icon-s-help"></i>待试用</div>
          <div class="topNum">{{topShowInfo.unTrySoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard bg-purple">
          <div class="topTitle"><i style="color: green;" class="el-icon-s-help"></i>待安检</div>
          <div class="topNum">{{topShowInfo.unDetectionSoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard bg-blue">
          <div class="topTitle"><i style="color: #da586a;" class="el-icon-s-help"></i>安检不合格数</div>
          <div class="topNum">{{topShowInfo.DetectionRejectSoftwareNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="topCard bg-green">
          <div class="topTitle"><i style="color: #da586a;" class="el-icon-s-help"></i>安检不合格率</div>
          <div class="topNum">{{topShowInfo.detection_probability}}</div>
          <!-- <div class="topTitle">
            较上月
            <img v-if="topShowInfo.detection_change_probability.indexOf('+')!=-1" :src="require('@/assets/index/up.png')" />
            <img v-if="topShowInfo.detection_change_probability.indexOf('-')!=-1" :src="require('@/assets/index/down.png')" />
            {{topShowInfo.detection_change_probability}}
          </div> -->
        </el-card>
      </el-col>
    </el-row>
    <section class="mainbox">
      <div class="column">
        <div class="panel pie">
          <h2>软件下载量TOP10</h2>
          <div class="chart" style="margin-top: 10px">
            <BarChartSort :data="software_download_sort"></BarChartSort>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- <div class="panel pie1">
          <h2>软件需求类型分布</h2>
          <div class="chart" style="margin-top: 10px">
            <PieChartDemandCate :data="demand_cate_num"></PieChartDemandCate>
          </div>
        </div> -->
		<div class="panel pie1">
          <h2>软件资源类型分布</h2>
          <div class="chart" style="margin-top: 10px">
            <BarChartSourceCate :data="source_type"></BarChartSourceCate>
          </div>
        </div>

        <div class="panel pie3">
          <h2>技术支持软件TOP10</h2>
          <div class="chart" style="margin-top: -10px">
            <BarChartSort :data="technology_sort"></BarChartSort>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="column" style="margin-bottom: 0px;padding:0 10px">
        <!-- <div class="no">
          <div class="no-hd">
            <ul>
              <li>10</li>
              <li>10</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>软件资源段数量</li>
              <li>通用基础软件数量</li>
            </ul>
          </div>
        </div>-->
        <div class="map">
          <div class="chart">
            <ChinaMap ref="ChinaMap" style="width:100%;" />
          </div>
          <div class="pic_raw">
            <div class="map1"></div>
            <div class="map2"></div>
            <div class="map3"></div>
          </div>
        </div>

        <!-- <div class="panel bar1" style="margin-top: -135px;height: 3.0rem">
          <h2>软件资源类型分布</h2>
          <div class="chart" style="margin-top: -40px">
            <BarChartSourceCate :data="source_type"></BarChartSourceCate>
          </div>
          <div class="panel-footer"></div>
        </div> -->
		<div class="panel bar1" style="margin-top: -137px;height: 3.5rem">
          <h2>软件上传/下载</h2>
          <div class="chart" style="margin-top: -40px">
            <LineChartDouble :options='software_download_upload_num'></LineChartDouble>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="column">
        <!-- 需求量占前10的软件 -->
        <!-- <div class="panel pie4">
          <h2>软件需求TOP10</h2>
          <div class="chart" style="margin-top: 0px;height: 3.1rem">
            <BarChartSort :data="demand_software_sort"></BarChartSort>
          </div>
          <div class="panel-footer"></div>
        </div> -->
		<div class="panel pie4">
          <h2>用户登录次数排行TOP10</h2>
          <div class="chart" style="margin-top: 0px;height: 3.1rem">
            <BarChartSort :data="user_login_num_sort"></BarChartSort>
          </div>
          <div class="panel-footer"></div>
        </div>

        <div class="panel pie2">
          <h2>软件分类数量</h2>
          <div class="chart" style="margin-top: -10px">
			  <PieChart :data="software_cate_num"></PieChart>
		  </div>
          <div class="panel-footer"></div>
        </div>

        <div class="panel bar">
          <h2>软件评价TOP10</h2>
          <div class="chart" style="margin-top: -10px;font-size: 8px">
			  <BarChartSort :data="software_score_sort"></BarChartSort>
		  </div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as bigscreen from "@/api/bigscreen";
// import * as bigscreen from '@/api/statistics'
import * as analysis from "@/api/analysis";

export default {
  components: {
    ChinaMap: () => import("./components/china/chinaMap"),
    // PieChartDemandCate: () => import("./components/PieChartDemandCate"),
    BarChartSort: () => import("./components/BarChartSort"),
    BarChartSourceCate: () => import("./components/BarChartSourceCate"),
    PieChart: () => import("./components/PieChart"),
    LineChartDouble: () => import("./components/LineChartDouble"),
  },
  data() {
    return {
      topShowInfo: {
        DetectionRejectSoftwareNum: 5,
        detection_probability: "0%",
        detection_change_probability: "-100.00%",
        unAuditSoftwareNum: 33,
        fragmentNum: 65,
        unTrySoftwareNum: 0,
        softwareAllNum: 99,
        unDetectionSoftwareNum: 4,
        softwareNum: 19
      },
      software_download_sort: [],
      technology_sort: [],
      source_type: [],
      software_cate_num: [
        // { name: "分类1", value: 2 },
      ],
      demand_cate_num: [
        // { name: "分类1", value: 2 },
      ],
      software_score_sort: [
        // { name: "软件1", value: 10 },
      ],
      demand_software_sort: [
        // { name: "软件11", value: 4 },
	  ],
	  user_login_num_sort: [],
	  software_download_upload_num: [],
    };
  },
  mounted() {
    // 时间
    this.showTime();
	setInterval(this.showTime, 1000);
	
	this.getTopShowInfo();

    this.getSoftwareDownload();
    // this.getDemandCateNum();
    // this.getSoftwareDemandNumSort();
    this.getSoftwareScoreSort();
    this.getSoftwareTypeNum();
    this.getSoftwareQuestionSort();
	this.getSoftwareCateNum();
	this.getUserLoginNumSort();
	this.getSoftwareDownloadUploadNum();
  },
  methods: {
    showTime() {
      let dt = new Date();
      var y = dt.getFullYear();
      var mt = dt.getMonth() + 1;
      var day = dt.getDate();
      var h = dt.getHours(); //获取时
      var m = dt.getMinutes(); //获取分
      var s = dt.getSeconds(); //获取秒
      document.querySelector(".showTime").innerHTML =
        '<i class="fa fa fa-clock-o"></i>&nbsp;' +
        y +
        "年" +
        mt +
        "月" +
        day +
        "日 - " +
        h +
        "时" +
        m +
        "分" +
        s +
        "秒";
	},
	getTopShowInfo() {
      analysis.getDataSituation().then(response => {
        if (response.code == 200) {
          this.topShowInfo = response.data;
        }
      });
    },
    // 软件下载量排行
    getSoftwareDownload() {
      bigscreen.getSoftwareDownload().then(response => {
        this.software_download_sort = response.data;
      });
    },
    // 需求分类数量
    getDemandCateNum() {
      bigscreen.getDemandCateNum().then(response => {
        this.demand_cate_num = response.data;
      });
    },
    // 软件需求数量排行
    getSoftwareDemandNumSort() {
      bigscreen.getSoftwareDemandNumSort().then(response => {
        this.demand_software_sort = response.data;
      });
    },
    // 软件评价排行
    getSoftwareScoreSort() {
      bigscreen.getSoftwareScoreSort().then(response => {
        this.software_score_sort = response.data;
      });
    },
    // 软件分类数量
    getSoftwareTypeNum() {
      bigscreen.getSoftwareTypeNum().then(response => {
        this.source_type = response.data;
      });
    },

    // 软件技术支持数量
    getSoftwareQuestionSort() {
      bigscreen.getSoftwareQuestionSort().then(response => {
        this.technology_sort = response.data;
      });
    },

    // 各个软件分类软件的数量
    getSoftwareCateNum() {
      bigscreen.getSoftwareCateNum().then(response => {
        this.software_cate_num = response.data;
      });
	},
	
	getUserLoginNumSort() {
		bigscreen.getUserLoginNumSort().then(response => {
			this.user_login_num_sort = response.data;
		});
	},

	getSoftwareDownloadUploadNum() {
		bigscreen.getSoftwareDownloadUploadNum().then(response => {
			this.software_download_upload_num = response.data;
		});
	},

    goManage() {
      this.$router.push({
        path: "/admin/overview"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
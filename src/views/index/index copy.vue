<template>
  <div class="app-container">
    <el-card class="recommend-software" header="推荐成果">
      <Swiper :speed="1" :direction="'left'" />
    </el-card>
    <el-row id="software-list" :gutter="10">
      <el-col :span="18">
        <el-card class="index-sfotware">
          <div slot="header">
            <el-row>
              <el-col :span="20">
                <el-button type="primary" size="mini">应用列表</el-button>
                <el-dropdown style="margin-left:10px;">
                  <span class="el-dropdown-link">
                    <span style="color:#1890ff">应用类别</span>
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in typeData" :key="item.id">{{ item.name }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="4" style="text-align:right">
                <el-button size="mini" @click="downloadMutil=!downloadMutil">批量下载</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- <Sitem  v-for="item in softwareData" :data="item"/> -->
          <el-table
            :data="softwareData"
            size="mini"
            :border="false"
            :show-header="false"
            @select-change="selectedSoftware"
          >
            <el-table-column v-if="downloadMutil" type="selection" width="60" align="center" header-align="center" />
            <el-table-column>
              <template slot-scope="scoped">
                <Sitem :data="scoped.row" />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top:20px"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="margin-top:10px;" class="newdata">
          <div slot="header">
            <i class="el-icon-magic-stick" style="color:green" />
            <span style="margin-left:10px;color:rgb(8, 151, 151)">最新软件</span>
          </div>
          <el-table :data="newData" :show-header="false" size="mini" highlight-current-row>
            <el-table-column width="20" type="index">
              <template slot-scope="scoped">
                <span style="font-size:20px;color:#f65b0d;font-weight:600;">{{ scoped.$index+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scoped">
                <div class="info-box">
                  <div style="float:left;padding:10px 0">
                    <img :src="scoped.row.name+'?imgSource'" :onerror="defaultImg" width="40px" height="40px">
                  </div>
                  <div style="float:left;margin-left:10px;">
                    <div style="font-size:16px;font-weight:500;color:#4182e1;margin-top:10px;">{{ scoped.row.name }}</div>
                    <div style="font-size:12px;color:lighthray;">{{ scoped.row.category }}</div>
                    <!-- <el-button type="text" size="mini">查看</el-button> -->
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="margin-top:10px;">
          <div slot="header">
            <i class="el-icon-magic-stick" style="color:red" />
            <span style="margin-left:10px;color:#f65b0d">热门成果</span>
          </div>
          <el-table :data="hotData" :show-header="false" size="mini" highlight-current-row>
            <el-table-column width="20" type="index" />
            <el-table-column>
              <template slot-scope="scoped">
                <div class="info">
                  {{ scoped.row.name }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as software from '@/api/software'
import Swiper from './components/image-swiper.vue'
import Sitem from './components/software-item.vue'
export default {
  name: 'Index',
  components: {
    Swiper,
    Sitem
  },
  data() {
    return {
      activeName: 'first',
      currentPage: 1,
      imgSource: require('@/assets/index/software.png'),
      defaultImg: 'this.src="' + require('@/assets/index/software.png') + '"',
      selectedSoftware: [],
      downloadMutil: false,
      typeData: [
        // {
        //     id:1,
        //     name:'基础软件'
        // },
        // {
        //     id:2,
        //     name:'应用软件'
        // },
        // {
        //     id:3,
        //     name:'系统软件'
        // },
        // {
        //     id:4,
        //     name:'支撑软件'
        // },
        // {
        //     id:5,
        //     name:'工具软件'
        // },
        // {
        //     id:6,
        //     name:'共性软件'
        // }
      ],
      softwareData: [
        //   {
        //       name:'资源服务软件',
        //       logo:require("@/assets/imgs/1.png"),
        //       type:'支撑软件',
        //       version:["1.0","2.0","3.0"],
        //       description:"软件成果描述",
        //       createTime:"2022-03-25",
        //       downloadNumber:10
        //   },
      ],
      totalPage: 0,
      pageSize: 10,
      pageNum: 1,
      hotData: [],
      newData: []
      // recommendData:[1]
    }
  },
  watch: {
  },
  created() {
    this.getSoftwareList()
    this.getLatestSoftware()
    this.getHotSoftware()
    this.getRecommendSoftware()
    this.getSoftwareTypeData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getSoftwareList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSoftwareList()
    },
    // eslint-disable-next-line vue/no-dupe-keys
    selectedSoftware(value) {
      this.selectedSoftware = value
    },
    // 获取成果清单
    getSoftwareList() {
      software.getSoftwareList(this.pageNum, this.pageSize).then(response => {
        this.softwareData = response.data.list
        this.totalPage = response.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取最新成果列表
    getLatestSoftware() {
      software.getLatestSoftwareList().then(response => {
        this.newData = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取最热成果列表
    getHotSoftware() {
      software.getHotSoftwareList().then(response => {
        this.hotData = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取推荐成果
    getRecommendSoftware() {
      software.getRecommendSoftwareList().then(response => {
        this.recommendData = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取成果类型
    getSoftwareTypeData() {
      software.getSoftwareType().then(response => {
        this.typeData = response.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }
    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    #software-list >>> .el-table th.is-leaf, .el-table td {
        border-bottom: 0px solid #dfe6ec;
    }
    .app-container >>> .el-card__header{
        padding: 10px 20px;
    }
    .app-container >>> .el-card__body{
        padding: 10px 20px;
    }
    .app-container
    .system-message{
        max-height: 200px;
        overflow-y: auto;
    }
    .recommend-software{
        height: 150px;
        margin-top: 10px;
    }
    .index-sfotware{
        margin-top: 10px;
    }
    .item {
        display: block;
        position: relative;
        width: 100%;
        margin-bottom: 20px;
    }
    .info{
        height: 14px;
        margin: 4px 0;
        font-size: 16px;
        line-height: 18px;
        font-weight: 500;
        color:#4182e1;
    }
</style>

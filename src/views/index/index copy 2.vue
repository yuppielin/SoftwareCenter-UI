<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="19">
        <el-carousel :interval="4000" type="card" height="350px" :autoplay="false">
          <el-carousel-item v-for="(item,index) in imgList" :key="index" style="padding:20px 100px;">
            <el-row :gutter="20">
              <el-col :span="9">
                <img :src="item.logo?item.logo:defaultS" :onerror="defaultS" width="200" height="160" style="margin-top:30px;">
              </el-col>
              <el-col :span="15" style="color: #fff">
                <div style="margin-top:30px;font-size:28px;font-weight:600;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
                  <router-link :underline="false" :to="{path:'/index/list/'+item.id,query:{version:item.version}}">{{ item.name }}</router-link>
                  <el-tag v-if="item.version" type="primary" size="mini" style="margin: 0 10px;">{{ item.version }}</el-tag>
                </div>
                <div style="font-size:14px;margin-top:10px;" v-if="item.identity">< {{ item.identity }} ></div>
<!--                <el-input style="height: 100px" rows="5" v-model="item.description"></el-input>-->
                <div style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px" v-if="item.description">
                  {{ item.description.length > 150 ? item.description.substring(0,100) + '......' : item.description}}
                </div>
                <div style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px" v-else>
                  {{ item.description}}
                </div>
              </el-col>
            </el-row>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="5">
            <el-card style="height:350px;background:linear-gradient(180deg,rgb(174,191,207)0%,rgb(255,255,255)100%)">
                <div slot="header">
                    <i class="el-icon-s-data"></i>
                    <span>  下载排行</span>
                </div>
                <el-row :gutter="10"  v-for="(item,index) in hotData" :key="index" style="line-height:30px;height:30px;">
                        <el-col :span="3">
                            <span>{{index+1}}</span>
                        </el-col>
                        <el-col :span="14">
                            <span style="font-size:16px;font-weight:600">{{item.name}}</span>
                        </el-col>
                        <el-col :span="6">
                            <div class="info-btn" style="margin-top:0px;display:inline-block;">
                                <div class="info-text" style="font-size:12px;margin-top:0px">{{item.downloadCon}} 次下载</div>
                                 <el-button type="primary" size="mini"  class="downBtn" >立即下载</el-button>
                            </div>
                        </el-col>
                    </el-row>
            </el-card>
        </el-col>
    </el-row>
    <!--最新最热软件--->
    <el-row :gutter="20" >
      <el-col :span="19" v-if="newData.size>0">
        <el-row :gutter="10" style="height:112px;margin-bottom: 10px">
          <el-col v-for="(item,index) in newData" :key="index" :span="6">
            <el-card style="height:112px;position:relative;overflow:hidden;margin-bottom: 10px;">
              <div class="ribbon">
                <span>New</span>
              </div>
              <div class="info-box">
                <div style="float:left;padding:10px 0;width: 20%">
                  <img :src="item.name+'?imgSource'" :onerror="defaultImg" width="60px" height="60px">
                </div>
                <div style="float:left;margin-left:10px;width: 70%">
                  <div style="font-size:16px;font-weight:500;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
                    <router-link :underline="false" :to="{path:'/index/list/'+item.id,query:{version:item.version}}">{{ item.name }}</router-link>
                  </div>
                  <div style="font-size:14px;color:rgba(149,149,163,1);margin-top:10px;">< {{ item.identity }} ></div>
                  <div class="info-btn">
                    <div class="info-text">{{ item.ctime }}</div>
                    <el-button type="primary" size="mini" class="downBtn" @click="downloadSoftware(item)">立即下载</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <!-- <el-col v-if="hotData.size>0">
        <el-row :gutter="10" style="height:112px;margin-top: 10px">
          <el-col v-for="(item,index) in hotData" :key="index" :span="6">
            <el-card style="height:112px;position:relative;overflow:hidden;margin-bottom: 10px">
              <div class="ribbon" style="background:orange">
                <span>Hot</span>
              </div>
              <div class="info-box">
                <div style="float:left;padding:10px 0;width: 20%">
                  <img :src="item.name+'?imgSource'" :onerror="defaultImg" width="60px" height="60px">
                </div>
                <div style="float:left;margin-left:10px;width: 70%">
                  <div style="font-size:16px;font-weight:500;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
                    <router-link :underline="false" :to="{path:'/index/list/'+item.id,query:{version:item.version}}">{{ item.name }}</router-link>
                  </div>
                  <div style="font-size:14px;color:rgba(149,149,163,1);margin-top:10px;">< {{ item.identity }} ></div>
                  <div class="info-btn">
                    <div class="info-text">{{ item.downloadCon }} 次下载</div>
                    <el-button type="primary" size="mini" class="downBtn" @click="downloadSoftware(item)">立即下载</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col> -->
      <el-col :span="5">
              <el-card style="height:260px;background:linear-gradient(180deg,rgb(174,191,207)0%,rgb(255,255,255)100%)">
                <div slot="header" style="height:20px;line-height:20px;">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <i class="el-icon-message-solid"></i>
                            <span> 系统公告</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right">
                            <el-button type="text" size="mini">更多 >></el-button>
                        </el-col>
                    </el-row>
                </div>
                <message-item v-for="(item,index) in messageData" :key='index' :item=item></message-item>
            </el-card>
              <el-card style="height:260px;background:linear-gradient(180deg,rgb(174,191,207)0%,rgb(255,255,255)100%)">
                <div slot="header" style="height:20px;line-height:20px;">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <i class="el-icon-message-solid"></i>
                            <span> 消息通知</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right">
                            <el-button type="text" size="mini">更多 >></el-button>
                        </el-col>
                    </el-row>
                </div>
                <message-item v-for="(item,index) in messageData" :key='index' :item=item></message-item>
            </el-card>
          </el-col>
    </el-row>
    <!-- <el-card style="margin-top:10px;">
      <div slot="header" style="line-height:20px;height:20px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <i class="el-icon-menu" />专题软件
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button type="text" size="mini" style="margin-left:10px;color: rgba(59,89,117,1)" @click="goToThemeMore"> 更多>></el-button>
          </el-col>
        </el-row>
      </div>
      <theme-item v-for="(item,index) in themeData" :key="index" style="width:23%;margin:10px;float:left;" :data="item" />
    </el-card> -->
    <div id="software-list">
      <el-card style="margin-top:10px;">
        <div slot="header" style="line-height:20px;height:20px;">
          <el-row :gutter="20">
            <el-col :span="12">
              <i class="el-icon-menu" />常用分类
            </el-col>
            <el-col :span="12" style="text-align:right;">
              <!--              <el-input size="mini" style="width:200px;" suffix-icon="el-icon-search" placeholder="请输入关键字" v-model="queryStr" @change="getSoftwareList" />-->
              <el-autocomplete
                v-model="queryStr"
                class="inline-input"
                :fetch-suggestions="querySearch"
                placeholder="请输入关键字(名称、接口标识、版本)"
                style="width: 260px;background-color: #0f1518;color: #ffffff"
                @select="getSoftwareList"
                @change="getSoftwareList"
              />
              <el-button type="text" size="mini" style="margin-left:10px;color:rgba(59,89,117,1)" @click="gotoSoftwareMore"> 更多>></el-button>
            </el-col>
          </el-row>
        </div>
        <div id="categroy-nav" style="height:30px;line-height:30px;">
          <!--          <el-link :underline="false" class="categroy-nav-item" :class="['categroy-nav-item',{'categroy-nav-curr':isCurrent=='全部'}]" @click="isCurrent='全部'">全部</el-link>-->
          <!--          <el-link v-for="item in typeData" :key="item.id" :underline="false" :class="['categroy-nav-item',{'categroy-nav-curr':isCurrent==item.name}]" @click="isCurrent=item.name">{{ item.name }}</el-link>-->
          <el-link :underline="false" class="categroy-nav-item" :class="['categroy-nav-item',{'categroy-nav-curr':isCurrent=='全部'}]" @click="handleCategoryChange(null)">全部</el-link>
          <el-link v-for="item in typeData" :key="item.id" :underline="false" :class="['categroy-nav-item',{'categroy-nav-curr':isCurrent==item.name}]" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis" @click="handleCategoryChange(item)">{{ item.name }}</el-link>
          <!-- <el-button  v-for="item in typeData" :key="item.id" style="margin:0 5px;background:rgb(48, 65, 86);color:white;" size="mini">{{ item.name }}</el-button> -->
        </div>
      </el-card>
      <div style="margin:0 -10px;">
        <Sitem v-for="(item,index) in softwareData" :key="index" :data="item" style="width:23.1%;margin:10px;float:left;" />
      </div>
    </div>
  </div>
</template>

<script>
import * as software from '@/api/software'
import * as special from '@/api/special'
import * as category from '@/api/category'
import * as appConfig from '/public/config'
import Swiper from './components/image-swiper.vue'
import Sitem from './components/software-item.vue'
import MessageItem from './components/message-item.vue'
import themeItem from './components/software-theme-item.vue'
export default {
  name: 'Index',
  components: {
    Swiper,
    Sitem,
    MessageItem,
    themeItem
  },
  data() {
    return {
      isCurrent: '全部',
      queryStr: null,
      imgList: [
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png')
      ],
      defaultS: 'this.src="' + require('@/assets/index/banner.png') + '"',
      activeName: 'first',
      currentPage: 1,
      imgSource: require('@/assets/index/software.png'),
      defaultImg: 'this.src="' + require('@/assets/index/software.png') + '"',
      selectedSoftware: [],
      downloadMutil: false,
      messageData: [
        {
          type: 1,
          title: '您上传的在线产品交付软件已经通过审核',
          date: '2022-08-09'
        },
        {
          type: 2,
          title: '您下载的在线产品交付软件有版本更新',
          date: '2022-08-09'
        },
        {
          type: 3,
          title: '您提报的需求已经处理',
          date: '2022-08-09'
        },
        {
          type: 4,
          title: '您提报的问题已经处理',
          date: '2022-08-09'
        }
      ],
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
      softwareData: [],
      totalPage: 0,
      pageSize: 10,
      pageNum: 1,
      hotData: [],
      newData: [
        {
          name:"Google浏览器"
        },
        {
          name:"Git版本控制"
        },
        {
          name:"office2010"
        },
        {
          name:"Vscode"
        },
      ],
      // recommendData:[1],
      userInfo: {},
      themeData: [],
      globalUrl: '',
      searchRecordList: []
    }
  },
  watch: {
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.globalUrl = appConfig.config.url
    this.getSpecialList()
    this.getSoftwareList()
    this.getLatestSoftware()
    this.getHotSoftware()
    this.getRecommendSoftware()
    this.getSoftwareTypeData()
    this.getSearchRecord()
    this.getSoftwareRollList()
    // this.initWebSocket()
  },
  methods: {
    // initWebSocket() {
    //   const url = 'ws://127.0.0.1:8803/middle/webSocketServer'
    //   this.webSocket = new WebSocket(url)
    //   this.webSocket.onmessage = this.webSocketOnMessage
    //   this.webSocket.onopen = this.webSocketOnOpen
    //   this.webSocket.onError = this.webSocketOnError
    //   this.webSocket.onClose = this.webSocketOnClose
    // },
    // webSocketOnOpen() {
    //   // 连接建立之后执行send方法发送数据
    //   // let actions = {"toUserId":"8"};
    //   // this.webSocketSend(JSON.stringify(actions));
    //   console.log('开启连接')
    // },
    // webSocketOnError() {
    //   debugger
    //   // 连接建立失败重连
    //   this.initWebSocket()
    // },
    // webSocketOnMessage(e) {
    //   debugger
    // },
    // webSocketSend(Data) {
    //   debugger
    //   // 数据发送
    //   this.webSocket.send(Data)
    // },
    // webSocketOnClose() {
    //   debugger
    //   // 关闭
    //   // 路由跳转时结束webSocket链接
    // },
    getSoftwareRollList() {
      software.getSoftwarePollList().then(response => {
        if (response.code === 200) {
          if (response.data.length > 0) {
            this.imgList = response.data
          }
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSoftwareList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSoftwareList()
    },
    selectedSoftwares(value) {
      this.selectedSoftware = value
    },
    querySearch(queryString, cb) {
      const restaurants = this.searchRecordList
      const searchRecords = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      const results = searchRecords.map(item => ({ value: item }))
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleCategoryChange(item) {
      if (item) {
        this.isCurrent = item.name
      } else {
        this.isCurrent = '全部'
      }
      this.getSoftwareList()
    },
    getSoftwareList() {
      if (this.queryStr) {
        this.addSearchRecord(this.queryStr)
      }
      let categoryId = null
      if (this.isCurrent !== '全部') {
        categoryId = this.typeData.find(item => item.name === this.isCurrent).id
      }
      software.getSoftwareListByCategory(this.userInfo.userId, categoryId, this.queryStr, 1, 1, this.pageNum, this.pageSize).then(response => {
        if (response.code === 200) {
          this.softwareData = response.data.list
          this.totalPage = response.data.total
          this.getSearchRecord()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addSearchRecord(keyword) {
      software.addSearchRecord(keyword, this.userInfo.userId).then(response => {
      })
    },
    getSearchRecord() {
      software.getSearchRecord(this.userInfo.userId, 30).then(response => {
        if (response.code === 200) {
          this.searchRecordList = response.data
        }
      })
    },
    // 获取最新成果列表
    getLatestSoftware() {
      software.getLatestSoftwareList(this.userInfo.userId).then(response => {
        this.newData = response.data.list
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取最热成果列表
    getHotSoftware() {
      software.getHotSoftwareList(this.userInfo.userId).then(response => {
        this.hotData = response.data.list
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
      category.getHotCategoryList(6, 7).then(response => {
        this.typeData = response.data.list
      }).catch(err => {
        console.log(err)
      })
    },
    getSpecialList() {
      special.getSpecialList(null, 1, 4).then(response => {
        if (response.code === 200) {
          this.themeData = response.data.list
        }
      })
    },
    goToThemeMore() {
      this.$router.push({ path: '/index/theme-more' })
    },
    gotoSoftwareMore() {
      this.$router.push({ path: '/index/software-more' })
    },
    downloadSoftware(item) {
      if (item.permission === 0) {
        this.$message.error('无下载权限')
      } else if (item.permission === 1) {
        this.$confirm('确认提交下载申请' + item.name + '吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.addSoftwareDownloadApply(item)
        }).catch(() => {
          // eslint-disable-next-line no-undef
          console.log(error)
        })
      } else if (item.permission === 2) {
        software.downloadSoftware(this.userInfo.userId, item.versionId).then(response => {
          if (response.code === 200) {
            window.location.href = response.data
          }
        })
      }
    },
    addSoftwareDownloadApply(item) {
      software.downloadSoftwareApply(item.versionId, this.userInfo.userId, this.userInfo.realName).then(response => {
        if (response.code === 200) {
          this.$message.success('软件资源下载申请已提交')
        }
      })
    }
  }
}
</script>

<style scoped>
    .el-carousel__item {
      width: 760px;
      background-image: url("~@/assets/index/index_picture_bg.png");
      background-repeat: no-repeat;
      background-position: fixed;
      border-radius: 10px;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }
    /* .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    } */
    #software-list >>> .el-table th.is-leaf, .el-table td {
        border-bottom: 0px solid #dfe6ec;
    }
    .app-container >>> .el-card__header{
        padding: 10px 20px;
    }
    .app-container >>> .el-card__body{
        padding: 10px 20px;
    }
    .el-card__body {
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
    .info-box{
        margin-top:5px;
    }
    .info-text{
        font-size:14px;color:rgba(149,149,163,1);margin-top:10px;
    }
    .downBtn{
        background:rgb(59,89,117);color:white;
        display: none;
    }
    .info-btn{
        height: 30px;
        margin-top:10px;
        line-height: 30px;
    }
    .info-btn:hover .info-text{
        display: none;
    }
    .info-btn:hover .downBtn{
        display: block;
    }
    .ribbon{
        background: red;
        overflow: hidden;
        white-space: nowrap;
        position:absolute;
        right: -50px;
        top:10px;
        transform: rotate(45deg);
        box-shadow: 0 0 10px #888;
    }
    .ribbon span{
         border: 1px solid #54CBFF;
         color: #fff;
         display: block;
         margin: 1px 0;
         padding: 5px 60px;
         text-align: center;
         text-shadow: 0 0 5px #444;
    }
    .categroy-nav-item{
        /* width: 80px; */
        padding: 5px 10px;
        margin: 7px 5px 5px 0px;
        float: left;
        color: #808080;
        /* background-color: #035678; */
        /* margin-left: 10px; */
    }
    .categroy-nav-item:hover{
        background: #3B5975;
        color: #fff;
        border-radius: 8px;
    }
    .categroy-nav-curr{
        background: #3B5975;
        color: #fff;
        border-radius: 8px;
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    /deep/ .el-input__inner {
      /* background-color: #0f1518; */
      border-radius: 2px;
      border: solid 1px #2187a8;
      color: #000;
    }
    /deep/ .el-select .el-input .el-select__caret {
      color: #ffffff;
    }
    /deep/ .el-select-dropdown {
      color: black;
    }
    /deep/ .el-select-dropdown .el-select-dropdown__list {
      background-color: #0a76a4;
    }
</style>

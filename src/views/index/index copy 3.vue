<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="19">
        <el-carousel :interval="4000"  height="280px" :autoplay="true" >
          <el-carousel-item v-for="(item,index) in imgList" :key="index" style="padding:20px 100px;">
            <el-row :gutter="20">
               <el-col :span="12" style="text-align:right;">
                <img
                  :src="item.logo?globalUrl+item.logo:defaultS"
                  :onerror="defaultS"
                  height="240"
                  style="zoom:0.9;margin-top:15px;"
                >
              </el-col>
              <el-col :span="12" style="color: #fff">
                <div  style="margin-top:30px;font-size:28px;font-weight:600;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
                  <router-link style="font-size:24px;font-weight:800"
                    :underline="false"
                    :to="{path:'/index/list/'+item.softwareId,query:{version:item.versionId
                    }}"
                  >{{ item.name }}
                  </router-link>
                  <el-tag v-if="item.version" type="info" size="mini" style="margin: 0 10px;">v{{ item.version }}
                  </el-tag>
                </div>
                <div v-if="item.identity" style="font-size:14px;margin-top:10px;">< {{ item.identity }} ></div>
                <div v-if="item.description" style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px">
                  {{ item.description.length > 150 ? item.description.substring(0,100) + '......' : item.description }}
                </div>
                <div v-else style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px">
                  {{ item.description }}
                </div>
              </el-col>
             
            </el-row>
          </el-carousel-item>
        </el-carousel>
        <!---最新软件 显示最新8个-->
        <!-- <el-row :gutter="10">
          <el-col v-for="(item,index) in newData" :key="index" :span="6">
            <el-card style="height:112px;position:relative;overflow:hidden;margin-bottom: 10px;">
              <div class="ribbon">
                <span>New</span>
              </div>
              <div class="info-box">
                <div style="float:left;padding:10px 0;width: 60px">
                  <img :src="item.name+'?imgSource'" :onerror="defaultImg" width="60px" height="60px">
                </div>
                <div style="float:right;margin-left:10px;width: calc( 100% - 70px )">
                  <div
                    style="font-size:16px;font-weight:500;white-space: nowrap;overflow: hidden;text-overflow: ellipsis"
                  >
                    <router-link :underline="false" :to="{path:'/index/list/'+item.id,query:{version:item.versionId}}">{{
                      item.name }}
                    </router-link>
                  </div>
                  <div style="font-size:14px;color:rgba(149,149,163,1);margin-top:10px;">{{ item.ctime }}</div>
                  <div class="info-btn">
                    <el-button type="primary" size="mini" class="downBtn" @click="downloadSoftware(item)">立即下载
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row> -->
        <!---最热软件-->
        <!-- <el-row :gutter="10" style="height:112px;margin-top: 10px">
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
        </el-row> -->
        <!--专题软件-->
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
      </el-col>
      <!--下载排行--->
      <el-col :span="5">
        <el-card style="height:280px;background:linear-gradient(180deg,rgb(174,191,207)0%,rgb(255,255,255)100%);overflow-y:auto">
          <div slot="header">
            <el-row :gutter="10">
                <el-col :span="12">
                  <i class="el-icon-s-data" />
                  <span>  下载排行</span>
                </el-col>
                <el-col :span="12" style="text-align:right">
                   <!-- <router-link to="/inform/index"> 更多 >></router-link> -->
                </el-col>
            </el-row>
          </div>
          <el-scollbar wrap-style="overflow-y:hiddle;" style="overflow-y:auto">
            <el-row
              v-for="(item,index) in hotData"
              :key="index"
              :gutter="10"
              style="line-height:40px;height:40px;"
            >
              <el-col :span="3">
                <!-- <span>{{index+1}}</span> -->
                <img v-if="index+1==1" src="@/assets/index/1.png" width="20" height="20">
                <img v-else-if="index+1==2" src="@/assets/index/2.png" width="20" height="20">
                <img v-else-if="index+1==3" src="@/assets/index/3.png" width="20" height="20">
                <span v-else>{{ index+1 }}</span>
              </el-col>
              <el-col :span="14">
                <span style="font-size:16px;font-weight:600;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display:flex;width:160px">{{ item.name }}</span>
              </el-col>
              <el-col :span="6">
                <div class="info-btn2" style="margin-top:0px;display:inline-block;">
                  <div class="info-text" style="font-size:12px;margin-top:0px">{{ item.downloadCon }} 次下载</div>
                  <!-- <el-button type="primary" size="mini" class="downBtn2" @click="downloadSoftware(item)">下载</el-button> -->
                  <div  class="downBtn2">
                   <el-button v-if="item.permission==1" type="primary" size="mini" class="downBtn2" @click="downloadSoftware(item)">下载</el-button>
                   <el-button v-else type="primary" size="mini" class="downBtn2" @click="addSoftwareDownloadApply(item)">申请</el-button>    
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-scollbar>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="19">
    <!---最新软件 显示最新6个-->
        <el-row :gutter="10">
          <el-col v-for="(item,index) in newData" :key="index" :span="6">
            <el-card style="height:120px;position:relative;overflow:hidden;margin-bottom: 10px;">
              <div class="ribbon">
                <span>最新</span>
              </div>
              <div class="info-box">
                <div style="float:left;padding:10px 0;width: 60px">
                  <img :src="globalUrl+item.logo" :onerror="defaultImg" width="60px" height="60px">
                </div>
                <div style="float:right;margin-left:10px;width: calc( 100% - 70px );margin-top:20px;">
                  <div
                    style="font-size:16px;font-weight:500;white-space: nowrap;overflow: hidden;text-overflow: ellipsis"
                  >
                    <router-link :underline="false" :to="{path:'/index/list/'+item.softwareId,query:{version:item.versionId}}">{{
                      item.name }}
                    </router-link>
                  </div>
                  <div style="font-size:12px;color:rgba(149,149,163,1);margin-top:10px;">{{ item.vtime | parseTime('{y}-{m}-{d}')}}</div>
                  <div class="info-btn">
                    <!-- <el-button type="primary" size="mini" class="downBtn" @click="downloadSoftware(item)">下载
                    </el-button> -->
                    <el-button v-if="item.permission==1" type="primary" size="mini" class="downBtn" @click="downloadSoftware(item)">下载
                        </el-button>
                    <el-button v-else type="primary" size="mini" class="downBtn" @click="addSoftwareDownloadApply(item)">申请
                    </el-button>  
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
          <!---最新软件 显示最新6个-->
        <el-row :gutter="10">
              <el-col v-for="(item,index) in hotData" :key="index" :span="6" v-if="index<4">
                <el-card style="height:120px;position:relative;overflow:hidden;margin-bottom: 10px;">
                  <div class="ribbon" style="background:orange">
                    <span>推荐</span>
                  </div>
                  <div class="info-box">
                    <div style="float:left;padding:10px 0;width: 60px">
                      <img :src="globalUrl+item.logo" :onerror="defaultImg" width="60px" height="60px">
                    </div>
                    <div style="float:right;margin-left:10px;width: calc( 100% - 70px );margin-top:20px;">
                      <div
                        style="font-size:16px;font-weight:500;white-space: nowrap;overflow: hidden;text-overflow: ellipsis"
                      >
                        <router-link :underline="false" :to="{path:'/index/list/'+item.softwareId,query:{version:item.versionId}}">
                        {{ item.name }}
                        </router-link>
                      </div>
                      <div style="font-size:12px;color:rgba(149,149,163,1);margin-top:10px;">{{ item.vtime | parseTime('{y}-{m}-{d}')}}</div>
                      <div class="info-btn">
                        <el-button v-if="item.permission==1" type="primary" size="mini" class="downBtn" @click="downloadSoftware(item)">下载
                        </el-button>
                        <el-button v-else type="primary" size="mini" class="downBtn" @click="addSoftwareDownloadApply(item)">申请
                        </el-button>                      
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
        </el-row>
         
        </el-col>
        <el-col :span="5">
        <!--系统公告--->
        <el-card style="height:250px;background:linear-gradient(180deg,rgb(174,191,207)0%,rgb(255,255,255)100%);">
          <div slot="header" style="height:20px;line-height:20px;">
            <el-row :gutter="20">
              <el-col :span="12">
                <i class="el-icon-message-solid" />
                <span> 系统公告</span>
              </el-col>
              <el-col :span="12" style="text-align:right">
                <router-link to="/notice/index" style="font-size:12px;"> 更多 >></router-link>
              </el-col>
            </el-row>
          </div>
          <message-item v-for="(item,index) in noticeData" :key="index" :item="item" @click.native="noticeShow(item)" />
          <div v-show="noticeData.length==0" style="text-align:center;margin:auto;">
            <span>暂无公告！</span>
          </div>
          <noticeDetail :notice-visible-flag.sync="noticeVisibleFlag" :title="title" :data="notice" @clearData="clearData" />
        </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="19">
        <!---常用分类-->
        <div id="software-list">
          <el-card style="margin-top:10px;">
            <div  style="line-height:30px;height:30px;">
              <el-row :gutter="20">
                <el-col :span="12">
                  <i class="el-icon-menu" />业务软件
                </el-col>
                <el-col :span="12" style="text-align:right;">
                  <!--              <el-input size="mini" style="width:200px;" suffix-icon="el-icon-search" placeholder="请输入关键字" v-model="queryStr" @change="getSoftwareList" />-->
                  <el-input
                    v-model="queryStr"
                    placeholder="请输入关键字"
                    style="width: 260px;color: #ffffff;border-radius:4px;"
                    @blur="getFrontSoftwareList('service')"
                  />
                  <el-button
                    type="text"
                    size="mini"
                    style="margin-left:10px;color:rgba(59,89,117,1)"
                    @click="gotoSoftwareMore('service')"
                  > 更多 >>
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-row :gutter="10">
            <el-col v-for="(item,index) in softwareData" :key="index" :span="8">
              <Sitem :data="item" />
            </el-col>
          </el-row>
        </div>
        <div id="software-list">
          <el-card style="margin-top:5px;">
            <div  style="line-height:30px;height:30px;">
              <el-row :gutter="20">
                <el-col :span="12">
                  <i class="el-icon-menu" />通用软件
                </el-col>
                <el-col :span="12" style="text-align:right;">
                  <el-input
                    v-model="keyword"
                    placeholder="请输入关键字"
                    style="width: 260px;color: #ffffff;border-radius:4px;"
                    @blur="getFrontSoftwareList('common')"
                  />
                  <el-button
                    type="text"
                    size="mini"
                    style="margin-left:10px;color:rgba(59,89,117,1)"
                    @click="gotoSoftwareMore('common')"
                  > 更多 >>
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-row :gutter="10">
            <el-col v-for="(item,index) in commonSoftwareData" :key="index" :span="8">
              <Sitem :data="item" />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="5">
        <!--消息通知--->
        <el-card style="height:400px;background:linear-gradient(180deg,rgb(174,191,207)0%,rgb(255,255,255)100%);margin-top:10px">
          <div slot="header" style="height:20px;line-height:20px;">
            <el-row :gutter="20">
              <el-col :span="12">
                <i class="el-icon-message-solid" />
                <span> 消息通知</span>
              </el-col>
              <el-col :span="12" style="text-align:right;">
                <router-link to="/inform/index" style="font-size:12px;"> 更多 >></router-link>
              </el-col>
            </el-row>
          </div>
          <message-item v-for="(item,index) in messageData" :key="index" :item="item" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as software from '@/api/software'
import * as special from '@/api/special'
import * as category from '@/api/category'
import * as notice from '@/api/notice'
import * as message from '@/api/sys-messages'
import * as appConfig from '/public/config'
import Swiper from './components/image-swiper.vue'
import Sitem from './components/software-item.vue'
import MessageItem from './components/message-item.vue'
import themeItem from './components/software-theme-item.vue'
import { parseTime} from "@/utils/common";
export default {
  name: 'Index',
  components: {
    Swiper,
    Sitem,
    MessageItem,
    themeItem,
    noticeDetail: () => import('@/views/index/notice/show') // 查看通知
  },
  data() {
    return {
      isCurrent: '全部',
      queryStr: '',
      keyword:'',
      imgList: [
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png'),
        require('@/assets/imgs/banner.png')
      ],
      defaultS: 'this.src="' + require('@/assets/index/pic.png') + '"',
      activeName: 'first',
      currentPage: 1,
      imgSource: require('@/assets/index/softwareDefault.png'),
      defaultImg: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"',
      selectedSoftware: [],
      downloadMutil: false,

      // 通知公告
      notice: {},
      message: {},
      title: '查看系统公告',
      noticeVisibleFlag: false,
      noticeData: [],
      messageData: [],
      typeData: [],
      softwareData: [],
      commonSoftwareData:[],
      totalPage: 0,
      pageSize: 10,
      pageNum: 1,
      hotData: [],
      // recommendData:[1],
      userInfo: {},
      themeData: [],
      globalUrl: '',
      searchRecordList: []

    }
  },
  watch: {},
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.globalUrl = appConfig.config.urlFilePrefix
    // this.getSpecialList()
    this.getSoftwareList()
    this.getLatestSoftware()
    this.getHotSoftware()
    this.getRecommendSoftware()
    this.getSoftwareTypeData()
    this.getSearchRecord()
    this.getSoftwareRollList()
    this.getNoticeList()
    this.getMessageList()
    // this.initWebSocket()

    this.getFrontSoftwareList('service');
    this.getFrontSoftwareList('common');
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
   async getFrontSoftwareList(type){
     let keyword=null;
     if(type=="common"){
         keyword=this.keyword;
        }else{
        keyword=this.queryStr;
      }
     await  software.getFrontSoftwareList(keyword,type,6).then(response=>{
        if(type=="common"){
          this.commonSoftwareData=response.data;
        }else{
          this.softwareData=response.data;
        }
      })
    },
    getMessageList() {
      const data = {
      }
      // message.listSysMessagesByUser(data).then(response => {
      //   if (response.code === 200) {
      //     this.messageData = response.data.list
      //   }
      // })
      message.listSysMessagesByUser({ pageNum: 1, pageSize: 10 }).then(response => {
        if (response.code === 200) {
          this.messageData = response.data.list
        }
      })
    },
    getNoticeList() {
      notice.getNoticeList(this.userInfo.userId, null, 1, 6).then(response => {
        if (response.code === 200) {
          this.noticeData = response.data.list
        }
      })
    },
    noticeShow(notice) {
      this.title = '查看系统公告'
      this.notice = notice
      this.noticeVisibleFlag = true
    },
    messageShow(message) {
      this.title = '查看消息通知'
      this.message = message
      this.noticeVisibleFlag = true
    },
    clearData() {
      this.noticeVisibleFlag = false
      this.notice = {}
      this.message = {}
    },
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
      // let categoryId = null
      // if (this.isCurrent !== '全部') {
      //   categoryId = this.typeData.find(item => item.name === this.isCurrent).id
      // }
      // software.getSoftwareListByCategory(this.userInfo.userId, categoryId, this.queryStr, 1, 1, this.pageNum, this.pageSize).then(response => {
      //   if (response.code === 200) {
      //     this.softwareData = response.data.list
      //     this.totalPage = response.data.total
      //     this.getSearchRecord()
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
      //查询前8条记录
      this.getSearchRecord()
    },
    addSearchRecord(keyword) {
      software.addSearchRecord(keyword, this.userInfo.userId).then(response => {
      })
    },
    getSearchRecord() {
      software.getSearchRecord(this.userInfo.userId, 6).then(response => {
        if (response.code === 200) {
          this.searchRecordList = response.data
        }
      })
    },
    // 获取最新成果列表
    getLatestSoftware() {
      software.getLatestSoftwareList(this.userInfo.userId).then(response => {
        this.newData = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取最热成果列表
    getHotSoftware() {
      software.getHotSoftwareList(this.userInfo.userId).then(response => {
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
      category.getHotCategoryList(6, 20).then(response => {
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
    gotoSoftwareMore(type) {
      if(type=='common'){
        this.$router.push({ 
          path: '/index/software-more',
          query:{
            title:"通用软件",
            service:'91',
          }
          })
      }else{
        this.$router.push({ 
          path: '/index/software-more',
          query:{
            title:"业务软件",
            service:'20',
          }
          })
      }
    },
    downloadSoftware(item) {
      debugger
      if (item.permission === 0) {
        // this.$message.error('无下载权限')
        // this.$confirm('确认提交下载申请' + item.name + '吗?', '提示', {
        //   type: 'warning'
        // }).then(() => {
          this.addSoftwareDownloadApply(item)
        // }).catch(() => {
        //   // eslint-disable-next-line no-undef
        //   console.log(error)
        // })
      } 
      // else if (item.permission === 1) {
      //   this.$confirm('确认提交下载申请' + item.name + '吗?', '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     this.addSoftwareDownloadApply(item)
      //   }).catch(() => {
      //     // eslint-disable-next-line no-undef
      //     console.log(error)
      //   })
      // } 
      else if (item.permission === 1) {
        // software.downloadSoftware(this.userInfo.userId, item.versionId).then(response => {
        //   if (response.code === 200) {
        //     // window.location.href = response.data
        //   }
        // })
        software.downloadSoftwareFile(this.userInfo.userId, item.versionId);
      }
    },
    addSoftwareDownloadApply(item) {
       this.$confirm('确认提交下载申请' + item.name + '吗?', '提示', {
          type: 'warning'
        }).then(() => {
          software.downloadSoftwareApply(item.versionId, this.userInfo.userId, this.userInfo.realName).then(response => {
            if (response.code === 200) {
              this.$message.success('软件资源下载申请已提交')
            }
          })
         }).catch(() => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  .el-carousel__item {
    /* width: 760px; */
    background-image: url("~@/assets/index/index_picture_bg.png");
    /* background-repeat: no-repeat; */
    background-repeat:round;
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

  .app-container >>> .el-card__header {
    padding: 10px 20px;
  }

  .app-container >>> .el-card__body {
    padding: 10px 20px;
  }

  .el-card__body {
    padding: 10px 20px;
  }

  .app-container
  .system-message {
    max-height: 200px;
    overflow-y: auto;
  }

  .recommend-software {
    height: 150px;
    margin-top: 10px;
  }

  .index-sfotware {
    margin-top: 10px;
  }

  .item {
    display: block;
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }

  .info {
    height: 14px;
    margin: 4px 0;
    font-size: 16px;
    line-height: 18px;
    font-weight: 500;
    color: #4182e1;
  }

  .info-box {
    margin-top: 5px;
  }

  .info-text {
    font-size: 14px;
    color: rgba(149, 149, 163, 1);
    margin-top: 10px;
  }

  .downBtn {
    background: rgb(59, 89, 117);
    color: white;
    /* display: none; */
  }

  .info-btn {
    height: 30px;
    margin-top: 0px;
    line-height: 30px;
    text-align: right;
  }

  /* .info-btn:hover .info-text{
      display: none;
  }
  .info-btn:hover .downBtn{
      display: block;
  } */
  .downBtn2 {
    background: rgb(59, 89, 117);
    color: white;
    display: none;
  }

  .info-btn2 {
    height: 30px;
    margin-top: 10px;
    line-height: 30px;
    text-align: right;
  }

  .info-btn2:hover .info-text {
    display: none;
  }

  .info-btn2:hover .downBtn2 {
    display: block;
  }

  .ribbon {
    background: red;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
    right: -60px;
    top: 10px;
    transform: rotate(45deg);
    box-shadow: 0 0 10px #888;
  }

  .ribbon span {
    /* border: 1px solid #54CBFF; */
    color: #fff;
    display: block;
    margin: 1px 0;
    padding: 5px 65px;
    text-align: center;
    text-shadow: 0 0 5px #444;
    font-size: 10px;
  }

  .categroy-nav-item {
    /* width: 80px; */
    padding: 5px 10px;
    margin: 7px 5px 5px 0px;
    float: left;
    color: #808080;
    /* background-color: #035678; */
    /* margin-left: 10px; */
  }

  .categroy-nav-item:hover {
    background: #3B5975;
    color: #fff;
    border-radius: 8px;
  }

  .categroy-nav-curr {
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

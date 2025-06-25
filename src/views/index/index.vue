<template>
  <div class="app-container">
    <el-row :gutter="20" class="main-content-row">
      <el-col :span="18" class="left-content">
        <el-card>
          <div slot="header" style="padding:5px 5px 5px 0;">
            <img style="position: relative;top:2px;" src="@/assets/index/hotDission.png" width="16" height="16">
            <span style="margin-left:5px;">最新推荐</span>
          </div>
        <!---最新软件 显示最新6个-->
        <el-row :gutter="10">
          <el-col v-for="(item,index) in newData" :key="index" :span="6">
            <el-card style="height:120px;position:relative;overflow:hidden;margin-bottom: 10px;">
              <div class="ribbon">
                <span>NEW</span>
              </div>
              <div class="info-box">
                <div style="float:left;padding:10px 0;width: 60px">
                  <img :src="globalUrl+item.logo" :onerror="defaultImg" width="60px" height="60px">
                </div>
                <div style="float:right;margin-left:10px;width: calc( 100% - 70px );margin-top:20px;">
                  <div
                    style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis"
                  >
                    <router-link style="font-size:15px;font-weight:bold;" :underline="false" :to="{path:'/index/list/'+item.softwareId,query:{version:item.versionId}}">{{
                      item.name }}
                    </router-link>
                    <span 
                      class="software-type-tag software-type-common"
                      v-if="item.softwareType == 1"
                    >通用软件</span>
                    <span 
                      class="software-type-tag software-type-fragment"
                      v-else-if="item.softwareType == 2"
                    >软件段</span>
                    <span 
                      class="software-type-tag software-type-business"
                      v-else-if="item.softwareType == 3"
                    >业务软件</span>
                    <span 
                      class="software-type-tag software-type-model"
                      v-else-if="item.softwareType == 4"
                    >模型</span>
                  </div>
                  <div style="font-size:12px;color:#000000;margin-top:10px;">{{ item.vtime | parseTime('{y}-{m}-{d}')}}</div>
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
                    <span>HOT</span>
                  </div>
                  <div class="info-box">
                    <div style="float:left;padding:10px 0;width: 60px">
                      <img :src="globalUrl+item.logo" :onerror="defaultImg" width="60px" height="60px">
                    </div>
                    <div style="float:right;margin-left:10px;width: calc( 100% - 70px );margin-top:20px;">
                      <div
                        style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis"
                      >
                        <router-link style="font-size:15px;font-weight:bold;" :underline="false" :to="{path:'/index/list/'+item.softwareId,query:{version:item.versionId}}">
                        {{ item.name }}
                        </router-link>
                        <span 
                          class="software-type-tag software-type-common"
                          v-if="item.softwareType == 1"
                        >通用软件</span>
                        <span 
                          class="software-type-tag software-type-fragment"
                          v-else-if="item.softwareType == 2"
                        >软件段</span>
                        <span 
                          class="software-type-tag software-type-business"
                          v-else-if="item.softwareType == 3"
                        >业务软件</span>
                        <span 
                          class="software-type-tag software-type-model"
                          v-else-if="item.softwareType == 4"
                        >模型</span>
                      </div>
                      <div style="font-size:12px;color:#000000;margin-top:10px;">{{ item.vtime | parseTime('{y}-{m}-{d}')}}</div>
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
        </el-card>
        <!---软件列表-->
          <el-card style="margin-top:10px;">
            <div  style="line-height:30px;height:30px;" slot="header">
              <el-row :gutter="20">
                <el-col :span="12">
                  <i class="el-icon-menu" style="color:#05994e;font-size:16px;margin-right:5px;" />软件段
                </el-col>
                <el-col :span="12" style="text-align:right;">
                  <!--              <el-input size="mini" style="width:200px;" suffix-icon="el-icon-search" placeholder="请输入关键字" v-model="queryStr" @change="getSoftwareList" />-->
                  <el-input
                    v-model="queryStr"
                    placeholder="请输入软件段名搜索"
                    style="width: 270px;color: #000000;border-radius:20px;box-shadow: 0 2px 6px rgba(0,0,0,0.15);"
                    @blur="getFrontSoftwareList('service')"
                    @keyup.enter.native="getFrontSoftwareList('service')"
                    clearable
                    @clear="clearSearch('service')"
                  >
                    <el-button slot="append" icon="el-icon-search" type="mini" @click="getFrontSoftwareList('service')">搜索</el-button>
                  </el-input>
                  <el-button
                    type="text"
                    size="primary"
                    style="margin-left:10px;color:#000000"
                    @click="gotoSoftwareMore('service')"
                  > 更多 >>
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-row :gutter="10">
            <el-col v-for="(item,index) in softwareData" :key="index" :span="6">
              <Sitem :data="item" />
            </el-col>
          </el-row>
          </el-card>
          <el-card style="margin-top:10px;">
            <div  style="line-height:30px;height:30px;" slot="header">
              <el-row :gutter="20">
                <el-col :span="12">
                  <i class="el-icon-menu" style="color:#05994e;font-size:16px;margin-right:5px;" />软件模型
                </el-col>
                <el-col :span="12" style="text-align:right;">
                  <!--              <el-input size="mini" style="width:200px;" suffix-icon="el-icon-search" placeholder="请输入关键字" v-model="queryStr" @change="getSoftwareList" />-->
                  <el-input
                    v-model="queryStrModule"
                    placeholder="请输入模型名称搜索"
                    style="width: 270px;color: #000000;border-radius:20px;box-shadow: 0 2px 6px rgba(0,0,0,0.15);"
                    @blur="getFrontSoftwareList('module')"
                    @keyup.enter.native="getFrontSoftwareList('module')"
                    clearable
                    @clear="clearSearch('module')"
                  >
                    <el-button slot="append" icon="el-icon-search" type="mini" @click="getFrontSoftwareList('module')">搜索</el-button>
                  </el-input>
                  <el-button
                    type="text"
                    size="primary"
                    style="margin-left:10px;color:#000000"
                    @click="gotoSoftwareMore('module')"
                  > 更多 >>
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-row :gutter="10">
            <el-col v-for="(item,index) in moduleSoftwareData" :key="index" :span="6">
              <Sitem :data="item" />
            </el-col>
          </el-row>
          </el-card>
          <el-card style="margin-top:10px;">
            <div  style="line-height:30px;height:30px;" slot="header">
              <el-row :gutter="20">
                <el-col :span="12">
                  <i class="el-icon-menu" style="color:#05994e;font-size:16px;margin-right:5px;" />通用软件
                </el-col>
                <el-col :span="12" style="text-align:right;">
                  <el-input
                    v-model="keyword"
                    placeholder="请输入软件名称搜索"
                    style="width: 270px;color: #000000;border-radius:20px;box-shadow: 0 2px 6px rgba(0,0,0,0.15);"
                    @blur="getFrontSoftwareList('common')"
                    @keyup.enter.native="getFrontSoftwareList('common')"
                    clearable
                    @clear="clearSearch('common')"
                  >
                    <el-button slot="append" icon="el-icon-search" type="mini" @click="getFrontSoftwareList('common')">搜索</el-button>
                  </el-input>
                  <el-button
                    type="text"
                    size="primary"
                    style="margin-left:10px;color:#000000"
                    @click="gotoSoftwareMore('common')"
                  > 更多 >>
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-row :gutter="10">
            <el-col v-for="(item,index) in commonSoftwareData" :key="index" :span="6">
              <Sitem :data="item" />
            </el-col>
          </el-row>
          </el-card>
      </el-col>
       <el-col :span="6" class="right-content">
        <!-- <el-carousel :interval="4000" style="margin-bottom:10px;"  height="180px" :autoplay="true" v-if="imgList.length>0">
          <el-carousel-item v-for="(item,index) in imgList" :key="index" style="padding:10px 20px;" indicator-position="none">
            <el-row :gutter="20">
              <el-col :span="14" style="color: #fff">
                <div  style="margin-top:30px;font-size:24px;font-weight:600;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
                  <router-link style="font-size:24px;font-weight:700"
                    :underline="false"
                    :to="{path:'/index/list/'+item.softwareId,query:{version:item.versionId
                    }}"
                  >{{ item.name }}
                  </router-link>
                  <el-tag v-if="item.version" type="info" size="mini" style="margin: 0 10px;">v{{ item.version }}</el-tag>
                </div>
                <div v-if="item.identity" style="font-size:14px;margin-top:10px;">< {{ item.identity }} ></div>
                <div v-if="item.description" :title="item.description" style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px;white-space: nowrap;    text-overflow: ellipsis;">
                  {{ item.description }}
                </div>
                <div v-else style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px">
                  {{ item.description }}
                </div>
                <div style="margin-top:-70px;" >
                  <el-button  size="small" style="background:rgba(255,255,255,0);border-color:solid 1px white;color:white;" @click="downloadSoftware(item)">立即下载</el-button>
                </div>
              </el-col>
              <el-col :span="10" style="text-align:right;">
                <img
                  :src="item.logo?globalUrl+item.logo:defaultS"
                  :onerror="defaultS"
                  height="120"
                  style="zoom:0.9;margin-top:15px;"
                >
              </el-col>
            </el-row>
          </el-carousel-item>
        </el-carousel> -->
        <!--下载排行-->
        <el-card style="height:280px;margin-bottom:10px;overflow-y:auto">
          <div slot="header">
            <el-row :gutter="10">
                <el-col :span="12">
                  <div class="header-title">
                    <img class="title-icon" src="@/assets/index/hotData.png">
                    <span>下载排行榜</span>
                  </div>
                </el-col>
                <el-col :span="12" style="text-align:right">
                   <!-- <router-link to="/inform/index"> 更多 >></router-link> -->
                </el-col>
            </el-row>
          </div>
          <div wrap-style="overflow-y:hiddle;" style="overflow-y:auto">
            <el-row
              v-for="(item,index) in hotData"
              :key="index"
              style="line-height:40px;height:40px;"
            >
              <el-col :span="3" style="text-align:center;">
                <!-- <span>{{index+1}}</span> -->
                <div v-if="index+1==1" class="hot-icon">
                  <span>1</span>
                  <img  src="@/assets/index/hot1.png">
                </div>
                <div v-else-if="index+1==2" class="hot-icon">
                  <span>2</span>
                  <img  src="@/assets/index/hot2.png">
                </div>
                <div v-else-if="index+1==3" class="hot-icon">
                  <span>3</span>
                  <img  src="@/assets/index/hot3.png">
                </div>
                <!-- <img v-if="index+1==1" src="@/assets/index/hot1.png" width="25" height="25">
                <img v-else-if="index+1==2" src="@/assets/index/hot2.png" width="25" height="25">
                <img v-else-if="index+1==3" src="@/assets/index/hot3.png" width="25" height="25"> -->
                <span v-else>{{ index+1 }}</span>
              </el-col>
              <el-col :span="15">
                <div style="font-size:14px;font-weight:600;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display:flex;width:160px;align-items:center;">
                  <span>{{ item.name }}</span>
                  <span 
                    class="rank-software-type-tag software-type-common"
                    v-if="item.softwareType == 1"
                  >通用软件</span>
                  <span 
                    class="rank-software-type-tag software-type-fragment"
                    v-else-if="item.softwareType == 2"
                  >软件段</span>
                  <span 
                    class="rank-software-type-tag software-type-business"
                    v-else-if="item.softwareType == 3"
                  >业务软件</span>
                  <span 
                    class="rank-software-type-tag software-type-model"
                    v-else-if="item.softwareType == 4"
                  >模型</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="info-btn2" style="margin-top:0px;display:inline-block;">
                  <div class="info-text" style="font-size:12px;margin-top:0px;color:#000000">{{ item.downloadCon }} 次下载</div>
                  <!-- <el-button type="primary" size="mini" class="downBtn2" @click="downloadSoftware(item)">下载</el-button> -->
                  <div  class="downBtn2">
                   <el-button v-if="item.permission==1" type="primary" size="mini" class="downBtn2" @click="downloadSoftware(item)">下载</el-button>
                   <el-button v-else type="primary" size="mini" class="downBtn2" @click="addSoftwareDownloadApply(item)">申请</el-button>    
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!--系统公告--->
        <el-card style="margin-bottom:10px;height:auto;min-height:300px;display:flex;flex-direction:column;overflow:hidden;">
          <div slot="header" style="height:20px;line-height:20px;">
            <el-row :gutter="20">
              <el-col :span="12">
                <!-- <i class="el-icon-message-solid" /> -->
                <div class="header-title">
                  <img class="title-icon" src="@/assets/index/systemNotice.png">
                  <span>系统公告</span>
                </div>
              </el-col>
              <el-col :span="12" style="text-align:right">
                <router-link to="/notice/index" style="font-size:14px;"> 更多 >></router-link>
              </el-col>
            </el-row>
          </div>
          <div style="overflow-y:auto;flex:1;padding-right:5px;">
            <notice-item style="margin-top: 5px;margin-bottom: 5px;"  v-for="(item,index) in noticeData" :key="index" :item="item" @click.native="noticeShow(item)" />
            <div v-show="noticeData.length==0" style="text-align:center;margin:auto;">
              <span>暂无公告！</span>
            </div>
            <noticeDetail :notice-visible-flag.sync="noticeVisibleFlag" :title="title" :data="notice" @clearData="clearData" />
          </div>
        </el-card>
        <!--消息通知--->
        <el-card style="margin-bottom:10px;height:auto;min-height:300px;display:flex;flex-direction:column;overflow:hidden;">
          <div slot="header" style="height:20px;line-height:20px;">
            <el-row :gutter="20">
              <el-col :span="12">
                <!-- <i class="el-icon-message-solid" /> -->
                <div class="header-title">
                  <img class="title-icon" src="@/assets/index/messageInform.png">
                  <span>消息通知</span>
                </div>
              </el-col>
              <el-col :span="12" style="text-align:right;">
                <!-- <router-link to="/inform/index" style="font-size:12px;"> 更多 >></router-link> -->
                <router-link to="/notice/index?type=message" style="font-size:14px;"> 更多 >></router-link>
              </el-col>
            </el-row>
          </div>
          <div style="overflow-y:auto;flex:1;padding-right:5px;" class="message-container">
            <message-item v-for="(item,index) in messageData" :key="index" :item="item" @click.native="messageShow(item)" />
            <div v-show="messageData.length==0" style="text-align:center;margin:auto;padding: 10px 0;">
              <span>暂无消息！</span>
            </div>
          </div>
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
import Swiper from './components/image-swiper.vue'
import Sitem from './components/software-item.vue'
import MessageItem from './components/message-item.vue'
import NoticeItem from './components/notice-item.vue'
import themeItem from './components/software-theme-item.vue'
import { parseTime} from "@/utils/common";
export default {
  name: 'Index',
  components: {
    Swiper,
    Sitem,
    MessageItem,
    NoticeItem,
    themeItem,
    noticeDetail: () => import('@/views/index/notice/show') // 查看通知
  },
  data() {
    return {
      isCurrent: '全部',
      queryStr: '',
      queryStrModule:'',
      keyword:'',
      imgList: [
        // require('@/assets/imgs/banner.png'),
        // require('@/assets/imgs/banner.png'),
        // require('@/assets/imgs/banner.png'),
        // require('@/assets/imgs/banner.png'),
        // require('@/assets/imgs/banner.png')
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
      moduleSoftwareData:[],
      totalPage: 0,
      pageSize: 10,
      pageNum: 1,
      hotData: [],
      // recommendData:[1],
      userInfo: {},
      themeData: [],
      globalUrl: '',
      searchRecordList: [],
      newData: []

    }
  },
  watch: {},
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.globalUrl = config.urlFilePrefix
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
    this.getFrontSoftwareList('module');
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
      // 清除搜索条件
   clearSearch(type) {
     if(type=="common"){
       this.keyword = '';
     } else if(type=="module") {
       this.queryStrModule = '';
     } else {
       this.queryStr = '';
     }
     this.getFrontSoftwareList(type);
   },
   
   async getFrontSoftwareList(type){
     let keyword=null;
     if(type=="common"){
         keyword=this.keyword;
        }else if(type=="module")  {
           keyword=this.queryStrModule;
          }else{
        keyword=this.queryStr;
      }
     await  software.getFrontSoftwareList(keyword,type,8).then(response=>{
        if(type=="common"){
          this.commonSoftwareData=response.data;
         }else if(type=="module"){
           this.moduleSoftwareData=response.data;
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
      notice.getNoticeList(this.userInfo.userId, null, 1, 10).then(response => {
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
            childService:'全部'
          }
          })
      }else if(type=='module'){
        this.$router.push({ 
          path: '/index/software-more',
          query:{
            title:"软件模型",
            service:'20',
            childService:'全部'
          }
          })
      }else{
        this.$router.push({ 
          path: '/index/software-more',
          query:{
            title:"业务软件",
            service:'20',
            childService:'全部'
          }
          })
      }
    },
    downloadSoftware(item) {
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

        // 下载软件分卷
        if(item.softwareVersionVolumes) {
          item.softwareVersionVolumes.forEach(element => {
              software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
          });
          
        }
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
  ::v-deep .el-carousel__indicator--horizontal {
      display: inline-block;
      padding: 10px 2px;
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
    padding: 10px 10px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .el-card__body {
    padding: 10px 20px;
    height: 100%;
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
    color: #000000;
    margin-top: 10px;
  }

  .downBtn {
    /* background: rgb(59, 89, 117); */
    background: #05994e;
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
    /* background: rgb(59, 89, 117); */
    background: #05994e;
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
    /* box-shadow: 0 0 10px #888; */
  }

  .ribbon span {
    /* border: 1px solid #54CBFF; */
    color: #fff;
    display: block;
    margin: 1px 0;
    padding: 0 65px;
    text-align: center;
    /* text-shadow: 0 0 5px #444; */
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

  ::v-deep .el-input--medium .el-input__inner {
    height: 28px;
    line-height: 28px;
  }

  ::v-deep .el-input__inner {
    /* background-color: #0f1518; */
    border-radius: 20px;
    border: solid 1px #2bb56e;
    color: #000000;
    padding-left: 35px;
    height: 36px;
    font-size: 14px;
    transition: all 0.3s;
    background-color: #f9f9f9;
  }
  
  ::v-deep .el-input__inner:focus {
    border: solid 1px #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  ::v-deep .el-input__prefix {
    left: 10px;
    color: #2bb56e;
  }
  
  ::v-deep .el-input-group__append {
    background-color: #2bb56e;
    border-color: #2bb56e;
    color: white;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  
  ::v-deep .el-input-group__append:hover {
    background-color: #34c873;
    border-color: #34c873;
  }

  ::v-deep .el-select .el-input .el-select__caret {
    color: #ffffff;
  }

  ::v-deep .el-select-dropdown {
    color: black;
  }

  ::v-deep .el-select-dropdown .el-select-dropdown__list {
    background-color: #0a76a4;
  }
  .header-title {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  
  .header-title span {
    margin-left: 5px;
    white-space: nowrap;
  }
  
  .title-icon{
    height: 18px;
    width: 18px;
    flex-shrink: 0;
  }
  .hot-icon{
    display: inline-block;
    height: 21px;
    width: 18px;
    position: relative;
    top: 5px;
  }
  .hot-icon span{
    position: absolute;
    color: #fff;
    font-size: 12px;
    left: 5px;
    top: -2px;
    
  }
  .hot-icon img{
    height: 100%;
    width:100%
  }
  
  .main-content-row {
    display: flex;
    flex-wrap: wrap;
  }

  .left-content, .right-content {
    display: flex;
    flex-direction: column;
  }

  .right-content {
    display: block;
  }

  .right-content .el-card {
    margin-bottom: 10px;
  }
  
  .right-content .el-card:last-child {
    margin-bottom: 0;
  }
  
  .right-content .el-card .el-card__body {
    overflow-y: auto;
  }
  
  .right-content .el-card .el-card__header {
    padding: 10px 20px;
  }
  
  .message-container {
    padding-top: 5px;
    width: 100%;
  }
  
  .message-container .el-tooltip {
    width: 100%;
  }
  
  @media screen and (max-width: 768px) {
    .message-container {
      padding-right: 0 !important;
    }
  }

  /* 软件分类标签样式 */
  .software-type-tag {
    position: relative;
    top: -1px;
    right: auto;
    margin-left: 5px;
    font-size: 10px;
    padding: 0 5px;
    border-radius: 4px;
    color: #fff;
    white-space: nowrap;
    display: inline-block;
    line-height: 1.2;
    height: 14px;
    line-height: 14px;
    border: none;
    box-shadow: none;
    z-index: 1;
  }

  /* 各类软件标签颜色 */
  .software-type-common {
    background-color: #1e7d34;
    border-color: #1e7d34;
  }

  .software-type-fragment {
    background-color: #e6a23c;
    border-color: #e6a23c;
  }

  .software-type-business {
    background-color: #9c27b0;
    border-color: #9c27b0;
  }

  .software-type-model {
    background-color: #409eff;
    border-color: #409eff;
  }

  /* 排行榜中的标签样式 */
  .rank-software-type-tag {
    position: relative;
    top: -1px;
    right: auto;
    margin-left: 5px;
    font-size: 8px;
    padding: 0 4px;
    border-radius: 3px;
    color: #fff;
    white-space: nowrap;
    display: inline-block;
    height: 12px;
    line-height: 12px;
    border: none;
    box-shadow: none;
    z-index: 1;
  }
</style>

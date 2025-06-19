<template>
  <div class="navbar">
    <logo :collapse="false" style="float:left;width:210px;" />
    <div class="right-menu" :class="{adming_bg:$checkPermission(['user','SYUser','AFUser'])!=true}">
      <main-bar v-if="device!=='mobile'" v-show="showTopInfo"  />
      <div style="float:right;height: 60px;line-height: 60px;">
        <template v-if="device!=='mobile'">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </template>

        <el-button v-show="!showTopInfo" type="text" icon="el-icon-menu" title="大屏" @click="$router.push('/bigscreen')"  class="right-menu-item"  style="margin-left:0px;"></el-button>
        <el-button v-show="showTopInfo" type="text" icon="el-icon-edit-outline" title="我的需求" @click="$router.push('/index/demand/index')" size="18px" class="right-menu-item " style="margin-left:0px;">我的需求</el-button>
        <!-- <el-button v-show="showTopInfo" type="text" icon="el-icon-service" title="技术支持" @click="$router.push('/index/onlinets/index')"  class="right-menu-item"  style="margin-left:0px;"></el-button> -->
        <!-- <el-button type="text" icon="el-icon-message-solid" title="系统公告" @click="$router.push('/notice/index')"  class="right-menu-item"  style="margin-left:0px;"></el-button> -->

        <el-button v-if="appConfig.questionGuide===true" type="text" icon="el-icon-document" title="常见问题指南" @click="showGuide"  class="right-menu-item"   style="margin-left:0px"></el-button>

        <el-button type="text" icon="el-icon-message-solid" title="系统公告" @click="$router.push('/notice/index')"  class="right-menu-item"  style="margin-left:0px">
          <i v-if="unreadCount>0" class="active_dot"></i>
        </el-button>
        <!-- <el-button v-show="showTopInfo" type="text" icon="el-icon-chat-square" title="意见建议" @click="$router.push('/suggestion/index')" size="18px" class="right-menu-item " style="margin-left:0px;"></el-button> -->

        <el-button type="text" class="right-menu-item" style="margin-left:0px;">|</el-button>
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" v-if="device!=='mobile'" >
          <div class="avatar-wrapper">
            <img :src="avatar+'?imgSource'" class="user-avatar" :onerror="defaultA">
            <span class="user-name">{{userInfo.realName}}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" style="margin-top:-10px">
            <router-link to="/profile/index">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>

            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;font-size:14px">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- <el-button type="text" icon="el-icon-switch-button" style="margin-left:10px;" title="登出" @click="logout" class="right-menu-item"></el-button> -->
    </div>

  <!-- 指南预览 -->
    <el-dialog
      v-el-drag-dialog :visible.sync="showdialog"
      title="常见问题指南"
      @close="handleClose"
      :append-to-body="true"
      width="800px"
      >
      <div  ref="preview" id="preview"  class="pdfPriview" v-loading="loading" element-loading-text="加载中，请耐心等待" element-loading-spinner="el-icon-loading"  style="height:500px;overflow-y:auto"></div>
  </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { mapGetters } from 'vuex'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import * as sysMessages from "@/api/sys-messages"
import Logo from "./Sidebar/Logo"
import MainBar from './MainBar'
import { Message,Loading } from 'element-ui'
let docx = require("docx-preview")
window.JSZip = require("jszip")
export default {
  directives: { elDragDialog },
  components: {
    ErrorLog,
    Screenfull,
    SizeSelect,
    Logo,
    MainBar,
  },
  data() {
    return {
      unreadCount: 0,
      date: null,
      imgSource: require('@/assets/index/avatar.png'),
      defaultA: 'this.src="' + require('@/assets/index/avatar.png') + '"',
      userInfo: {},
      timer:null,
      timerMessage:null,
      informdata: [],
      showForUser: false,
      showTopInfo: false,

      loading:false,
      showdialog:false,
      appConfig: appConfig.config
    }
  },
  mounted() {
    var _this = this
    this.timer = setInterval(() => {
      _this.date = new Date()
    }, 1000)

     _this.messageReadCount()
     this.timerMessage = setInterval(() => {
      _this.messageReadCount()
    }, 10000)

    var userInfo = localStorage.getItem('userInfo');
    this.userInfo = JSON.parse(userInfo)
    if(this.userInfo.roles[0]=='user'){
      this.showForUser = true
    }
    // this.listSysMessagesByUser();

     if(localStorage.getItem("userType") === "user") {
      this.showTopInfo = true
    }

  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null

    clearInterval(this.timerMessage)
    this.timerMessage = null
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    jumpToInfo() {
      this.$router.push("/inform/index")
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      localStorage.clear()
      sessionStorage.clear()
      // 统一用户退出
      this.$userServiceSocket.logout();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 设置时间
    setZero(a) {
      return a < 10 ? '0' + a : a
    },
    formatDate(date, vm) {
      var str = ''
      if (date != null) {
        str = vm.setZero(date.getFullYear()) + '/'
        str += vm.setZero(date.getMonth() + 1) + '/'
        str += vm.setZero(date.getDate()) + ''
      }
      return str
    },
    formatTime(date, vm) {
      var str = ''
      if (date != null) {
        str = vm.setZero(date.getHours()) + ':'
        str += vm.setZero(date.getMinutes()) + ':'
        str += vm.setZero(date.getSeconds())
      }
      return str
    },
    formatWeek(date, vm) {
      var str = ''
      if (date != null) {
        var weekDay = [
          '星期天',
          '星期一',
          '星期二',
          '星期三',
          '星期四',
          '星期五',
          '星期六'
        ]
        str = weekDay[date.getDay()]
      }
      return str
    },

    messageReadCount() {
      sysMessages.messageReadCount().then(response => {
        if (response.code === 200) {
          this.unreadCount = response.data;
        }
      })
    },

    listSysMessagesByUser() {
      sysMessages.listSysMessagesByUser({pageNum:0, pageSize:5 }).then(response => {
        if (response.code === 200) {
          this.informdata = response.data.list
        }
      })
    },

    setRead(item) {
      if(item.id==null) {
        this.$modal.msgError('参数不正确');
        return;
      }
      sysMessages.read({messageId:item.id}).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess("设置成功") ;

          this.listSysMessagesByUser();
        }
      })
    },

    showMoreInform(val) {
      if(val==1)
      {
        this.$router.push({ path: "/inform/index" });
      }else{
        this.$router.push({ path: "/notice/index" });
      }
    },
    //常见问题指南显示dialog
    showGuide(){
      this.showdialog=true
      this.loading=true
      this.docPreview()
    },
    async docPreview(){
      await this.changeBlob().then(res=>{
        docx.renderAsync(res,this.$refs.preview);
      })
      this.loading=false
    },
    handleClose(){
      this.showdialog=false
    },
    //将文件路径转为blob
    changeBlob(){
      return new Promise(resolve =>{
        const xhr = new XMLHttpRequest()
        xhr.open('GET','../../../../data/在线产品交付(Java)-指南.docx',true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
          if(xhr.status === 200){
            resolve(xhr.response)
          }else{
            Message.error("文件读取错误！");
          }
        }
        xhr.send()
      })
    },


  }
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 60px;
  // overflow: hidden;
  position: relative;
  // background:rgba(59,89,117,1);
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);
  // background-image: url("~@/assets/index/header.png");
  // background-size: cover;
  // background: url("~@/assets/index/header.png"), linear-gradient(235deg ,  #2365e8 0%,  #25b1db 100%);
  //  background: url("~@/assets/index/header.png"),rgb(35, 101, 232);
  background: url("~@/assets/index/header.png"), #055c39;
  background-blend-mode: multiply;
  background-size: cover;
  .nowtime {
    display: inline-block;
    height: inherit;
    line-height: 60px;
    font-size: 20px;
    color: white;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    width: calc(100% - 210px);

    // background: url("~@/assets/index/header1.png"), linear-gradient(90deg , rgb(83, 202, 138) 0%, rgb(36, 153, 93) 100%);
    // background: url("~@/assets/index/header.png"), linear-gradient(90deg ,  #25b1db 0%, #2365e8 100%);
    // background-blend-mode: multiply;
    // background-size: 100% 100%;
    &.adming_bg {
      background: #e8f2ee;
      border-bottom: 1px solid #d7e6e0;
      box-shadow: 0px 2px 2px rgba(230, 235, 245,0.5);
      .right-menu-item {
        color: #055c39;
      }
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;
      ::v-deep i{
        font-size: 18px;
      }
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }

      .active_dot{
        display: inline-block;
        position: absolute;
        // right: 10px;
        top: 20px;
        background-color: #f56c6c;
        font-size: 12px;
        border-radius: 100%;
        color: #fff;
        height: 6px;
        width: 6px;
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 0px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 10px;
          position: relative;
          top: 6px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 16px;
          font-size: 12px;
        }
      }
    }
  }
  .user-name {
    // position: relative;
    // top: -8px;
    padding: 0 6px;
    font-size: 14px;
    // display: inline-block;
    // height: 70px;
    // width: 96px;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }
}
.el-dropdown-menu{
  z-index: 9999999 !important;
}

.el-row {
  font-size: 16px;
  border-bottom: 1px solid rgba(227, 227, 227, 1);
//   cursor: pointer;
  .title {
    font-weight: normal;
  }
  .time {
    // float: right;
  }
  .read-btn{
    float: right;
  }
  .read-status{
    color: red;
    &.is-read{
      color:#3b5975;
    }
  }
}
</style>
<style>
.msg-tooltip.el-tooltip__popper.is-light{
  z-index: 9999999 !important;
}
</style>

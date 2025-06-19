<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- <div class="nowtime">
      <div style="float:left;font-size:30px;">
        {{ formatTime(date,this) }}
      </div>
      <div style="float:right;font-size:20px;margin-left:16px;line-height:25px;">
        <div> {{ formatDate(date,this) }}</div>
        <div style="margin-top:2px;font-size:16px"> {{ formatWeek(date,this) }}</div>
      </div>
    </div> -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
<!--        <error-log class="errLog-container right-menu-item hover-effect" />-->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
<!--        <el-tooltip content="全局字体" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->
      </template>
        <div style="display:inline-block;height:100%;min-width: 30px;line-height:80px;color:#fff;vertical-align: text-bottom;">
          <div>
            <el-tooltip effect="light" placement="bottom-end" popper-class="msg-tooltip">
                  <div slot="content">
                    <!-- <el-row :gutter="20" v-for="(item, index) in informdata" :key="index">
                      <h3 class="title">
                        <i class="el-icon-s-opportunity read-status" :class="{'is-read':item.readTime!=null}"></i>
                        {{item.content}}
                        <span class="time">{{parseTime(item.ctime, '{y}-{m}-{d} {h}:{i}')}}</span>
                        <el-button size="mini" type="primary" v-if="item.readTime==null" class="read-btn" @click="setRead(item)">设为已读</el-button>
                      </h3>
                    </el-row> -->
                    <div style="width:100px;">
                        <el-button size="small" type="text" @click="showMoreInform(1)">个人消息</el-button>
                        <el-badge
                        :value="unreadCount"
                        :max="99"
                        style="margin-top: 10px;margin-left:10px;"
                        :hidden="unreadCount === 0"
                        >
                      </el-badge>
                    </div>
                    <div style="width:100px;">
                      <el-button size="small" type="text" @click="showMoreInform(2)">公告</el-button>
                    </div>
                </div>
                <i class="el-icon-message-solid" style="font-size:30px;" />
             </el-tooltip>
            <el-badge
            :value="unreadCount"
            :max="99"
            style="margin-top: -40px;margin-left: -10px;"
            :hidden="unreadCount === 0"
            >
            </el-badge>
          </div>
       
      </div>
      
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" v-if="device!=='mobile'" > 
        <div class="avatar-wrapper" style="margin-top:8px">
          <img :src="avatar+'?imgSource'" class="user-avatar" :onerror="defaultA">
          <span class="user-name">{{userInfo.realName}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" style="margin-top:-10px">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <router-link to="/">
            <el-dropdown-item>成果视图</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;font-size:14px">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

import * as sysMessages from "@/api/sys-messages"

export default {
  components: {
    // Breadcrumb,
    // Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    // Search
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
      informdata: []
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
    this.listSysMessagesByUser()
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
      if(val==1){
        this.$router.push({ path: "/inform/index" });
      }else{
        this.$router.push({ path: "/notice/index" });
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background:rgba(59,89,117,1);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .nowtime {
    display: inline-block;
    height: inherit;
    line-height: 70px;
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
    line-height: 70px;

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

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          // position: relative;
          // top: -27px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 22px;
          font-size: 12px;
        }
      }
    }
  }
  .user-name {
    position: relative;
    top: -8px;
    padding: 0 6px;
    font-size: 14px;
    // display: inline-block;
    // height: 70px;
    // width: 96px;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }
}
// ::v-deep .msg-tooltip .is-light{
//   margin-top:-25px !important;
// }
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

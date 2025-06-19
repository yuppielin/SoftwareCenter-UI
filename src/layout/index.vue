<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div :class="{'fixed-header':fixedHeader}" style="width:100%">
      <!-- <logo v-if="device!=='mobile'" :style="{'display':showForAF?'none':'block'}" class="logo" :collapse="false" style="float:left;width:210px;height: 70px;overflow: hidden;position: relative;" /> -->
      <!-- <main-bar v-if="device!=='mobile'" v-show="showTopInfo" style="margin-left:210px;" /> -->
      <navbar />
    </div>
    <div :class="{hasTagsView:needTagsView}" class="main-container"  :style="{'margin-left':showForAF?'0px':'210px'}">
      <sidebar v-if="device!=='mobile'" class="sidebar-container"  style="top:60px;"  :style="{'display':showForAF?'none':'block'}" />
      <!-- <app-main :style="{'margin-top':userInfo.roles[0]=='AFUser' || userInfo.roles[0]=='user'?'70px':'0px'}"/> -->
      <app-main style="padding-top:70px;height:calc(100vh - 300px);overflow-y:auto;"/>
    </div>
  </div>
</template>

<script>
import Logo from "./components/Sidebar/Logo"
import RightPanel from '@/components/RightPanel'
import Hamburger from '@/components/Hamburger'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
// import Search from '@/components/HeaderSearch'
import Search from './components/search'
import globalSearch from '@/views/index/search/global-search'
// import MainBar from './components/MainBar.vue'
// import noticeBar from '@/views/components/notice'// 消息滚屏
export default {
  name: 'Layout',
  components: {
    Breadcrumb,
    Hamburger,
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Search,
    globalSearch,
    // MainBar,
    Logo
    // noticeBar
  },
  mixins: [ResizeMixin],
  data(){
    return {
        // noticeCon:"2023年4月15日 指K类软件发布，请各单位下载使用。",
        userInfo:'',
        // showTopInfo: false,
        showForAF: false
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted(){
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if(this.userInfo.roles[0]=='AFUser'||this.userInfo.roles[0]=='SYUser'||this.userInfo.roles[0]=='user'){
      this.showForAF = true
    }
    // if(localStorage.getItem("userType") === "user") {
    //   this.showTopInfo = true
    // }
  },
  methods: {
    openTip(){

    },
    toggleSideBar() {
      if (this.device !== 'mobile') {
        this.$store.dispatch('app/toggleSideBar')
      }
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    change(value) {
      this.$router.push({
        path: '/index/search-more',
        params: {
          keyword: value
        }
      })
    }
  }
}
</script>
<style scoped>
.logo {
  background-image: url('~@/assets/index/logoBackground.png');
  background-size: cover;
  width: 210px;
  height: 70px;
}
</style>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .breadcrumb {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: white;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
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
      line-height: 50px;
      box-shadow: 0px 2px 4px #ebebeb;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }
    }
    .app-wrapper {
      @include clearfix;
      position: relative;
      height: 100%;
      width: 100%;

      &.mobile.openSidebar {
        position: fixed;
        top: 0;
      }
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 2000;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  #app .sidebar-container {
    // background-color:rgba(174,191,207,1);
    // background-image: url("~@/assets/index/menu.png");
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    background-color: #055c39;
  }
  #app .main-container {
    background-color: #fff;
  }
  #app .breadcrumb {
    background-color: #055c39;
  }
</style>

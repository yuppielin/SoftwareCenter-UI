<template>
  <section class="app-main"  @scroll="scrolls">
    <!-- <notice-bar v-if="$checkPermission(['user'])"  @click="openTip"  /> -->
    <!-- <div class="content-nav" v-if="isShow">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item v-for="breadcrumbItem in breadcrumbList" :key="breadcrumbItem.path" :to="{path:breadcrumbItem.path}" v-if="breadcrumbItem.redirect == null || breadcrumbItem.redirect == ''">
          <item v-if="breadcrumbItem.meta" :icon="breadcrumbItem.meta && breadcrumbItem.meta.icon" style="background-color:#0a76a4" />
          {{ breadcrumbItem.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>
<script>
import Item from './Sidebar/Item'
export default {
  name: 'AppMain',
  components: {
    // noticeBar: () => import('@/views/components/notice/vertical'), // 消息滚屏
    Item
  },
  data() {
    return {
      active: false,
      notice: {},
      userInfo:{},
      isShow:true,
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
    breadcrumbList() {
      // debugger
      return this.$route.matched
    }
  },
  created() {
    // 禁用选择
    document.onselectstart = new Function("event.returnValue=false");
  },
  mounted() {
    // window.addEventListener('scroll', this.scrolls)
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if(this.userInfo.roles[0]=='AFUser'||this.userInfo.roles[0]=='SYUser'||this.userInfo.roles[0]=='user'){
      this.isShow = false;
    }
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.scrolls)
  },
  methods: {
    scrolls(e) {
      // let scrollTop = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // if(scrollTop>5) {
      //   this.active = true;
      // }else{
      //   this.active = false
      // }
    },
    openTip() {
      // this.notice = item;
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 0px);
  width: 100%;
  position: relative;
  overflow: hidden;

}

.fixed-header+.app-main {
  // padding-top: 50px;
  padding-top: 70px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
::v-deep .el-breadcrumb__inner {
    color: grey!important;
}
::v-deep .sub-el-icon:before {
  color: rgba(23,138,227,1);
}
::v-deep svg {
  color: rgba(23,138,227,1);
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 0px;
  }
}
.content-nav{
      margin: 10px 20px 0px 20px;
      font-size: 16px;
      color: rgb(40, 40, 41);
}
</style>

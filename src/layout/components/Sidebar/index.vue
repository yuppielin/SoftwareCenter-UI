<template>
  <div :class="{'has-logo':showLogo}">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.id" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style scoped lang='scss'>
/* .el-menu >>> .el-menu--inline {
  background-color: #006eff
} */
::v-deep .el-submenu__icon-arrow {
  color: white;
}
/* ::v-deep .el-submenu.is-opened {
  background-color: #006eff
} */
::v-deep .el-scrollbar{
  .el-scrollbar__wrap{
    &::-webkit-scrollbar-track-piece {
      // background: #c7300b!important;
    }

    // 滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸
    &::-webkit-scrollbar {
      width: 6px;
    }
    // 定义滚动条轨道 内阴影+圆角
    &::-webkit-scrollbar-track {
      // width: 2px;
      // border-radius: 10px;
      // background-color: #aebfcf;
    }
    // 滑块 内阴影+圆角
    &::-webkit-scrollbar-thumb {
      // background: #ff4949;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover{
      background: #ff4949;
    }

  }
}
</style>

<template>
  <div style="display:inline-block">
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
        @select="handleSelect"
      >

        <el-menu-item class="menu_container" :class="{'is-active':index==acticeIndex}" v-for="(item, index) in serviceList" :index="index"  :key="index" @mousemove.native="showChild(index,item)">
            {{ item.name ? item.name : item.children[0].name }}

            <div v-if="item.children.length>0" class="menu-child" @mouseleave="closeChild">
              <div class="left">
                <div class="title">
                  <p><span class="title-button"></span>{{item.name}}</p>

                </div>
              </div>
              <div class="right">
                <div class="subRight">
                  <ul>
                    <li  v-for="(itemChild, index1) in item.children" :key="itemChild.id" :class="{active:index1 == indexLi}"  @mousemove.stop="overLi(index1)" @click="selectCate(item)"> <span>{{itemChild.name}}</span></li>
                  </ul>
                </div>
              </div>
          </div>
        </el-menu-item>
      </el-menu>
    </el-scrollbar> -->

    <!-- <div class="menu-child">
        <div class="left">
          <div class="title">
            <p>分类</p>
            <div class="title-button"></div>
          </div>
        </div>
        <div class="right">
          <div class="subRight">
             <ul>
              <li>测试1</li>
              <li>测试1</li>
              <li>测试1</li>
            </ul>
          </div>

        </div>
    </div> -->
    <div class="menu_container" :class="{'is-active':$route.path=='/index/list'}">
      <span><router-link to="/index/list"><i class="el-icon-s-home"></i> 首页 </router-link></span>
    </div>
    <div class="menu_container" :class="{'is-active':$route.path=='/index/software-more?service=91&title=我的关注'}">
      <span><router-link to="/index/software-more?service=91&childService=全部&title=我的关注"> <i class="el-icon-menu"></i> 我的关注</router-link></span>
    </div>
    <div class="menu_container" :class="{'is-active':$route.path=='/index/software-more?service=91&title=通用软件'}">
      <span><router-link to="/index/software-more?service=91&childService=全部&title=通用软件"> <i class="el-icon-menu"></i> 通用软件</router-link></span>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="menu_container" :class="{'is-active':index==acticeIndex}" v-for="(item, index) in serviceList" :index="index"  :key="index" @mousemove="showChild(index,item)" @click="selectCate(item)" style="position:relative">
            {{ item.name ? item.name : item.children[0].name }}

            <div v-if="item.children.length>0" class="menu-child" @mouseleave="closeChild">
              <div class="top_arrow el-icon-caret-top">
                <!-- <i class="el-icon-caret-top"></i> -->
              </div>

              <!-- <div class="left">
                <div class="title">
                  <p><span class="title-button"></span>{{item.name}}</p>

                </div>
              </div> -->
              <div class="right">
                <div class="subRight">
                  <ul>
                    <li  v-for="(itemChild, index1) in item.children" :key="itemChild.id" :class="{active:index1 == indexLi}"  @mousemove.stop="overLi(index1)" @mouseleave="leaveLi(index1)" @click.stop="selectChildCate(item,itemChild)"> <span style="font-size: 14px;">{{itemChild.name}}</span></li>
                  </ul>
                </div>
              </div>
          </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import { isExternal } from '@/utils/validate'
import path from 'path'
import Item from './Sidebar/Item.vue'
import AppLink from './Sidebar/Link'
import { commonRoutes } from '@/router'

import * as category from '@/api/category'
import { log } from 'util'

export default {
  components: { Item,AppLink },
  data() {
    return {
      serviceList : [],
      acticeIndex: -1,
      currentChild: [],
      indexLi: -1,
    }
  },
  computed: {
    ...mapGetters([
      'main_routes',
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
    },
  },
 mounted() {
    this.getServiceList();
    // this.initCurrentRoutes()
  },
  methods:{
    //获取分类
    getServiceList() {
      category.getCategoryList("service", null, null).then(response => {
        if (response.code === 200) {
         this.serviceList = response.data.list
        //  console.log(this.serviceList, 999)
        }
      })
    },
    showChild(index) {
      this.acticeIndex = index;
    },
    closeChild(){
      this.acticeIndex = -1;
    },
    overLi(index) {
      this.indexLi = index
    },
    leaveLi(index) {
      this.indexLi = -1;
    },
    selectCate(item) {
      console.log(item,"selectCate")
      this.$router.push({
        path: '/index/software-more',
        query: {
          service: item.id,
          childService: '全部',
          title:item.name
        }
      })
    },
    selectChildCate(item, child) {
      this.$router.push({
        path: '/index/software-more',
        query: {
          service: child.id,
          childService: child.name,
          title:item.name
        }
      })
    },
    // 通过当前路径找到二级菜单对应项，存到store，用来渲染左侧菜单
    initCurrentRoutes() {
      const { path } = this.$route
      let route = this.routes.find(
        item => item.path === '/' + path.split('/')[1]
      )
      // 如果找不到这个路由，说明是首页
      if (!route) {
        route = this.main_routes.find(item => item.path === '/')
      }
      this.$store.commit('permission/SET_ROUTES', route)
    },
    // 判断该路由是否只有一个子项或者没有子项，如果是，则在一级菜单添加跳转路由
    isOnlyOneChild(item) {
      if (item.children && item.children.length === 1) {
        return true
      }
      return false
    },
    resolvePath(item) {
      // 如果是个完成的url直接返回
      if (isExternal(item.path)) {
        return item.path
      }
      // 如果是首页，就返回重定向路由
      if (item.path === '/') {
        const path = item.redirect
        return path
      }

      // 如果有子项，默认跳转第一个子项路由
      let path = ''
      /**
       * item 路由子项
       * parent 路由父项
       */
      const getDefaultPath = (item, parent) => {
        // 如果path是个外部链接（不建议），直接返回链接，存在个问题：如果是外部链接点击跳转后当前页内容还是上一个路由内容
        if (isExternal(item.path)) {
          path = item.path
          return
        }
        // 第一次需要父项路由拼接，所以只是第一个传parent
        if (parent) {
          path += (parent.path + '/' + item.path)
        } else {
          path += ('/' + item.path)
        }
        // 如果还有子项，继续递归
        if (item.children) {
          getDefaultPath(item.children[0])
        }
      }

      if (item.children) {
        getDefaultPath(item.children[0], item)
        return path
      }

      return item.path
    },
    handleSelect(key, keyPath) {
      // 把选中路由的子路由保存store
      const route = this.main_routes.find(item => item.path === key)
      let croute=[]
      croute.push(route);
      this.$store.commit('permission/SET_ROUTES', croute.concat(commonRoutes))
    },
  }
}
</script>
<style scoped lang='scss'>
.el-menu--horizontal > .el-menu-item {
    float: left;
    height: 60px;
    line-height: 60px;
    margin: 0;
    border-bottom: 0px solid transparent;
    // background:  #3b5975 !important;
    // color: lightgray !important;
    color: #fff !important;
}
.el-menu-item.is-active, .el-menu-item.is-active {
    // background-color: #3b5975 !important;
    // border-bottom: 3px solid rgb(42, 130, 228) !important;
    border-bottom: 3px solid white !important;
    color: #fff !important;
    // font-weight: 600;
}
::v-deep .el-scrollbar__wrap {
  overflow: hidden;
}
.menu_container {
  // &.actice{
  //   .menu-child {
  //     display: flex;
  //   }
  // }
  // width: 80px;
  text-align: center;
  display: inline-block;
  color: #fafafa;
  line-height: 60px;
  margin: 0 10px;
  cursor: pointer;
  // border-bottom: 3px solid  #3b5975;
  &:hover{
    // border-bottom: 3px solid rgb(42, 130, 228);
    border-bottom: 3px solid white;
  }

}

.menu-child {
  position: absolute;
  // transform: translateZ('num'px);
  top: 60px;
  // width:calc(100% - 210px);
  // width: 100%;
  max-height: 904px;
  z-index: 99999;
  // border: 1px solid #000;
  background-color: #fff;
  // -webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
  cursor: initial;
  // overflow: auto;
  box-shadow:0 15px 30px 4px rgb(0 0 0/10%);
  // left: 210px;
  left: -30px;
  // left: 50%;
  // transform: translateX(-50%) ;
  // display: flex;
  display: none;
  border-radius: 4px;
  min-width: 240px;
  box-shadow: 0px 2px 4px #bababa;

  .top_arrow{
    height: 18px;
    width: 18px;

    // background: url("~@/assets/index/menu_top.png") no-repeat;
    // background-color: #fff;
    position: absolute;
    top: -10px;
    left: 35px;
  }

  p{
    padding: 0;
    margin: 0;
    line-height: 20px;
    color: #000;
  }
  div {
    float: left;
    // display: inline-block;
  }
  .left{

    width: 240px;
    background-color: rgb(42, 130, 228);
    padding: 32px 10px 32px 32px;
    // background: #fafafa;
    background: lightgray;
    .title{
      p::after{
        max-width: 16px;
        background: #000;
        position: absolute;
        bottom: -4px;
        left: 0;
        display: block;
        width: 100%;
        height: 2px;
        transition: .21s;
      }
    }
    .title-button{
      // background: #000;
      border-left: 4px solid #3b5975 ;
      padding-left: 5px;
      display: inline-block;
      width: 2px;
      height: 15px;
      line-height: 15px;
      // margin-top: 3px;
    }

  }
}
.right {
  padding: 20px;
  .subRight{

    // width: 864px;
    display: flex;
  }
  ul {
    padding: 0;
    margin: 0;
    li{
      list-style: none;
      line-height: 20px;
      float: left;
      padding-right: 16px;
      width: 100px;
      color: #000;
      font-weight: normal;
      font-size: 14px;
      margin-bottom: 6px;
      cursor:pointer;
      span{
        display: inline-block;
      }
      &.active{

        span{
          // border-bottom: 1px solid #3b5975;
        // color:  #3b5975;
        color:  rgb(43, 181, 110);
        }
      }
    }
  }

}

.menu_container.is-active{
  .menu-child {
    display: flex;
  }
}
</style>

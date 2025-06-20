import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
  roles:
  admin  超级管理员
  XT_Role 信通局人员
  AF_Role 安防检测人员
  ZG_Role 部门主管人员
  YW_Role 运维人员
  LY_Role 领域管理人员
  ZH_Role 指挥系统人员 editor
  SY_Role 试用单位管理人员

  user             普通用户
  applicationUser  业务管理人员
  AFUser           安防检测人员
  SYUser           试用管理人员
  SHUser           部门主管人员
  XTUser           信T局管理人员
 */
/**
 * 常量路由，所有角色都可访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    redirect: to => {
      if(localStorage.getItem('loginType')=='admin') {
        return {path: '/admin'}
      }else {
        return {path: '/index'}
      }

    }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/onelogin',
    component: () => import('@/views/login/onelogin'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'notice',
        hidden: true,
        component: () => import('@/views/index/notice/'),
        meta: { title: '通知公告', icon: 'el-icon-files', noCache: true }
      }
    ]
  },
  {
    path: '/inform',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'inform',
        hidden: true,
        component: () => import('@/views/inform/'),
        meta: { title: '通知公告', icon: 'el-icon-files', noCache: true}
      }
    ]
  },
  {
    path: '/suggestion',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'suggestion',
        hidden: true,
        component: () => import('@/views/suggestion/'),
        meta: { title: '通知公告', icon: 'el-icon-files', noCache: true }
      }
    ]
  },
  {
    path: '/bigscreen',
    hidden: true,
    component: () => import('@/views/admin/bigscreen'),
  },
  {
    path: '/license',
    component: () => import('@/views/license/index'),
    hidden: true
  },
  {
    path: '/docusign',
    component: () => import('@/views/docusign/index'),
    hidden: true
  },
  // {
  //   path: '/m/app',
  //   redirect: '/m/app/index',
  //   name: 'app',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/app/index'),
  //       name: 'index',
  //       meta: {
  //         title: '移动app',
  //         icon: 'chart'
  //       }
  //     },
  //     {
  //       path: 'theme/:id',
  //       hidden: true,
  //       component: () => import('@/views/app/app-list'),
  //       name: 'theme',
  //       meta: {
  //         title: '专题软件'
  //       }
  //     },
  //     {
  //       path: 'list/:id',
  //       hidden: true,
  //       component: () => import('@/views/app/app-detail'),
  //       name: 'info',
  //       meta: { title: '软件详情' }
  //     }
  //   ]
  // }
]

/**
 * 主页导航路由
 */
export const mainRoutes =[]

/**
 * 通用软件
 */
export const commonRoutes =[
  {
    path: '/index/common',
    component: Layout,
    meta:{
      title:'基础软件',
      icon: 'el-icon-coin',
    },
    children: [

    ]
  },
]
/**
 * 根据需要加载
 */
export const indexRoutes = [
  {
    path: '/index',
    component: Layout,
    redirect: '/index/list',
    name: 'index',
    meta: {
      roles: ['user','editor','ZH_Role','YW_Role','LY_Role']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/index/index'),
        name: 'list',
        meta: {
          title: '首页',
          icon: 'el-icon-s-home'
        }
      },
      {
        path: 'list/:id',
        hidden: true,
        component: () => import('@/views/index/software/software-detail'),
        name: 'info',
        meta: { title: '软件详情' }
      },
      {
        path: 'software-data/:id',
        hidden: true,
        component: () => import('@/views/index/software/software-detail-data'),
        name: 'software-data',
        meta: { title: '软件列表' }
      },
      {
        path: 'theme/:id',
        hidden: true,
        component: () => import('@/views/index/theme/software-theme'),
        name: 'theme',
        meta: { title: '专题软件' }
      },
      {
        path: 'theme-more',
        hidden: true,
        component: () => import('@/views/index/theme/software-theme-more'),
        name: 'thememore',
        meta: { title: '专题软件' }
      },
      {
        path: 'search-more',
        hidden: true,
        component: () => import('@/views/index/search/global-search'),
        name: 'search-more',
        meta: { title: '软件检索' }
      },
      {
        path: 'software-more',
        hidden: true,
        component: () => import('@/views/index/software/software-more'),
        name: 'software-more',
        meta: { title: '软件列表' }
      },
      {
        path: 'software-download-more',
        hidden: true,
        component: () => import('@/views/index/software/software-download-more'),
        name: 'software-download-more',
        meta: { title: '批量下载' }
      },{
        path: 'software-download-list',
        hidden: true,
        component: () => import('@/views/index/software/software-download-list'),
        name: 'software-download-list',
        meta: { title: '导入下载' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'notice',
        hidden: true,
        component: () => import('@/views/index/notice/'),
        meta: { title: '通知公告', icon: 'el-icon-files', noCache: true }
      }
    ]
  },
  {
    path: '/inform',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'inform',
        hidden: true,
        component: () => import('@/views/inform/'),
        meta: { title: '通知公告', icon: 'el-icon-files', noCache: true}
      }
    ]
  },{
    path: '/index/software-more?service=91&title=通用软件',
    component: () => import('@/views/index/index'),
    name: 'common',
    meta: {
      title:'通用软件',
      icon: 'chart'
    }
  },
]
/**
 * 根据角色动态加载
 */
export const asyncRoutes = [
  // 前台浏览
  {
    path: '/index',
    component: Layout,
    // redirect: '/index/list',
    name: 'index',
    meta: {
      roles: ['user','editor','ZH_Role','YW_Role','LY_Role']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/index/index'),
        name: 'list',
        meta: {
          title: '首页',
          icon: 'chart'
        }
      },
    ]
  },
  {
    path: '/index',
    component: Layout,
    redirect: '/index/list',
    name: 'index',
    meta: {
      roles: ['user','editor','ZH_Role','YW_Role','LY_Role']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/index/index'),
        name: 'list',
        meta: {
          title: '通用软件',
          icon: 'chart'
        }
      },
      {
        path: 'list/:id',
        hidden: true,
        component: () => import('@/views/index/software/software-detail'),
        name: 'info',
        meta: { title: '软件详情' }
      },
      {
        path: 'software-data/:id',
        hidden: true,
        component: () => import('@/views/index/software/software-detail-data'),
        name: 'software-data',
        meta: { title: '软件列表' }
      },
      {
        path: 'theme/:id',
        hidden: true,
        component: () => import('@/views/index/theme/software-theme'),
        name: 'theme',
        meta: { title: '专题软件' }
      },
      {
        path: 'theme-more',
        hidden: true,
        component: () => import('@/views/index/theme/software-theme-more'),
        name: 'thememore',
        meta: { title: '专题软件' }
      },
      {
        path: 'search-more',
        hidden: true,
        component: () => import('@/views/index/search/global-search'),
        name: 'search-more',
        meta: { title: '软件检索' }
      },
      {
        path: 'software-more',
        hidden: true,
        component: () => import('@/views/index/software/software-more'),
        name: 'software-more',
        meta: { title: '软件列表' }
      },
      {
        path: 'software-download-more',
        hidden: true,
        component: () => import('@/views/index/software/software-download-more'),
        name: 'software-download-more',
        meta: { title: '批量下载' }
      }
    ]
  },
  // {
  //   path: '/index/package',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   meta: {
  //     // title: '软件封装',
  //     icon: 'el-icon-coin',
  //     roles: ['editor']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name:'package-index',
  //       component: () => import('@/views/index/package/index'),
  //       meta: { title: '软件封装', icon: 'el-icon-upload' }
  //     },
  //   ]
  // },
  {
    path: '/index/software',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '我的软件',
      icon: 'el-icon-coin',
      roles: ['LY_Role']
    },
    children: [
      // {
      //   path: 'upload',
      //   name:'upload',
      //   component: () => import('@/views/index/software/software-upload'),
      //   meta: { title: '软件上传', icon: 'el-icon-upload' }
      // },
      {
        path: 'fragment-upload',
        name: 'fragment-upload',
        component: () => import('@/views/index/software/fragment-upload'),
        meta: { title: '软件上传', icon: 'el-icon-upload' }
      },
      {
        path: 'fragmentedit',
        name: 'fragmentedit',
        hidden: true,
        component: () => import('@/views/index/software/fragment-edit'),
        meta: { title: '软件编辑', icon: 'el-icon-tickets' }
      },
      {
        path: 'status',
        name: 'status',
        component: () => import('@/views/index/software/software-status'),
        meta: { title: '软件状态', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: '/index/document',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '软件资料',
      icon: 'el-icon-document',
      roles: ['LY_Role']
    },
    children: [
      {
        path: 'upload',
        name: 'upload',
        component: () => import('@/views/index/document/software-doc-upload'),
        meta: { title: '资料上传', icon: 'el-icon-upload' }
      },
      {
        path: 'status',
        name: 'status',
        component: () => import('@/views/index/document/software-doc-status'),
        meta: { title: '资料状态', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: '/index/download',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'download',
        component: () => import('@/views/index/download/'),
        meta: { title: '我的下载', icon: 'el-icon-files', noCache: true, roles: ['editor'] }
      }
    ]
  },
  // {
  //   path: '/index/technical',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'technical',
  //       component: () => import('@/views/index/technical'),
  //       meta: { title: '技术支持', icon: 'el-icon-files', noCache: true, roles: ['editor'] }
  //     },
  //     {
  //       path: 'add',
  //       name: 'technical',
  //       hidden: true,
  //       component: () => import('@/views/index/technical/form'),
  //       meta: { title: '技术支持', icon: 'el-icon-files', noCache: true, roles: ['editor'] }
  //     }
  //   ]
  // },

  {
    path: '/notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'notice',
        hidden: true,
        component: () => import('@/views/index/notice/'),
        meta: { title: '通知公告', icon: 'el-icon-files', noCache: true }
      }
    ]
  },
  {
    path: '/inform',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'inform',
        hidden: true,
        component: () => import('@/views/inform/'),
        meta: { title: '通知公告', icon: 'el-icon-files', noCache: true}
      }
    ]
  },
  // {
  //   path: '/index/demand',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/index/demand/'),
  //       name: 'demand',
  //       meta: { title: '需求提报', icon: 'el-icon-edit-outline', noCache: true, roles: ['editor'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/index/demand',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'demand',
  //       component: () => import('@/views/index/demand/'),
  //       meta: { title: '需求提报', icon: 'el-icon-files', noCache: true, roles: ['editor', 'user'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/index/onlinets',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'onlinets',
  //       component: () => import('@/views/index/online-ts/'),
  //       meta: { title: '技术支持', icon: 'el-icon-chat-line-round', noCache: true,  roles: ['editor', 'user']}
  //     }
  //   ]
  // },
  // {
  //   path: '/wiki',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'wiki',
  //       component: () => import('@/views/wiki'),
  //       meta: { title: '资源推荐', icon: 'education', noCache: true,roles:['editor'] }
  //     }
  //   ]
  // },
  // 后台管理
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: '首页',
          icon: 'dashboard',
          roles: ['admin', 'applicationUser', 'SHUser', 'AFUser', "XTUser", 'SYUser'],
          noCache: true
        }
      },{
        path: 'softwareDetail/:id',
        name: 'softwareDetail',
        hidden: true,
        component: () => import('@/views/dashboard/admin/softwareDetail'),
        meta: {
          title: '软件详情',
          icon: 'dashboard'
        }
      },{
        path: 'softwareDetailData/:id',
        name: 'softwareDetailData',
        hidden: true,
        component: () => import('@/views/dashboard/admin/softwareDetailData'),
        meta: {
          title: '软件资料',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/admin/softwareUpload',
    // redirect: 'noRedirect',
    component: Layout,
    // alwaysShow: true,
    hidden: true,
    meta: {
      title: '软件上传',
      icon: 'tree-table',
      noCache: true,
      roles: [ 'applicationUser', 'SHUser', 'AFUser', "XTUser", 'SYUser']
    },
    children: [

      {
        path: 'showStatus',
        name: 'showStatus',
        // hidden: true,
        component: () => import('@/views/admin/zaixian/showStatus'),
        meta: { title: '任务状态', icon: 'el-icon-s-data',  roles: ['applicationUser', 'SHUser', 'AFUser', "XTUser", 'SYUser']}
      },

      {
        path: 'basicSoftwareUpload',
        name: 'basicSoftwareUpload',
        hidden: true,
        component: () => import('@/views/admin/zaixian/basicSoftwareUpload'),
        meta: { title: '基础软件上传', icon: 'el-icon-tickets' , roles: [ 'applicationUser']}
      },
      {
        path: 'applicationUpload',
        name: 'applicationUpload',
        hidden: true,
        component: () => import('@/views/admin/zaixian/applicationUpload'),
        meta: { title: '业务软件上传', icon: 'el-icon-tickets', roles: [ 'applicationUser'] }
      },
      {
        path: 'applicationziliaoUpload',
        name: 'applicationziliaoUpload',
        hidden: true,
        component: () => import('@/views/admin/zaixian/applicationziliaoUpload'),
        meta: { title: '资料上传', icon: 'el-icon-tickets', roles: [ 'applicationUser'] }
      },
      {
        path: 'taskProcess',
        name: 'taskProcess',
        hidden: true,
        component: () => import('@/views/admin/zaixian/taskProcess'),
        meta: { title: '任务流程' }
      },
      {
        path: 'taskDetails',
        name: 'taskDetails',
        hidden: true,
        component: () => import('@/views/admin/zaixian/taskDetails'),
        meta: { title: '任务详情' }
      },
      // {
      //   path: 'LCSoftwareAndTaskStatus',
      //   name: 'LCSoftwareAndTaskStatus',
      //   component: () => import('@/views/admin/zaixian/LCSoftwareAndTaskStatus'),
      //   meta: { title: '状态统计', icon: 'el-icon-tickets', roles: [ 'admin']  }
      // },
      {
        path: 'testReportUpload',
        name: 'testReportUpload',
        hidden: true,
        component: () => import('@/views/admin/zaixian/testReportUpload'),
        meta: { title: '软件试用' }
      },
    ]
  },
  // {
  //   path: 'management',
  //   name: 'management',
  //   component: () => import('@/views/admin/software/index'),
  //   meta: { title: '软件管理', icon: 'el-icon-s-grid', roles:['admin', 'applicationUser', 'SHUser', "XTUser"] }
  // },
  {
    path: '/admin/software',
    // redirect: 'noRedirect',
    component: Layout,
    // alwaysShow: true,
    meta: {
      title: '软件仓库',
      icon: 'tree-table',
      noCache: true,
      roles: ['admin', 'applicationUser', 'SHUser', "XTUser",]
    },
    children: [
      // {
      //   path: 'unreviewed',
      //   name: 'unreviewed',
      //   component: () => import('@/views/admin/software/software-unreview'),
      //   meta: { title: '待审核软件', icon: 'el-icon-tickets' }
      // },
      // {
      //   path: 'showStatus',
      //   name: 'showStatus',
      //   hidden: true,
      //   component: () => import('@/views/admin/zaixian/showStatus'),
      //   meta: { title: '任务状态', icon: 'el-icon-s-data',  roles: ['applicationUser', 'SHUser', 'AFUser', "XTUser", 'SYUser']}
      // },
      {
        path: 'unreviewed/:id',
        hidden: true,
        component: () => import('@/views/admin/software/software-info'),
        meta: { title: '软件详情', icon: 'el-icon-tickets' }
      },
      {
        path: 'upload',
        name: 'upload',
        hidden: true,
        component: () => import('@/views/admin/software/software-upload'),
        meta: { title: '软件上传', icon: 'el-icon-tickets' }
      },
      {
        path: 'edit',
        name: 'edit',
        hidden: true,
        // component: () => import('@/views/admin/software/software-edit'),
        component: () => import('@/views/admin/software/software-upload'),
        meta: { title: '软件编辑', icon: 'el-icon-tickets' }
      },
      {
        path: 'upgrade',
        name: 'upgrade',
        hidden: true,
        component: () => import('@/views/admin/software/software-upgrade'),
        meta: { title: '软件升级', icon: 'el-icon-tickets' }
      },
      {
        path: 'fragmentupload',
        name: 'fragmentupload',
        hidden: true,
        component: () => import('@/views/admin/software/fragment-upload'),
        meta: { title: '软件上传', icon: 'el-icon-tickets' }
      },
      {
        path: 'fragmentedit',
        name: 'fragmentedit',
        hidden: true,
        // component: () => import('@/views/admin/software/fragment-edit'),
        component: () => import('@/views/admin/software/fragment-upload'),
        meta: { title: '软件编辑', icon: 'el-icon-tickets' }
      },
      {
        path: 'fragmentUpgrade',
        name: 'fragmentUpgrade',
        hidden: true,
        component: () => import('@/views/admin/software/fragment-upgrade'),
        meta: { title: '软件编辑', icon: 'el-icon-tickets' }
      },
      {
        path: 'batchupload',
        name: 'batchupload',
        hidden: true,
        component: () => import('@/views/admin/software/software-batch-upload'),
        meta: { title: '批量上传', icon: 'el-icon-tickets' }
      },

      // {
      //   path: 'common',
      //   name:'common',
      //   component: () => import('@/views/admin/software/software-common'),
      //   meta: { title: '共性产品', icon: 'el-icon-tickets' }
      // }
      // {
      //   path: '/basicSoftwareUpload',
      //   name: 'basicSoftwareUpload',
      //   hidden: true,
      //   component: () => import('@/views/admin/zaixian/basicSoftwareUpload'),
      //   meta: { title: '基础软件上传', icon: 'el-icon-tickets' , roles: [ 'applicationUser']}
      // },
      // {
      //   path: 'applicationUpload',
      //   name: 'applicationUpload',
      //   hidden: true,
      //   component: () => import('@/views/admin/zaixian/applicationUpload'),
      //   meta: { title: '业务软件上传', icon: 'el-icon-tickets', roles: [ 'applicationUser'] }
      // },
      // {
      //   path: 'taskProcess',
      //   name: 'taskProcess',
      //   hidden: true,
      //   component: () => import('@/views/admin/zaixian/taskProcess'),
      //   meta: { title: '任务流程' }
      // },
      // {
      //   path: 'taskDetails',
      //   name: 'taskDetails',
      //   hidden: true,
      //   component: () => import('@/views/admin/zaixian/taskDetails'),
      //   meta: { title: '任务详情' }
      // },
      {
        path: 'LCSoftwareAndTaskStatus',
        name: 'LCSoftwareAndTaskStatus',
        component: () => import('@/views/admin/zaixian/LCSoftwareAndTaskStatus'),
        meta: { title: '状态统计', icon: 'el-icon-tickets', roles: [ 'admin']  }
      },{
        path: 'systemDetails',
        name: 'systemDetails',
        hidden: true,
        component: () => import('@/views/admin/zaixian/systemDetails'),
        meta: { title: '状态统计', icon: 'el-icon-tickets', roles: [ 'admin']  }
      },
      // {
      //   path: 'testReportUpload',
      //   name: 'testReportUpload',
      //   hidden: true,
      //   component: () => import('@/views/admin/zaixian/testReportUpload'),
      //   meta: { title: '软件试用' }
      // },




      {
        path: 'apply',
        name: 'apply',
        component: () => import('@/views/admin/software/software-apply'),
        meta: { title: '权限申请', icon: 'el-icon-s-promotion', roles: ['admin'] }
      },
      {
        path: 'applyreview',
        name: 'applyreview',
        hidden: true,
        component: () => import('@/views/admin/software/software-apply-review'),
        meta: { title: '下载申请审核' }
      },
    ]
  },
  {
    path: '/admin/document',
    // redirect: 'noRedirect',
    component: Layout,
    meta: {
      title: '软件资料',
      icon: 'el-icon-files',
      noCache: true,
      roles: ['admin','applicationUser']
    },
    children: [
      // {
      //   path: 'unreviewed',
      //   name: 'unreviewed',
      //   component: () => import('@/views/admin/document/document-unreview'),
      //   meta: { title: '待审核资料', icon: 'el-icon-tickets' }
      // },
      {
        path: 'unreviewed/:id',
        hidden: true,
        component: () => import('@/views/admin/document/document-info'),
        meta: { title: '资料详情', icon: 'el-icon-tickets' }
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/admin/document/index'),
        meta: { title: '资料管理', icon: 'el-icon-folder' }
      }
      // {
      //   path: 'apply',
      //   name:'apply',
      //   component: () => import('@/views/admin/document/document-apply'),
      //   meta: { title: '资料申请', icon: 'el-icon-tickets' }
      // },
    ]
  },
  {
    path: '/admin/demand',
    component: Layout,
    name: 'demand',
    meta: {
      title: '需求管理',
      icon: 'edit',
      noCache: true,
      roles: ['admin', 'applicationUser', "XTUser"]
    },
    children: [
      // {
      //   path: 'question',
      //   name: 'question',
      //   component: () => import('@/views/admin/demand/software-question'),
      //   meta: { title: '问题管理', icon: 'el-icon-tickets' }
      // },
      // {
      //   path: 'question/:id/info',
      //   name: 'questionInfo',
      //   hidden:true,
      //   component: () => import('@/views/admin/demand/software-question-info'),
      //   meta: { title: '问题详情', icon: 'el-icon-tickets' }
      // },
      {
        path: 'index',
        name: 'demandManage',
        component: () => import('@/views/admin/demand/'),
        meta: { title: '需求管理', icon: 'el-icon-edit-outline' }
      },
      {
        path: ':id/info',
        name: 'demandInfo',
        hidden:true,
        component: () => import('@/views/admin/demand/software-demand-info'),
        meta: { title: '需求详情', icon: 'el-icon-tickets' }
      },
      {
        path: 'zb',
        name: 'demandZB',
        hidden:true,
        component: () => import('@/views/admin/demand/software-demand-zb'),
        meta: { title: '需求整编', icon: 'el-icon-tickets' }
      },
    ]
  },
  {
    path: '/admin/ts',
    component: Layout,
    name: 'ts',
    meta: {
      title: '技术服务',
      icon: 'edit',
      noCache: true,
      roles: ['admin', 'applicationUser', 'SHUser', "XTUser"]
    },
    // alwaysShow: true,
    children: [
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/admin/ts/index'),
        meta: { title: '技术服务', icon: 'el-icon-chat-dot-square'}
      },
      {
        path: ':id/info',
        name: 'info',
        component: () => import('@/views/admin/ts/software-ts-info'),
        hidden: true,
        meta: { title: '支持详情', icon: 'el-icon-tickets' }
      },
    ]
  },
  {
    path: '/admin/statistics',
    component: Layout,
    redirect: 'noRedirect',
    name: 'statistics',
    meta: {
      title: '统计分析',
      icon: 'chart',
      noCache: true,
      roles: ['admin']
    },
    children: [
      {
        path: 'software',
        name: 'softwareStatistics',
        component: () => import('@/views/admin/statistics/software-statistics'),
        meta: { title: '软件统计', icon: 'el-icon-tickets' }
      },
      {
        path: 'question',
        name: 'questionStatistics',
        component: () => import('@/views/admin/statistics/software-question-statistics'),
        meta: { title: '技术支持统计', icon: 'el-icon-tickets' }
      },
      {
        path: 'demand',
        name:'demandStatistics',
        component: () => import('@/views/admin/statistics/software-demand-statistics'),
        meta: { title: '需求统计', icon: 'el-icon-tickets' }
      },
      // {
      //   path: 'report',
      //   name:'report',
      //   component: () => import('@/views/admin/statistics/software-statistics-report'),
      //   meta: { title: '报告管理', icon: 'el-icon-tickets' }
      // }
    ]
  },
  {
    path: '/admin/category',
    // redirect: 'noRedirect',
    component: Layout,
    meta: {
      title: '分类管理',
      icon: 'el-icon-menu',
      noCache: true,
      roles: ['admin']
    },
    children: [
      {
        path: 'service',
        name: 'service',
        component: () => import('@/views/admin/category/software-service-type'),
        meta: { title: '软件业务分类', icon: 'el-icon-tickets' }
      },
      {
        path: 'software-type',
        name: 'software-type',
        component: () => import('@/views/admin/category/software-type'),
        meta: { title: '通用软件分类', icon: 'el-icon-tickets' }
      },
      {
        path: 'data',
        name: 'data',
        component: () => import('@/views/admin/category/software-data-type'),
        meta: { title: '资料分类', icon: 'el-icon-tickets' }
      },
      {
        path: 'demand',
        name:'demand',
        component: () => import('@/views/admin/category/software-demand-type'),
        meta: { title: '需求分类', icon: 'el-icon-tickets' }
      },
      {
        path: 'language',
        name:'language',
        component: () => import('@/views/admin/category/dev-language-type'),
        meta: { title: '开发语言分类', icon: 'el-icon-tickets' }
      },
      {
        path: 'tech-stack',
        name:'tech-stack',
        component: () => import('@/views/admin/category/tech-stack-type'),
        meta: { title: '技术栈分类', icon: 'el-icon-tickets' }
      },
      // {
      //   path: 'question',
      //   name:'question',
      //   component: () => import('@/views/admin/category/software-question-type'),
      //   meta: { title: '问题分类', icon: 'el-icon-tickets' }
      // },
      {
        path: 'jbz',
        name:'jbz',
        component: () => import('@/views/admin/category/software-jbz-type'),
        meta: { title: '兵种分类', icon: 'el-icon-tickets' }
      },
      {
        path: 'ly',
        name:'ly',
        component: () => import('@/views/admin/category/software-ly-type'),
        meta: { title: '领域分类', icon: 'el-icon-tickets' }
      },
      {
        path: 'fragment',
        name:'fragment',
        component: () => import('@/views/admin/category/software-fragmenttype-type'),
        meta: { title: '软件段类型', icon: 'el-icon-tickets' }
      },
      {
        path: 'fragment-arch',
        name:'fragment-arch',
        component: () => import('@/views/admin/category/software-fragment-arch-type'),
        meta: { title: '软件架构', icon: 'el-icon-tickets' }
      },
    ]
  },
  // {
  //   path: '/admin/deploy',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   meta: {
  //     title: '在线资源管理',
  //     icon: 'el-icon-s-operation',
  //     noCache: true,
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'repo',
  //       component: () => import('@/views/admin/deploy/fragment-repo'),
  //       name: 'repo',
  //       meta: { title: '服务管理', icon: 'el-icon-receiving' }
  //     }
  //     // {
  //     //   path: 'ts',
  //     //   component: () => import('@/views/admin/deploy/fragment-ts'),
  //     //   name: 'ts',
  //     //   meta: { title: '部署态势', icon: 'el-icon-s-marketing' }
  //     // }
  //   ]
  // },
  {
    path: '/admin/front',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '前台管理',
      icon: 'el-icon-s-flag',
      noCache: true,
      roles: ['admin']
    },
    children: [
      {
        path: 'lunbo',
        component: () => import('@/views/admin/front/software-lunbo'),
        name: 'lunbo',
        meta: { title: '轮播设置', icon: 'el-icon-more' }
      },
      // {
      //   path: 'theme',
      //   component: () => import('@/views/admin/front/software-theme'),
      //   name: 'theme',
      //   meta: { title: '专题管理', icon: 'el-icon-menu' }
      // }
    ]
  },
  {
    path: '/admin/system',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting',
      noCache: true,
      roles: ['admin']
    },
    children: [
      {
        path: 'user-review',
        component: () => import('@/views/admin/system/user-review'),
        name: 'user-review',
        meta: { title: '用户审核', icon: 'el-icon-user' },
      },
      {
        path: 'user-info-review',
        component: () => import('@/views/admin/system/user-info-review'),
        name: 'user-info-review',
        hidden:true,
      },
      {
        path: 'user',
        component: () => import('@/views/admin/system/user-manage'),
        name: 'user',
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },

      {
        path: 'role',
        component: () => import('@/views/admin/system/user-role-manage'),
        name: 'role',
        meta: { title: '角色管理', icon: 'el-icon-coordinate' }
      },
      {
        path: 'menu',
        component: () => import('@/views/admin/system/system-menu-manage'),
        name: 'menu',
        meta: { title: '菜单管理', icon: 'el-icon-coordinate' }
      },
      {
        hidden: true,
        path: 'user/:id/edit',
        component: () => import('@/views/admin/system/user-edit'),
        name: 'userEdit',
        meta: { title: '用户编辑', icon: 'el-icon-user' }
      },
      {
        path: 'unit',
        component: () => import('@/views/admin/system/unit-manage'),
        name: 'unit',
        meta: { title: '组织管理', icon: 'el-icon-s-opportunity' }
      },
      {
        path: 'devunit',
        component: () => import('@/views/admin/system/dev-unit-manage'),
        name: 'devunit',
        meta: { title: '研发单位', icon: 'el-icon-school' }
      }
    ]
  },
  {
    path: '/admin/notice',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '公告管理',
      icon: 'el-icon-setting',
      noCache: true,
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/notice/index'),
        name: 'notice',
        meta: { title: '公告管理', icon: 'el-icon-bell' }
      },

    ]
  },

  {
    path: '/index/demand',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'demand',
        component: () => import('@/views/index/demand/'),
        meta: { title: '需求提报', icon: 'el-icon-edit-outline', noCache: true, roles: ['editor', 'user'],}
      }
    ]
  },
  {
    path: '/index/onlinets',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'onlinets',
        component: () => import('@/views/index/online-ts/'),
        meta: { title: '技术支持', icon: 'el-icon-chat-line-round', noCache: true, roles: ['editor', 'user'],}
      }
    ]
  },
  {
    path: '/admin/analysis',
    redirect: 'noRedirect',
    component: Layout,
    meta: {
      title: '生态分析',
      icon: 'el-icon-menu',
      noCache: true,
      roles: ['admin']
    },
    children: [
      {
        path: 'dev',
        name: 'dev-analysis',
        component: () => import('@/views/admin/analysis/dev'),
        meta: { title: '开发生态', icon: 'el-icon-tickets' }
      },
      {
        path: 'runtime',
        name: 'runtime-analysis',
        component: () => import('@/views/admin/analysis/runtime'),
        meta: { title: '运行生态', icon: 'el-icon-tickets' }
      }
    
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 防止连续点击多次路由报错
// let routerPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(err => err)
// }

// export default new Router({
//   mode: 'history', // 去掉url中的#
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRoutes
// })



export default router

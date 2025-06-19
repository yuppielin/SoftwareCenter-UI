import { indexRoutes, asyncRoutes, constantRoutes } from '@/router'
import { getRouters } from '@/api/user'
import Layout from '@/layout/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
      console.log(asyncRoutes, "asyncRoutes")
    return new Promise(resolve => {
      getRouters().then(res => {
        console.log(res,"res")
        // console.log(localStorage.getItem('userType'))
        const resData = removeSome(res.data)
        // const resData = JSON.parse(JSON.stringify(res.data))
        const newRes = filterAsyncRouter(resData, false, true)
        newRes.push({ path: '*', redirect: '/404', hidden: true })
        console.log(newRes, "newRes")
        if(localStorage.getItem('userType') === "user"){
          const updateRoutes = filterAsyncRoutes(newRes, roles)
          const accessedRoutes = indexRoutes.concat(updateRoutes)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
          console.log(accessedRoutes, "accessedRoutes")
        }else{
          const accessedRoutes = filterAsyncRoutes(newRes, roles)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      })
      // const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

function removeSome(resRoutes) {
  var returnRoutes = []
  if(localStorage.getItem('userType') === "admin"){
    resRoutes.forEach(item => {
      if(item.path!="/index/demand"&&item.path!="/index/onlinets"){
        returnRoutes.push(item)
      }
    })
    return JSON.parse(JSON.stringify(returnRoutes))
  }else{
    return JSON.parse(JSON.stringify(resRoutes))
  }
}
// // 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  // console.log(view);
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    // return () => import(`@/views/${view}`)
    return (resolve) => require([`@/views${view}`], resolve)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

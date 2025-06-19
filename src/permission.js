import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import * as user from '@/api/user'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/register', '/license', '/onelogin'] // no redirect whitelist

const mobileList = ['/m/app/index']

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  const url = window.location.href;
  const localUrl = new URL(url);
  let index = url.indexOf('?')
  let param = url.substring(index)
  if (!getToken() && to.path !== '/onelogin' && ( url.indexOf('code=') !== -1 || url.indexOf('token=') !== -1 )) {
    
    let paramObj = to.query;
    let code = paramObj.code  || localUrl.searchParams.get('code');
    let token = paramObj.token || localUrl.searchParams.get('token');
   
    let params = new URLSearchParams(paramObj)
    let urlParams = params ? '&'+params : '';
    let redirect = `redirect=${to.path}` + urlParams;
    let newUrl = `/onelogin?`+ redirect
    if(code) {
      newUrl = `${localUrl.origin}/#/onelogin?`+ redirect
      newUrl +=  "&code="+code;
      window.location.replace(newUrl);
    }
    if(token) {
      // newUrl +=  "&token="+token;
      next(newUrl)
    }
    // window.location.replace(newUrl);
   
    NProgress.done()
    return
  }
  // if (window.location.href.indexOf('code=') !== -1) {
  //   await user.getUserServiceToken(window.location.href).then(response => {
  //     if (response.code === 200) {
  //       setToken(response.data)
  //     }
  //   })
  // } else if (window.location.href.indexOf('token=') !== -1) {
  //   const token = window.location.href.substring(window.location.href.indexOf('token=') + 6, window.location.href.indexOf('token=') + 45)
  //   await user.checkToken(token).then(response => {
  //     if (response.code === 200) {
  //       setToken(token)
  //     }
  //   })
  // }
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
          // to = '/index/list'
          // next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }

    await store.dispatch('applyMsgCount/getUserApplyTotal');
    
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else if (mobileList.indexOf(to.path) !== -1 || to.path.startsWith('/m/app')) {
      next()
    } else {
      let params = new URLSearchParams(to.query)
      let urlParams = params ? '&'+params : '';
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}` + urlParams)
      // next(`http://192.168.6.130:8001/#/login`)
      // eslint-disable-next-line require-atomic-updates
      // window.location.href = 'http://192.168.6.130:8800/auth/token/loginForApp?client_id=yyrjsd&response_type=code&redirect_uri=http://192.168.6.5:8080/%23/index/list'
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

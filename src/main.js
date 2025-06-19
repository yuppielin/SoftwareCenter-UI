import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import uploader from 'vue-simple-uploader'
import Element from 'element-ui'
import './styles/element-variables.scss'
//import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import { parseTime, parseStrEmpty, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree, formatFileSize, tansParams, fileIcon, getComeArrWithChild, closeOptions } from "@/utils/common";

import Pagination from "@/components/Pagination";
Vue.component('Pagination', Pagination);

import CloseBack from "@/views/components/close-back";
Vue.component('CloseBack', CloseBack);

import '@/assets/font/font.css'

import '@/styles/index.scss' // global css

// px2rem 自适应
import 'lib-flexible'


import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import plugins from './plugins' // plugins

import * as filters from './filters' // global filters

import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'
Vue.use(SuperFlow)

import  * as socketjs from '@/utils/socket'
Vue.prototype.$socketjs = socketjs;
socketjs.createWebSocket();

import * as userServiceSocket  from '@/utils/userService'
Vue.prototype.$userServiceSocket = userServiceSocket;
// import VueLazyLoad from 'vue-lazyload'
// Vue.use(VueLazyLoad, {
//   loading:require('./assets/imgs/1.png')
// })

// import Worker from 'worker-loader!./Worker.js'

import checkPermission from './utils/permission'
Vue.prototype.$checkPermission = checkPermission

Vue.prototype.parseTime = parseTime
Vue.prototype.parseStrEmpty = parseStrEmpty
Vue.prototype.formatFileSize = formatFileSize
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.tansParams = tansParams
Vue.prototype.handleTree = handleTree
Vue.prototype.$cookies = Cookies;
Vue.prototype.fileIcon = fileIcon;
Vue.prototype.getComeArrWithChild = getComeArrWithChild
Vue.prototype.closeOptions = closeOptions

Vue.use(plugins)
Vue.use(uploader)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  //locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

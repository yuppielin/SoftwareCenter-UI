import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import errorCode from '@/utils/errorCode'
import { getToken, setToken } from '@/utils/auth'
import  resetMessage  from '@/utils/resetMessage'
import { saveAs } from 'file-saver'
import { tansParams, blobValidate } from "@/utils/common";
import router from '@/router'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style

// create an axios instance
const service = axios.create({
  baseURL: config.url + process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 3000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // NProgress.start();

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //config.headers['X-Token'] = getToken()
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // NProgress.done();

    const res = response.data

    // 未设置状态码则默认成功状态
    const code = res.code || 200;
    
     // 获取错误信息
    const msg = errorCode[code] || res.msg || errorCode['default']

    // 二进制数据则直接返回
    // if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
    //   return res.data
    // }
    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      Message({
        message: res.message || 'Error'  || res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }else if (code === 400) {
      // Message({ message: msg, type: 'error' })
      resetMessage({ message: msg, type: 'error' })

      if(res.msg != null && res.msg != undefined && res.msg.includes("重新登录") ) {
        store.dispatch('user/resetToken').then(() => {
          router.push({
            path: "/login"
          })
        })
      }

      return Promise.reject(new Error(msg))
    } else {
      return res
    }
  },
  error => {
    // debugger
    // console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // return Promise.reject(error)
    //console.log('err' , error.response.data)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
   
    if(error.response) {
      let returnMsg = error.response.data.msg;
      if(returnMsg != null && returnMsg != undefined && returnMsg.includes("jdbc.CannotGetJdbcConnectionException") ) {
        message = "数据库连接失败，请联系管理员，检查数据库服务或连接";
      }
      

      if(returnMsg != null && returnMsg != undefined && returnMsg.includes("授权") ) {
        message = returnMsg;
        router.push({
          path: "/license"
        })
      }
    }

    // Message({ message: message, type: 'error', duration: 5 * 1000 })
    resetMessage({ message: message, type: 'error', duration: 5 * 1000 })

    return Promise.reject(error)
  }
)

// 通用下载方法
// export function download(url, params, filename, config) {
//   downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
//   return service.post(url, params, {
//     transformRequest: [(params) => { return tansParams(params) }],
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     responseType: 'blob',
//     ...config
//   }).then(async (data) => {
//     const isBlob = blobValidate(data);
//     if (isBlob) {
//       const blob = new Blob([data])
//       saveAs(blob, filename)
//     } else {
//       const resText = await data.text();
//       const rspObj = JSON.parse(resText);
//       const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
//       Message.error(errMsg);
//     }
//     downloadLoadingInstance.close();
//   }).catch((r) => {
//     console.error(r)
//     Message.error('下载文件出现错误，请联系管理员！')
//     downloadLoadingInstance.close();
//   })
// }

function downloadFile(url) {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.style.height = 0;
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(function () {
      iframe.remove();
  }, 5*60*1000);
}

// 通用下载方法
export function download(url, isIframe=0) {
  if(isIframe!=0) {
    downloadFile(config.url + process.env.VUE_APP_BASE_API +url+"&token="+getToken())
    return false;
  }else{
    const elelink = document.createElement("a")
    elelink.style.display = "none"
    // elelink.download = fileName
    elelink.href = config.url + process.env.VUE_APP_BASE_API +url+"&token="+getToken()
    elelink.target ="_blank"
    document.body.appendChild(elelink)
    elelink.click()
    document.body.removeChild(elelink)
    }
}


export default service

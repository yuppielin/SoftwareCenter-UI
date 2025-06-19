import * as user from '@/api/user';
import Cookies from 'js-cookie';
import { Message, MessageBox, Notification, Loading } from 'element-ui'
import router from '@/router'
import store from '@/store';
import { getToken, setToken } from '@/utils/auth' // get token from cookie
class UserService {

  constructor(url = "ws://127.0.0.1:8803/middle/webSocketServer", ServerUrl = "http://127.0.0.1:8800/auth", localServer = "http://127.0.0.1:8803/middle") {
      this.url = url
      this.ServerUrl = ServerUrl
      this.localServer = localServer
      this.loginmsg = 'login'
      this.logoutmsg = 'logout'
      this.refreshmsg = 'refresh'
      this.userSocket = null
      this.tokensplit = '#'
      this.callbackForGetLoginInfo = null
      this.calllogoutbackForGetLoginInfo = null
      this.getMessage = this.getMessage.bind(this);
  }
  /**
   * 启动 websoket
   */
  webSocketInit (refresh, logout) {
    if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持socket');
    } else {
      this.userSocket = new WebSocket(this.url);
        // 监听socket连接
        this.userSocket.onopen = this.open;
        //监听消息
        this.userSocket.onmessage = this.getMessage;
        //监听socket错误连接
        this.userSocket.onclose = this.close;
        //监听socket错误连接
        this.userSocket.onerror = this.error;

    }
  }
 open () {
    //判断是否已登陆，如果已登陆调用回调函数getLogin
    //如果未登陆，调用回调函数loginNotYet
    console.log("连接成功")
  }
  send() {
    let params = '测试发送消息'
    console.log("发送消息：", params)
    this.userSocket.send(params)
  }
  close (e) {
      console.log("连接关闭")
      // userSocket.close()
  }
  error () {
      console.log("连接错误")
      // userSocket.close()
  }
  //接收数据
  getMessage (e) {
    console.log('接收数据：', e)
    // debugger
    /*
    *判断消息类型，如果是登陆，调用回调函数getLogin
    * 如果是刷新token，则是将接收到的token存入sessionStorage
    * 如果是登出，则清除sessionStorage，并调用回调函数getLogout
    */
   console.dir(this)
    let msgArray = e.data.split(this.tokensplit);
    if (msgArray.length > 0) {
        /*
        * 接收消息类型如果是登出：
        * 1、接收tokean，替换掉浏览器SessionStorage中的token信息
        * 2、判断当前是否登陆，如果已登陆，不用刷新页面，否则跳转到欢迎页面或首页
        */

        // debugger
        let str = msgArray[0].split(' ')

        if (str.includes(this.logoutmsg)) {
          this.calllogoutbackInfo(e.data)
          // 退出
            window.sessionStorage.removeItem('accessToken')
            window.sessionStorage.removeItem('refreshToken')
            window.sessionStorage.removeItem('Authorization')
        } else if (msgArray[0] === (this.loginmsg)) {
            /*
            * 接收消息类型如果是登陆：
            * 1、接收tokean，替换掉浏览器SessionStorage中的token信息
            * 2、判断当前是否登陆，如果已登陆，不用刷新页面，否则跳转到欢迎页面或首页
            */
          //  this.callrefreshbackInfo(msgArray)
          this.callrefreshbackInfo({
            accessToken: msgArray[1],
            refreshToken: msgArray[2]
          })
            window.sessionStorage.setItem("accessToken", msgArray[1]);
            window.sessionStorage.setItem("refreshToken", msgArray[2]);
            window.sessionStorage.setItem('Authorization', 'Bearer' + ' ' + msgArray[1]);
                  // 跳转路径

        } else if (msgArray[0] === (this.refreshmsg)) {
          this.callrefreshbackInfo({
            accessToken: msgArray[1],
            refreshToken: msgArray[2]
          })
            //刷新
            window.sessionStorage.setItem("accessToken", msgArray[1]);
            window.sessionStorage.setItem("refreshToken", msgArray[2]);
            window.sessionStorage.setItem('Authorization', 'Bearer' + ' ' + msgArray[1])
        }
    }
  }
   /**
   * 退出消息回调函数
   * @param callback 回调函数
   */
  logout (callback) {
    this.calllogoutbackForGetLoginInfo = callback;
  }
  calllogoutbackInfo (currentLoginFlag) {
    this.calllogoutbackForGetLoginInfo.call(this, currentLoginFlag);
  }
  /**
   * 刷新token函数
   * @param callback 回调函数
   */
  refresh (callback) {
    this.callbackForGetLoginInfo = callback;
  }
  callrefreshbackInfo (currentLoginFlag) {
    this.callbackForGetLoginInfo.call(this, currentLoginFlag);
  }
  /**
   * 从本地服务器中获取token值
   * reoslve 回调参数
   *      data:  成功返回的数据
   * @param reject 失败回调
   *    reject 回调参数
   *      XMLHttpRequest：XMLHttpRequest 对象
   *      textStatus：错误信息
   *      errorThrow：捕获的异常对象
   */
  getToken(resolve, reject) {
    this.ajax({
          url: this.localServer + "/token/get.json",
          type:'GET',
          dataType:'json',
          success: (data) => {
              resolve(data)
          },
          error: function (XMLHttpRequest, textStatus, errorThrow) {
              reject(XMLHttpRequest, textStatus, errorThrow)
          }
      });
  }
  sendLogout(resolve, reject) {
      this.ajax({
              url: this.localServer + "/token/logout.json",
              type:'POST',
              dataType:'json',
              success: (data) => {
                  resolve(data)
              },
              error: function (XMLHttpRequest, textStatus, errorThrow) {
                  reject(XMLHttpRequest, textStatus, errorThrow)
              }
          });
  }
  getConfig(resolve, reject) {
      this.ajax({
              url: "/index/one_login/getConfig",
              type:'GET',
              dataType:'json',
              success: (data) => {
                  resolve(data)
              },
              error: function (XMLHttpRequest, textStatus, errorThrow) {
                  reject(XMLHttpRequest, textStatus, errorThrow)
              }
          });
  }
  saveToken(params, resolve, reject) {
      var that = this;
      // this.getConfig(function(config){
      //     config = JSON.parse(config);
          let obj={
                      'accessToken':params.accessToken,
                      'refreshToken':params.refreshToken,
                      'clientId':params.userConfig.clientId,
                      'clientSecret':params.userConfig.clientSecret,
                      'type':'login'
              }
          let formData =  Object.keys(obj).map(key=>{
              return key + "=" +obj[key];
          }).join('&')
          
          // console.log(config);
          that.ajax({
              url: that.localServer + "/token/create.json",
              type:'POST',
              dataType:'json',
              data:formData,
              success: (data) => {
                  resolve(data)
              },
              error: function (XMLHttpRequest, textStatus, errorThrow) {
                  reject(XMLHttpRequest, textStatus, errorThrow)
              }
          });
      // })
      
    }

  ajax(options){
    options=options||{};
  //   options.type = (options.type||'GET').toUpperCase();
    options.dataType = options.dataType||'json';
    // params=formatParams(options.data);

    //创建-第一步
    var xhr;
    //非IE6
    if(window.XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else{
        //ie6及其以下版本浏览器
        xhr=ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收-第三步
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            var status=xhr.status;
            if(status>=200&&status<300){
                options.success&&options.success(xhr.responseText,xhr.responseXML);
            }else{
                options.error&&options.error(status);
            }
        }
    }

    //连接和发送-第二步
    if(options.type=='GET'){
        xhr.open('GET',options.url,true);
        // xhr.setRequestHeader('Authorization', authorization)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
        xhr.send(null);
    }else if(options.type=='POST'){
        xhr.open('POST',options.url,true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(options.data);
    }
  }

}

/**
 * 初始化
 */

const userservice = new UserService();
userservice.webSocketInit();

// let accessToken = window.sessionStorage.getItem('accessToken');
// let refreshToken = window.sessionStorage.getItem('refreshToken');
// let userConfig = window.sessionStorage.getItem('userConfig');
let {accessToken, refreshToken, userConfig} = getLoginSession();

// token刷新 通知回调
userservice.refresh(function(data) {
  const {accessToken, refreshToken} = data
  
  if(accessToken) { //未登录情况下
    login(accessToken, refreshToken)
  }
 
});
// 登出 通知回调
userservice.logout(function(res) {
  let {accessToken} = getLoginSession();
  if(!accessToken) { //已退出的情况下，不执行下述操作
    return
  }
  console.log("登出");
  store.dispatch('user/logout');
  localStorage.clear();
  sessionStorage.clear();
  router.push(`/login?redirect=${router.app._route.fullPath}`)
})
var sendFlag = 'sendFlag';
// 登录成功后将token设置到代理服务器
export function saveToken() {
  let {accessToken, refreshToken, userConfig} = getLoginSession();
  // if(accessToken && refreshToken && userConfig && getSendTokenFlag()!=1) {
  if(accessToken && refreshToken && userConfig) {
    let params = {accessToken,refreshToken,userConfig}
    userservice.saveToken(params,function(res) {
        res = JSON.parse(res);
        if(res.code==200) {
            saveSendTokenFlag();
        }
    },function(res){});
  }
}
// saveToken()

userservice.getToken(function(res) {
    res = JSON.parse(res);
    // console.log(res,"resres");
    if(res.code==200) {
      login(res.data.accessToken, res.data.refreshToken)
       
    }else{
      // router.push('/login')
    }
},function(err){
    // router.push('/login')
});

function getOtherQuery(query) {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect' && cur !== 'token' && cur !== 'code') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

function getCookie(name) {
  let nameEQ = name + "=";
  let cookies = document.cookie.split(';')
  for(let i=0; i<cookies.length; i++) {
      let cookie = cookies[i];
      while(cookie.charAt(0)===' ') {
          cookie = cookie.substring(1, cookie.length);
      }
      if(cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
      }
  }
  return null;
}

function getLoginSession() {
  let accessToken = window.sessionStorage.getItem('accessToken');
  let refreshToken = window.sessionStorage.getItem('refreshToken');
  let userConfig = window.sessionStorage.getItem('userConfig');
  return {accessToken, refreshToken, userConfig}
}

export function setLoginSession(accessToken, refreshToken, userConfig) {
  window.sessionStorage.setItem('accessToken', accessToken);
  window.sessionStorage.setItem('refreshToken', refreshToken);
  window.sessionStorage.setItem('userConfig', userConfig);
}

function saveSendTokenFlag() {
  localStorage.setItem(sendFlag,1)
}
function getSendTokenFlag() {
  return localStorage.getItem(sendFlag)
}
function removeSendTokenFlag() {
  localStorage.removeItem(sendFlag)
}

function login(accessToken, refreshToken) {
  // 已登录情况下不使用此
  let {userConfig} = getLoginSession();
  if(userConfig) {
    return;
  }
  user.checkToken(accessToken).then(response => {
      if (response.code === 200) {
        if(response.data.userInfo.status==1) {
          Message.success('登录成功')
          setToken(response.data.token)
          // this.$router.push('/index')
    
          // window.sessionStorage.setItem("accessToken", accessToken);
          // window.sessionStorage.setItem("refreshToken", refreshToken);
          // window.sessionStorage.setItem("userConfig", response.data.userConfig);
          setLoginSession(accessToken, refreshToken, response.data.userConfig)

          saveToken()

           // window.location.replace(url);
           let query = router.app._route.query;
           let redirect = query.redirect=='undefined' ? null :  query.redirect
           let otherQuery = getOtherQuery(query)
          router.push({
              path: redirect || "/index",
              query: otherQuery
            
          })
        }else{
          Message.error('请等待管理员审核')
          router.push('/login')
        }
      }
  })
}

export function logout() {
  userservice.sendLogout((res)=> {

  });
  window.sessionStorage.clear();

  removeSendTokenFlag();
  // let loginUrl = '/index/one_login/logout';
  // location.href = loginUrl;
}

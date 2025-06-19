import { logout } from '@/api/user';

import Cookies from 'js-cookie';
import Vue from 'vue'

const TokenKey = 'Admin-Token'
var downloader_switch = window._gconf.downloader
var lockReconnect = false; //避免ws重复连接
var ws = null;
var wsUrl = 'ws://localhost:8188';
// createWebSocket(wsUrl)

export  function createWebSocket() {
    if(!Cookies.get(TokenKey)||!downloader_switch) {
        return false;
    }
    let url = wsUrl;
    try {
        if('WebSocket' in window) {
         
            ws =new WebSocket(url);
            Vue.prototype.socket = ws;
            initEventHandle();
        }
    }catch (e) {
        reconnect(url);
        console.log(e)
    }
}
function initEventHandle() {
    ws.onclose = function (e) {
        reconnect(wsUrl);
        console.log('websocket连接关闭', e)
    }
    ws.error = function () {
        reconnect(wsUrl);
        console.log('websocket连接错误')
    }
    ws.onopen  =function () {
        heartCheck.reset().start(); //心跳检查重置
        console.log('下载器连接成功')
    }
    ws.onmessage = function (event) {
        console.log('消息',event.data)
        heartCheck.reset().start();
        // if (event.data !='pingOk') {
        //     let data
        // }
    }
}
//窗口关闭时主动关闭连接
window.onbeforeunload = function () {
    ws.close();
}
function reconnect (url) {
    if(lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
    },2000)
}
// 心跳检查
var heartCheck = {
    timeout: 3000,
    timeoutObj: null,
    serverTimeoutObj:null,
    reset: function () {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function () {
        var self = this;
        this.timeoutObj = setTimeout(function () {
            // 发送心跳，后端接收后，返回心跳消息
            // onmessage 拿到放回的消息说明连接正常
            ws.send('ping');
            console.log('ping!');
            self.serverTimeoutObj = setTimeout(function () { //超过一定时间未重置，说明后端主动断开了
                ws.close();
            }, self.timeout)
        }, this.timeout)
        return this;
    },
}


let sendMsg = (data, callback) => {
    if(ws.readyState===1) {
        globalCallback = callback;
        sendData = data;
        data = JSON.stringify(data);
        console.log("发送数据", data);
        ws.send(data);
    }else {
        setTimeout(()=>{
            console.log(ws, '等待socket链接成功');
            sendMsg(data, callback);
        }, 3500)
        return false;
    }

    ws.onmessage = ev => {
        callback && callback(ev)
    }
}

export default {sendMsg}
// let globalCallback =null, sendData = null;

// export let createSocket = url =>{ //创建socket

//     if(!Cookies.get(TokenKey)) {
//         return false;
//     }

//     try {
//         if( 'WebSocket' in window) {
//             socket = new WebSocket(url);
//         }else if('MozWebSocket' in window) {
//             socket = new MozWebSocket(url);
//         }
//         Vue.prototype.socket = socket;
//         initSocket();
//     }catch(e) {
//         reconnet(url);
//     }
// }

// let sendMsg = (data, callback) => {
//     if(socket.readyState===1) {
//         globalCallback = callback;
//         sendData = data;
//         data = JSON.stringify(data);
//         console.log("发送数据", data);
//         socket.send(data);
//     }else {
//         setTimeout(()=>{
//             console.log(socket, '等待socket链接成功');
//             sendMsg(data, callback);
//         }, 3500)
//         return false;
//     }

//     socket.onmessage = ev => {
//         callback && callback(ev)
//     }
// }

// let initSocket = () => {  //初始化websocket

//     socket.onopen = () => {
//         if(isReconnet) {
//             console.log('websocket重新链接了');
//             isReconnet = false;
//         }
//         console.log('websocket链接成功');
//     }

//     socket.onmessage = (ev) => {
//         console.log(ev, '链接正常');
//         let res = JSON.parse(ev.data)
//         console.log('获得消息', res);


//     }

//     socket.onerror = () => {
//         reconnect(wsUrl);
//         console.log('websocket连接错误')
//     }

//     socket.onclose = function (e) {
//         reconnect(wsUrl);
//         console.log('websocket连接关闭', e)
//     }
// }


//  //窗口关闭时主动关闭连接
//  window.onbeforeunload = function () {
//     ws.close();
// }
// function reconnect (url) {
//     if(lockReconnect) return;
//     lockReconnect = true;
//     setTimeout(function () {
//         createWebSocket(url);
//         lockReconnect = false;
//     },2000)
// }

// // 心跳检查
// var heartCheck = {
//     timeout: 3000,
//     timeoutObj: null,
//     serverTimeoutObj:null,
//     reset: function () {
//         clearTimeout(this.timeoutObj);
//         clearTimeout(this.serverTimeoutObj);
//         return this;
//     },
//     start: function () {
//         var self = this;
//         this.timeoutObj = setTimeout(function () {
//             // 发送心跳，后端接收后，返回心跳消息
//             // onmessage 拿到放回的消息说明连接正常
//             socket.send('ping');
//             console.log('ping!');
//             self.serverTimeoutObj = setTimeout(function () { //超过一定时间未重置，说明后端主动断开了
//                 socket.close();
//             }, self.timeout)
//         }, this.timeout)
//         return this;
//     },
// }





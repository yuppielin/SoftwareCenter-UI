import axios from 'axios'
import { Message,Loading } from 'element-ui'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { blobValidate } from "@/utils/common";
import { blob } from 'jszip/lib/support'
import { flags } from 'postcss-pxtorem/lib/pixel-unit-regex'

const baseURL = process.env.VUE_APP_BASE_API

export default {
  name(name, isDelete = true) {
    var url = baseURL + "/common/download?fileName=" + encodeURIComponent(name) + "&delete=" + isDelete
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  dowanlodByPath(path, name='') {
     let downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
    let url = '';
    // if(path.indexOf("http") != -1) { //未
    //   url = path;
    // }else{
    //   url = window._gconf.urlFilePrefix + '/' +path;
    // }
    url = window._gconf.urlFilePrefix + '/common/download?path=' + path + "&name=" + name; 
    url = encodeURI(url);
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'token':  getToken() }
    }).then((res) => {
      
      if(res.data.size<=0) {
        Message.error("文件不存在");
        return false;
      }
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob,name)
      } else {
        // this.printErrMsg(res.data);
        Message.error("文件不存在");
      }
      downloadLoadingInstance.close();
    })
  },
  downloadFile(url) {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.height = 0;
      iframe.src = url;
      document.body.appendChild(iframe);
      setTimeout(function () {
          iframe.remove();
      }, 5*60*1000);
  },
  async dowanlodByPathHerf(path, name = '') {
    let fileName = '';
    if(name=='') {
      fileName = name + row.path.substring(row.path.lastIndexOf("."))
    }else {
      fileName = name;
    }
    // if(this.isExistFile(path, name)===false) {
    //   return false;
    // }
    let isExist =  await this.isExistFile(path, name);
    if( isExist===false) {
      return false;
    }

    let url = '';
    // if(path.indexOf("http") != -1) { //未
    //   url = path;
    // }else{
    //   url = window._gconf.urlFilePrefix + '/' +path;
    // }
    url = window._gconf.urlFilePrefix + '/common/download?path=' + path + "&name=" + name;
    url = encodeURI(url);
    // console.log(url);
    this.downloadFile(url+"&token="+getToken());
    return;
    const elelink = document.createElement("a")
    elelink.style.display = "none"
    // elelink.download = fileName
    elelink.href = url+"&token="+getToken()
    // elelink.target ="_blank"
    document.body.appendChild(elelink)
    elelink.click()
    document.body.removeChild(elelink)
    return;
    // url = window._gconf.urlFilePrefix + '/common/download?path=' + path + "&name=" + name; 
    // let input = null;
    // let downForm = document.createElement("form");
    // downForm.setAttribute("method", 'get');
    // downForm.setAttribute("action", url);
    //  input = document.createElement("input");
    // input.setAttribute("type", 'hidden');
    // input.setAttribute("name", 'path');
    // input.setAttribute("value", path);
    // downForm.appendChild(input);
    //  input = document.createElement("input");
    // input.setAttribute("type", 'hidden');
    // input.setAttribute("name", 'name');
    // input.setAttribute("value", name);
    // downForm.appendChild(input);
    // document.querySelector("body").appendChild(downForm)
    // console.log(downForm,999);
    // downForm.submit();
          
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'token':  getToken() }
    }).then((res) => {
      // console.log(res, 999);
      if(res.data.size<=0) {
        Message.error("文件不存在");
        return false;
      }
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob,name)
        // const a = document.createElement("a");
        // a.setAttribute("download", fileName);
        // a.setAttribute("target", "_blank");
        // a.setAttribute("href", window.URL.createObjectURL(blob));
        // a.click();
      } else {
        Message.error("文件不存在");
        this.printErrMsg(res.data);
      }
    }).catch(()=>{
      Message.error("文件不存在");
    }).finally(()=>{

    }) 
    
  },

  // downloadSoftwareFile(userId, versionId) {
  //     let url = window._gconf.urlFilePrefix +'/download/softwareFile'; 
  //     axios({
  //       method: 'get',
  //       url: url,
  //       responseType: 'blob',
  //       params: { userId, versionId },
  //       headers: { 'token':  getToken() }
  //     }).then((res) => {
  //       const isBlob = blobValidate(res.data);
  //       if (isBlob) {
  //         const blob = new Blob([res.data])
  //         this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
  //       } else {
  //         this.printErrMsg(res.data);
  //       }
  //     })
  // },
  resource(resource) {
    var url = baseURL + "/common/download/resource?resource=" + encodeURIComponent(resource);
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  zip(url, name) {
    var url = baseURL + url
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, name)
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts);
  },
  async printErrMsg(data) {
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    Message.error(errMsg);
  },

  downloadSoftwareByUrlAndEditName(url, fileName){
    url = encodeURI(url);
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      // headers: { 'token':  getToken() }
    }).then((res) => {
      if(res.data.size<=0) {
        Message.error("文件不存在");
        return false;
      }
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob,fileName)
      
      } else {
        Message.error("文件不存在");
        this.printErrMsg(res.data);
      }
    }).catch(()=>{
      Message.error("文件不存在");
    }).finally(()=>{

    }) 

    // function getBlob(url) {
    //   return new Promise(resolve => {
    //     const XML = new XMLHttpRequest()
    //     XML.open('GET', url, true)
    //     XML.responseType = 'blob'
    //     XML.onload = () => {
    //       if (XML.status == 200) {
    //         resolve(XML.response)
    //       }
    //     }
    //     XML.send()
    //   })
    // }

    // function saveAsTwo (blob, fileName) {
    //   const elelink = document.createElement("a")
    //   elelink.style.display = "none"
    //   elelink.download = fileName
    //   elelink.href = window.URL.createObjectURL(blob)
    //   document.body.appendChild(elelink)
    //   elelink.click()
    //   document.body.removeChild(elelink)
    // }

    // getBlob(url).then(blob => {
    //   saveAsTwo(blob, fileName)
    // })
  },
  isExistFile(filepath, filename) {
    if(filepath==null || filename==null || filepath==='' || filename==='') {
      return false;
    }
    var url = window._gconf.urlFilePrefix + '/common/fileExist?path=' + filepath + "&name=" + filename; 
    url = encodeURI(url);
    return  axios({
      method: 'get',
      url: url,
      headers: { 'token':  getToken() }
    }).then((res) => {
      if(res.data!==true) {
        Message.error(filename+"文件不存在");
        // resolve(false)
        return false;
      }
      // resolve(true)
      return true;
    }).catch(()=>{
      Message.error(filename+"文件不存在");
      // resolve(false)
      return false;
    
    }).finally(()=>{

    })  
  }
}


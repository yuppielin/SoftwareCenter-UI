

/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

import { isArray } from "./validate"

// 日期格式化
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      } else if (typeof time === 'string') {
        time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  }
  
  // 表单重置
  export function resetForm(refName) {
    if (this.$refs[refName]) {
      this.$refs[refName].resetFields();
    }
  }
  
  // 添加日期范围
  export function addDateRange(params, dateRange, propName) {
    let search = params;
    search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof (propName) === 'undefined') {
      search.params['beginTime'] = dateRange[0];
      search.params['endTime'] = dateRange[1];
    } else {
      search.params['begin' + propName] = dateRange[0];
      search.params['end' + propName] = dateRange[1];
    }
    return search;
  }
  
  // 回显数据字典
  export function selectDictLabel(datas, value) {
    if (value === undefined) {
      return "";
    }
    var actions = [];
    Object.keys(datas).some((key) => {
      if (datas[key].value == ('' + value)) {
        actions.push(datas[key].label);
        return true;
      }
    })
    if (actions.length === 0) {
      actions.push(value);
    }
    return actions.join('');
  }
  
  // 回显数据字典（字符串、数组）
  // export function selectDictLabels(datas, value, separator) {
  //   if (value === undefined || value.length ===0) {
  //     return "";
  //   }
  //   if (Array.isArray(value)) {
  //     value = value.join(",");
  //   }
  //   var actions = [];
  //   var currentSeparator = undefined === separator ? "," : separator;
  //   var temp = value.split(currentSeparator);
  //   Object.keys(value.split(currentSeparator)).some((val) => {
  //     var match = false;
  //     Object.keys(datas).some((key) => {
  //       if (datas[key].value == ('' + temp[val])) {
  //         actions.push(datas[key].label + currentSeparator);
  //         match = true;
  //       }
  //     })
  //     if (!match) {
  //       actions.push(temp[val] + currentSeparator);
  //     }
  //   })
  //   return actions.join('').substring(0, actions.join('').length - 1);
  // }

    
  // 回显数据字典（字符串、数组）
export function selectDictLabels(datas, value,itemVal,itemName, separator) {
    datas = selectChild(datas);
    if (value === undefined || value==null || value.length ===0) {
      return "";
    }
    value = value+"";
    if (itemVal === undefined ) {
      itemVal = "id";
    }
    if (itemName === undefined ) {
      itemName = "name";
    }
    if (Array.isArray(value)) {
      value = value.join(",");
    }
    var actions = [];
    var currentSeparator = undefined === separator ? "," : separator;
    var temp = value.split(currentSeparator);
    Object.keys(value.split(currentSeparator)).forEach((val) => {
      var match = false;
      Object.keys(datas).forEach((key) => {
        if (datas[key][itemVal] == ('' + temp[val])) {
          actions.push(datas[key][itemName] + currentSeparator);
          match = true;
        }
      })
      if (!match) {
        actions.push(temp[val] + currentSeparator);
      }
    })
    return actions.join('').substring(0, actions.join('').length - 1);
  }
  function selectChild(datas , arr=[]) {
   
    Object.keys(datas).forEach((key) => {
      arr.push(datas[key]);
      if (datas[key].children!=undefined) {
        selectChild(datas[key].children, arr);
      }
    })
    return arr;
  }
  
  // 字符串格式化(%s )
  export function sprintf(str) {
    var args = arguments, flag = true, i = 1;
    str = str.replace(/%s/g, function () {
      var arg = args[i++];
      if (typeof arg === 'undefined') {
        flag = false;
        return '';
      }
      return arg;
    });
    return flag ? str : '';
  }
  
  // 转换字符串，undefined,null等转化为""
  export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
      return "";
    }
    return str;
  }
  
  // 数据合并
  export function mergeRecursive(source, target) {
    for (var p in target) {
      try {
        if (target[p].constructor == Object) {
          source[p] = mergeRecursive(source[p], target[p]);
        } else {
          source[p] = target[p];
        }
      } catch (e) {
        source[p] = target[p];
      }
    }
    return source;
  };
  
  /**
   * 构造树型结构数据
   * @param {*} data 数据源
   * @param {*} id id字段 默认 'id'
   * @param {*} parentId 父节点字段 默认 'parentId'
   * @param {*} children 孩子节点字段 默认 'children'
   */
  export function handleTree(data, id, parentId, children) {
    let config = {
      id: id || 'id',
      parentId: parentId || 'parentId',
      childrenList: children || 'children'
    };
  
    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];
  
    for (let d of data) {
      let parentId = d[config.parentId];
      if (childrenListMap[parentId] == null) {
        childrenListMap[parentId] = [];
      }
      nodeIds[d[config.id]] = d;
      childrenListMap[parentId].push(d);
    }
  
    for (let d of data) {
      let parentId = d[config.parentId];
      if (nodeIds[parentId] == null) {
        tree.push(d);
      }
    }
  
    for (let t of tree) {
      adaptToChildrenList(t);
    }
  
    function adaptToChildrenList(o) {
      if (childrenListMap[o[config.id]] !== null) {
        o[config.childrenList] = childrenListMap[o[config.id]];
      }
      if (o[config.childrenList]) {
        for (let c of o[config.childrenList]) {
          adaptToChildrenList(c);
        }
      }
    }
    return tree;
  }
  
  /**
  * 参数处理
  * @param {*} params  参数
  */
  export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && value !== "" && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
              let params = propName + '[' + key + ']';
              var subPart = encodeURIComponent(params) + "=";
              result += subPart + encodeURIComponent(value[key]) + "&";
            }
          }
        } else {
          result += part + encodeURIComponent(value) + "&";
        }
      }
    }
    return result
  }
  
  // 验证是否为blob格式
  export function blobValidate(data) {
    return data.type !== 'application/json'
  }

  // 格式化文件大小
  export function formatFileSize(size) {
    if (size < 1024) {
      return size + 'b'
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + 'Kb'
    } else {
      return (size / 1024 / 1024).toFixed(2) + 'Mb'
    }
  }

  export function fileIcon(path) {
    let type = path.substr(path.lastIndexOf("."), path.length);
    let url = null;
    switch (type) {
      case ".ppt":
        url = require("@/assets/file_icon/ppt.png");
        break;
      case ".docx":
      case ".doc":
        url = require("@/assets/file_icon/doc.png");
        break;
      case ".xls":
      case ".xlsx":
        url = require("@/assets/file_icon/xls.png");
        break;
      case ".md":
        url = require("@/assets/file_icon/md.png");
        break;
      case ".pdf":
        url = require("@/assets/file_icon/pdf.png");
        break;
      case ".mp4":
        url = require("@/assets/file_icon/mp4.png");
        break;
      case ".mp3":
        url = require("@/assets/file_icon/mp3.png");
        break;
      case ".jpg":
        url = require("@/assets/file_icon/jpg.png");
        break;
      case ".png":
        url = require("@/assets/file_icon/png.png");
        break;  
      case ".zip":
      case ".tar":
      case ".rar":
        url = require("@/assets/file_icon/zip.png");
        break;  
      default:
        url = require("@/assets/file_icon/othe.png");
        break;
    }
    return url;
  }

  function getSonArr(options, item='id') {
    return flattenOptions(options, item)
    function flattenOptions(options, item) {
      let result = [];
      for(const option of options) {
        result.push(option[item]);
        if(option.children && option.children.length > 0) {
          result = result.concat(flattenOptions(option.children, item))
        }
      }
      return result;
    }
  }

  function getComeArr(arr1, arr2) {
    return arr1.filter(item => arr2.includes(item));
  }

  export function getComeArrWithChild(arr1, arr2) {
    if(!isArray(arr1)) {
      arr1 = [arr1]
    }
    let arrs = getSonArr(arr2);
    let com = getComeArr(arr1, arrs);
    // arr1 = com;
    return com;
  }


    // 使el-select 失去焦点并隐藏
    export function closeOptions(refName) {
      if (this.$refs[refName]) {
        let timer = setTimeout(()=> {
          this.$refs[refName].blur();
          clearTimeout(timer);
        },100)
      }
    }
    
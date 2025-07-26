import request from '@/utils/request'

export function getDemand(demandId) {
  return request({
    url: '/software/demand/',
    method: 'get',
    params:{
      demandId:demandId
    }
  })
}
export function getSoftwareDemand(softwareId, versionId, pageNum, pageSize) {
  return request({
    url: '/software/demand/queryBySoftware',
    method: 'get',
    params: { softwareId, versionId, pageNum, pageSize }
  })
}
export function getDemandQuery(uid,keyword,status,pageNum,pageSize,zbStatus,category) {
  return request({
    url: '/software/demand/query',
    method: 'get',
    params:{
      uid:uid,
      keyword:keyword,
      status:status,
      pageNum:pageNum,
      pageSize: pageSize,
      zbStatus:zbStatus,
      category:category
    }
  })
}

export function getSupportAnswer(param) {
  return request({
    url: '/software/demand/queryAnswerPageByDemandId',
    method: 'get',
    params: {
      demandId:param.demandId,
      pageNum:param.pageNum,
      pageSize:param.pageSize,
    }
  })
}

export function addDemand(data) {
  return request({
    url: '/software/demand/',
    method: 'post',
    data
  })
}

export function importDemand(data) {
  return request({
    url: '/software/demand/import',
    method: 'post',
    data
  })
}

export function deleteDemand(demandIds) {
  return request({
    url: '/software/demand/',
    method: 'delete',
    params:{
      demandIds:demandIds
    }
  })
}

// export function exportDemand() {
//   return request({
//     url: '/software/demand/export',
//     method: 'get',
//   })
// }
export function exportDemand(uid, keyword, status, zb_status) {
  return request({
    url: '/software/demand/export',
    method: 'get',
    responseType: 'arraybuffer',
    params:{
      uid:uid,
      keyword:keyword,
      status:status,
      zb_status:zb_status
    }
  })
  // return config.url + process.env.VUE_APP_BASE_API + '/software/demand/export'
}

export function addAnswer(data) {
  return request({
    url: '/software/demand-reply/',
    method: 'post',
    data
  })
}

export function addAnswerByFile(files) {
  return request({
    url: '/software/demand-reply/byFile',
    method: 'post',
    data:files
  })
}

export function downloadTemplate() {
  return request({
    url: '/software/demand/downloadDemandTemplate',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function finishDemand(demandId, uid)  {
  return request({
    url: '/software/demand/finishDemand',
    method: 'post',
    params:{
      demandId:demandId,
      uid:uid
    }
  })
}

//判断当前用户是否关注过该需求
export function isCollectDemand(demandId, uid)  {
  return request({
    url: '/software/demand/isCollect',
    method: 'get',
    params:{
      demandId:demandId,
      uid:uid
    }
  })
}

export function collectDemand(demandId, uid)  {
  return request({
    url: '/software/demand/collect',
    method: 'post',
    params:{
      demandId:demandId,
      uid:uid
    }
  })
}

export function cancelCollectDemand(demandId, uid)  {
  return request({
    url: '/software/demand/cancelCollection',
    method: 'post',
    params:{
      demandId:demandId,
      uid:uid
    }
  })
}

export function queryCollectDemand(uid, pageNum, pageSize) {
  return request({
    url: '/software/demand/queryCollect',
    method: 'get',
    params: {
      uid: uid,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function rejectDemand(demandId, uid, reason)  {
  return request({
    url: '/software/demand/rejectDemand',
    method: 'post',
    params:{
      demandId:demandId,
      uid:uid,
      reason: reason
    }
  })
}

export function deleteDemandReply(reply_id) {
  return request({
    url: '/software/demand/delReply',
    method: 'delete',
    params:{
      reply_id:reply_id
    }
  })
}

export function queryBySoftwareUid(uid, keyword, status, pageNum, pageSize, zbStatus, category) {
  return request({
    url: '/software/demand/queryBySoftwareUid',
    method: 'get',
    params:{
      uid:uid,
      keyword:keyword,
      status:status,
      pageNum:pageNum,
      pageSize:pageSize,
      zbStatus:zbStatus,
      category:category
     }
  })
}

export function queryBySoftwareList(keyword, status, pageNum, pageSize, zbStatus, category) {
  return request({
    url: '/software/demand/queryBySoftwareList',
    method: 'get',
    params:{
      keyword:keyword,
      status:status,
      pageNum:pageNum,
      pageSize:pageSize,
      zbStatus:zbStatus,
      category:category
     }
  })
}

export function cfDemand(data) {
  return request({
    url: '/software/demand/split',
    method: 'post',
    data
  })
}

// 获取需求统计概览数据
export function getDemandStatisticsOverview() {
  return request({
    url: '/software/demand/statistics/overview',
    method: 'get'
  })
}

// 获取需求统计趋势数据
export function getDemandStatisticsTrend(startDate, endDate) {
  return request({
    url: '/software/demand/statistics/trend',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

// 获取反馈类型占比数据
export function getDemandStatisticsByType(startDate, endDate) {
  return request({
    url: '/software/demand/statistics/type',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

// 获取反馈状态占比数据
export function getDemandStatisticsByStatus(startDate, endDate) {
  return request({
    url: '/software/demand/statistics/status',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

/**
 * 获取数据分析报告
 * @param {string} startDate 开始日期，格式为 yyyy-MM-dd
 * @param {string} endDate 结束日期，格式为 yyyy-MM-dd
 * @returns {Promise} 返回数据分析报告
 */
export function getDemandReport(startDate, endDate) {
  return request({
    url: '/software/demand/getReport',
    method: 'get',
    header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
    responseType: "blob",
    params: {
      startDate,
      endDate
    }
  })
}
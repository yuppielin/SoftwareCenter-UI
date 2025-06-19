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
export function getDemandQuery(uid,keyword,status,pageNum,pageSize,zbStatus) {
  return request({
    url: '/software/demand/query',
    method: 'get',
    params:{
      uid:uid,
      keyword:keyword,
      status:status,
      pageNum:pageNum,
      pageSize: pageSize,
      zbStatus:zbStatus
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

export function queryBySoftwareUid(uid, keyword, status, pageNum, pageSize, zbStatus) {
  return request({
    url: '/software/demand/queryBySoftwareUid',
    method: 'get',
    params:{
      uid:uid,
      keyword:keyword,
      status:status,
      pageNum:pageNum,
      pageSize:pageSize,
      zbStatus:zbStatus
     }
  })
}

export function queryBySoftwareList(keyword, status, pageNum, pageSize, zbStatus) {
  return request({
    url: '/software/demand/queryBySoftwareList',
    method: 'get',
    params:{
      keyword:keyword,
      status:status,
      pageNum:pageNum,
      pageSize:pageSize,
      zbStatus:zbStatus
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
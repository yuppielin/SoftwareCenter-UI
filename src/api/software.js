import request  from '@/utils/request'
import {download}  from '@/utils/request'
import { getToken, setToken } from '@/utils/auth'

export function getStatisticInfoByRole() {
  return request({
    url: '/software/state/statistic',
    method: 'get'
  })
}

export function getSoftwareList(params) {
  return request({
    url: '/software/list',
    method: 'get',
    params: params
  })
}

export function getFrontSoftwareList(keyword,type,size) {
  return request({
    url: '/software/front',
    method: 'get',
    params: {
      keyword:keyword,
      type:type,
      size:size
    }
  })
}

export function getSoftwareDevUnit() {
  return request({
    url: '/software/dev/unit',
    method: 'get'
  })
}

export function getSoftwareOfferUnit() {
  return request({
    url: '/software/offer/unit',
    method: 'get'
  })
}

export function getLatestSoftwareList(userId) {
  return request({
    url: '/software/latest',
    method: 'get',
    params: { userId }
  })
}

export function getHotSoftwareList(userId) {
  return request({
    url: '/software/hot',
    method: 'get',
    params: { userId }
  })
}

export function getRecommendSoftwareList(token) {
  return request({
    url: '/software/recommend',
    method: 'get',
    params: { token }
  })
}

export function getSoftwareListByStatus(userId, status, pageNum, pageSize) {
  return request({
    url: '/software/query',
    method: 'get',
    params: { userId, status, pageNum, pageSize }
  })
}
export function getDependencySoftwareList(userId, owner, pageNum, pageSize) {
  return request({
    url: '/software/query',
    method: 'get',
    params: { userId, owner, pageNum, pageSize }
  })
}

export function getSoftwareListByUser(name, queryStr, userId) {
  return request({
    url: '/software/query',
    method: 'get',
    params: { name, queryStr, userId }
  })
}

export function getSoftwareListBySpecial(specialId, userId, queryStr, pageNum, pageSize) {
  return request({
    url: '/software/special/query',
    method: 'get',
    params: { specialId, userId, queryStr, pageNum, pageSize }
  })
}

export function getSoftwareListByCategory(userId, type,categoryId, queryStr, owner, status, pageNum, pageSize) {
  return request({
    url: '/software/query',
    method: 'get',
    params: { userId, type,categoryId, queryStr, owner, status, pageNum, pageSize }
  })
}

export function getSoftwareListByCategoryAndUnit(userId, categoryId, queryStr, owner, status, devUnit, offerUnit, pageNum, pageSize) {
  return request({
    url: '/software/query',
    method: 'get',
    params: { userId, categoryId, queryStr, owner, status, devUnit, offerUnit, pageNum, pageSize }
  })
}

export function getSoftwareInfo(id, version, userId) {
  return request({
    url: '/software/info',
    method: 'get',
    params: { id, version, userId }
  })
}

export function getSoftwarePermission(softwareId, versionId) {
  return request({
    url: '/software/getPermission',
    method: 'get',
    params: { softwareId, versionId }
  })
}

export function getSoftwareVersionInfo(softwareId, softwareVersion) {
  return request({
    url: '/software/version/info',
    method: 'get',
    params: { softwareId, softwareVersion }
  })
}

export function getSoftwareSet(type) {
  return request({
    url: '/software/set/',
    method: 'get',
    params: { type }
  })
}

export function getSoftwareType() {
  return request({
    url: '/software/set/type',
    method: 'get'
  })
}

export function getSoftwareTypeCascader(id) {
  return request({
    url: '/software/type',
    method: 'get',
    params: { id }
  })
}

export function addSoftware(data) {
  return request({
    url: '/software/',
    method: 'post',
    data
  })
}
export function updateSoftwareRight(data) {
  return request({
    url: '/software/version/',
    method: 'put',
    data
  })
}
export function getSoftwareDataOne(versionId) {
  return request({
    url: '/software/data/id',
    method: 'get',
    params: { versionId }
  })
}
export function updateSoftwareData(data) {
  return request({
    url: '/software/data/',
    method: 'put',
    data
  })
}
export function deleteSoftwareData(softwareDataId) {
  return request({
    url: '/software/data/',
    method: 'delete',
    params: { softwareDataId }
  })
}
export function parseSoftware(data) {
  return request({
    url: '/software/fragment/parse',
    method: 'post',
    data
  })
}
export function addSoftwareData(data) {
  return request({
    url: '/software/data/',
    method: 'post',
    data
  })
}

export function getSoftwareDataList(softwareId, softwareVersion) {
  return request({
    url: '/software/data/',
    method: 'get',
    params: { softwareId, softwareVersion }
  })
}
export function getSoftwareDataListByUser(uid, status, pageNum, pageSize) {
  return request({
    url: '/software/data/list',
    method: 'get',
    params: { uid, status, pageNum, pageSize }
  })
}

export function querySoftwareDataListByUser(uid, status, query, categoryId, pageNum, pageSize) {
  return request({
    url: '/software/data/list',
    method: 'get',
    params: { uid, status, query, categoryId, pageNum, pageSize }
  })
}

export function getSoftwareDataListBySoftware(status, versionId) {
  return request({
    url: '/software/data/list',
    method: 'get',
    params: { status, versionId }
  })
}

export function searchSoftwareList(type, queryStr, status, pageNum, pageSize) {
  return request({
    url: '/software/query',
    method: 'get',
    params: { type, queryStr, status, pageNum, pageSize }
  })
}

export function auditSoftwareDataUpload(data) {
  return request({
    url: '/software/data/audit',
    method: 'post',
    data
  })
}

export function addSoftwareVersion(data) {
  return request({
    url: '/software/version/',
    method: 'post',
    data
  })
}

export function updateSoftware(data) {
  return request({
    url: '/software/version/',
    method: 'put',
    data
  })
}

export function upgradeSoftwareVersion(data) {
  return request({
    url: '/software/version/upgrade',
    method: 'post',
    data
  })
}

export function uploadSoftwareBatchTask(data) {
  return request({
    url: '/software/batch',
    method: 'post',
    data
  })
}

export function downloadSoftwareData(userId, dataId) {
  return request({
    url: '/download/file/',
    method: 'get',
    // responseType: 'arraybuffer',
    responseType: 'blob',
    header: { 'Content-Type': 'application/json; charset=UTF-8' },
    params: { userId, dataId }
  })
}

export function downloadSoftware(userId, versionId) {
  return request({
    url: '/download/software',
    method: 'get',
    params: { userId, versionId }
  })
}

export function downloadSoftwareFile(userId, versionId, isIframe=0) {
  return download(
    '/download/softwareFile'+'?userId='+userId+"&versionId="+versionId, isIframe
  )
  return request({
    url: '/download/softwareFile',
    method: 'get',
    responseType: 'blob',
    params: { userId, versionId }
  })
  .then((blob)=> {
    const elelink = document.createElement("a")
    elelink.style.display = "none"
    // elelink.download = fileName
    elelink.href = window.URL.createObjectURL(blob)
    document.body.appendChild(elelink)
    elelink.click()
    document.body.removeChild(elelink)
  })
}
export function downloadSoftwareFileUrl(userId, versionId) {
  let url = '/download/softwareFile'+'?userId='+userId+"&versionId="+versionId;
  return  window._gconf.urlFilePrefix +url+"&token="+getToken()
}

export function downloadSoftwareVolumeFile(userId, versionId, volumeId,isIframe=1) {
  return download(
    '/download/softwareVolumeFile'+'?userId='+userId+"&versionId="+versionId+"&volumeId="+volumeId, isIframe
  )
}

export function downloadSoftwareVolumeFileUrl(userId, versionId, volumeId) {
  let url = '/download/softwareVolumeFile'+'?userId='+userId+"&versionId="+versionId+"&volumeId="+volumeId;
  return  window._gconf.urlFilePrefix +url+"&token="+getToken()
}

export function downloadSoftwareBatch(data) {
  return request({
    url: '/download/software/batch',
    method: 'post',
    responseType: 'blob',
    header: { 'Content-Type': 'application/json; charset=UTF-8' },
    data
  })
}

export function downloadSoftwareDataBatch(userId, versionId) {
  return request({
    url: '/download/data/batch',
    method: 'post',
    responseType: 'blob',
    header: { 'Content-Type': 'application/json; charset=UTF-8' },
    params: { userId, versionId }
  })
}

export function downloadSoftwareApply(softwareVersionId, uid, uname) {
  return request({
    url: '/download/apply',
    method: 'post',
    params: { softwareVersionId, uid, uname }
  })
}

export function getDownloadSoftwareApplyList(params) {
  return request({
    url: '/download/apply/audit',
    method: 'get',
    params: params
  })
}

export function getDownloadSoftwareApplyData(applyId) {
  return request({
    url: '/download/apply/info',
    method: 'get',
    params: {id: applyId}
  })
}

export function getDownloadList(userId, pageNum, pageSize) {
  return request({
    url: '/download/list',
    method: 'get',
    params: { status, userId, pageNum, pageSize }
  })
}
export function downloadSoftwareApplyAudit(data) {
  return request({
    url: '/download/apply/audit',
    method: 'post',
    // params: { id, status, opinion, uname }
    data:data
  })
}

export function auditMore(data) {
  return request({
    url: '/download/apply/auditMore',
    method: 'post',
    data: data
  })
}

export function deleteDownloadSoftwareApply(id) {
  return request({
    url: '/download/apply',
    method: 'delete',
    params: { id }
  })
}

export function deleteSoftwareVersion(id) {
  return request({
    url: '/software/version/',
    method: 'delete',
    params: { id }
  })
}

export function addSearchRecord(keyword, userId) {
  return request({
    url: '/software/search/record',
    method: 'post',
    params: { keyword, userId }
  })
}

export function getSearchRecord(userId, size) {
  return request({
    url: '/software/search/record',
    method: 'get',
    params: { userId, size }
  })
}

export function bakSoftware(id) {
  return request({
    url: '/software/version/bak',
    method: 'post',
    params: { id }
  })
}

export function getSoftwareDependency(softwareId) {
  return request({
    url: '/software/dependence',
    method: 'get',
    params: { softwareId }
  })
}
export function getSoftwarePollList() {
  return request({
    url: '/software/poll',
    method: 'get'
  })
}
export function addSoftwarePollList(data) {
  return request({
    url: '/software/poll',
    method: 'post',
    data
  })
}
export function updateSoftwareScore(softwareId, userId, score) {
  return request({
    url: '/software/score',
    method: 'post',
    params: { softwareId, userId, score }
  })
}

export function getSoftwareDeployList(deployId) {
  return request({
    url: '/software/version/service/deploy/list',
    method: 'get',
    params: { deployId }
  })
}

export function uploadSoftwareBatch(data) {
  return request({
    url: '/software/upload/batch',
    method: 'post',
    data
  })
}

export function getAllSoftwareList() {
  return request({
    url: '/software/simple/list',
    method: 'get',
    params: {}
  })
}

export function getSoftwareVersionList(softwareId) {
  return request({
    url: '/software/version/list',
    method: 'get',
    params: { softwareId }
  })
}

export function addSoftwareBatch(data) {
  return request({
    url: '/software/version/batch',
    method: 'post',
    data
  })
}

export function getSoftwareDetailTypeList(versionId) {
  return request({
    url: '/software/detail/listTypeData',
    method: 'get',
    params: { versionId}
  })
}

export function uploadSoftwareData(data) {
  return request({
    url: '/software/data/saveList',
    method: 'post',
    data
  })
}

export function getAllSoftware() {
  return request({
    url: '/software/data/getAllSoftware',
    method: 'get',
  })
}

export function getSoftwareVersion(softwareId) {
  return request({
    url: '/software/data/getSoftwareVersion',
    method: 'get',
    params: {
      softwareId:softwareId
    }
  })
}

export function downloadListTemplate() {
  return request({
    url: '/software/downloadListTemplate',
    method: 'get',
    responseType: 'blob',
    header: { 'Content-Type': 'application/json; charset=UTF-8' }
  })
}

export function importDownloadList(data) {
  return request ({
    url: '/software/importDownloadList',
    method: 'post',
    data
  })
}

export function uploadMore(data) {
  return request({
    url: '/software/data/uploadMore',
    method: 'post',
    data
  })
}

// 批量审核通过资料
export function batchPassDataMore(dataIds) {
  return request({
    url: '/software/data/passDataMore',
    method: 'post',
    params: {
      dataIds: dataIds
    }
  })
}

// 批量审核拒绝资料
export function batchRejectDataMore(dataIds, opinion) {
  return request({
    url: '/software/data/rejectDataMore',
    method: 'post',
    params: {
      dataIds: dataIds,
      opinion: opinion
    }
  })
}

//展示非软件关联资料
export function listDataByNoSoftware(uid, status, query, categoryId, pageNum, pageSize) {
  return request({
    url: '/software/data/listDataByNoSoftware',
    method: 'get',
    params: { uid, status, query, categoryId, pageNum, pageSize }
  })
}


//展示非软件关联资料-根据可浏览权限
export function listDataByView(params) {
  return request({
    url: '/software/data/listDataByView',
    method: 'get',
    params
  })
}


//获取服务器内存存储信息
export function getServerInfo() {
  return request({
    url: '/server/getInfo',
    method: 'get',
  })
}

//获取软件依赖关系
export function getSoftwareRelation(versionId) {
  return request({
    url: '/software/getSoftwareRelation',
    method: 'get',
    params: {
      versionId: versionId,
    }
  })
}


export function docusignValidate(data, progress) {
  return request({
    url: '/softwareDigtalSignature/docusignValidate',
    method: 'post',
    header: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress:progress,
    data: data
  })
}

export function docusignDownload(id, type) {
  // return request({
  //   url: '/softwareDigtalSignature/docusignDownload',
  //   method: 'get',
  //   params: {id,type}
  // })
  let url = '/softwareDigtalSignature/docusignDownload'+'?id='+id+"&type="+type;
  // return  window._gconf.urlFilePrefix +url+"&token="+getToken()
  return download(
    url
  )
}

export function reviewSoftware(versionId, softwareId, comment, status) {
  return request({
    url: '/software/review',
    method: 'post',
    params: {
      versionId: versionId,
      softwareId: softwareId,
      comment: comment,
      status: status
    }
  })
}
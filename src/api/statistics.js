import request from '@/utils/request'

export function getSoftwareStat() {
  return request({
    url: '/software/statistic/count',
    method: 'get'
  })
}

export function getSoftwareStatByPlatform(startTime, endTime) {
  return request({
    url: '/software/statistic/platform',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getSoftwareStatByAttribute(startTime, endTime) {
  return request({
    url: '/software/statistic/attribute',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getSoftwareStatByCategory(startTime, endTime) {
  return request({
    url: '/software/statistic/category',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getSoftwareStatByType() {
  return request({
    url: '/software/statistic/type',
    method: 'get'
  })
}
export function getSoftwareStatByStatus() {
  return request({
    url: '/software/statistic/status',
    method: 'get'
  })
}
export function getSoftwareUploadStatByCategory(startTime, endTime) {
  return request({
    url: '/software/statistic/category/upload',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getSoftwareUploadStatByDevUnit(startTime, endTime) {
  return request({
    url: '/software/statistic/dev/unit/upload',
    method: 'get',
    params: { startTime, endTime }
  })
}

export function getSoftwareQuestionStatByDate(startTime, endTime) {
  return request({
    url: '/software/statistic/question',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getSoftwareQuestionStatByCategory(startTime, endTime) {
  return request({
    url: '/software/statistic/question/category',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getQuestionStaticticsType(startTime, endTime) {
  return request({
    url: '/software/statistic/question/type',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getSoftwareUploadStatByDate(startTime, endTime) {
  return request({
    url: '/software/statistic/upload',
    method: 'get',
    params: { startTime, endTime }
  })
}
export function getUploadStaticticsType(startTime, endTime) {
  return request({
    url: '/software/statistic/upload/type',
    method: 'get',
    params: { startTime, endTime }
  })
}

export function getSoftwareScoreStatistics() {
  return request({
    url: '/software/statistic/score',
    method: 'get'
  })
}

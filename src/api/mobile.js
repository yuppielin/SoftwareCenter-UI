import request from '@/utils/request'

export function getSpecialList(query, pageNum, pageSize) {
  return request({
    url: '/m/app/special',
    method: 'get',
    params: { query, pageNum, pageSize }
  })
}

export function getSoftwareListBySpecial(specialId, userId, queryStr, pageNum, pageSize) {
  return request({
    url: '/m/app/software/special/query',
    method: 'get',
    params: { specialId, userId, queryStr, pageNum, pageSize }
  })
}

export function downloadSoftware(userId, versionId) {
  return request({
    url: '/m/app/download/software',
    method: 'get',
    params: { userId, versionId }
  })
}
export function getSoftwareInfo(id, version) {
  return request({
    url: '/m/app/software/info',
    method: 'get',
    params: { id, version }
  })
}

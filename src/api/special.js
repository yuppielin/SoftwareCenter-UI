import request from '@/utils/request'

export function getSpecialList(query, pageNum, pageSize) {
  return request({
    url: '/special',
    method: 'get',
    params: { query, pageNum, pageSize }
  })
}
export function getSpecialInfo(specialId) {
  return request({
    url: '/special/info',
    method: 'get',
    params: { specialId }
  })
}
export function addSpecial(data) {
  return request({
    url: '/special',
    method: 'post',
    data
  })
}
export function updateSpecial(data) {
  return request({
    url: '/special',
    method: 'put',
    data
  })
}
export function deleteSpecial(id) {
  return request({
    url: '/special',
    method: 'delete',
    params: { id }
  })
}

export function addSpecialSoftware(specialId, softwareIds) {
  return request({
    url: '/special/software',
    method: 'post',
    params: { specialId, softwareIds }
  })
}
export function deleteSpecialSoftware(specialId, softwareId) {
  return request({
    url: '/special/software',
    method: 'delete',
    params: { specialId, softwareId }
  })
}

import request from '@/utils/request'
export function addUnit(data) {
  return request({
    url: '/dev-unit/',
    method: 'post',
    data
  })
}
export function updateUnit(data) {
    return request({
      url: '/dev-unit/',
      method: 'put',
      data
    })
}
export function delUnit(id) {
    return request({
      url: '/dev-unit/',
      method: 'delete',
      params: { id }
    })
}
export function getUnit(name,pageNum,pageSize) {
    return request({
      url: '/dev-unit/',
      method: 'get',
      params: {
         keyword:name,
         pageNum:pageNum,
         pageSize:pageSize
      }
    })
}

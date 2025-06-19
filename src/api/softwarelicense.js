import request from '@/utils/request'

// 获取授权列表
export function getLicenseList(query) {
  return request({
    url: '/license/list',
    method: 'get',
    params: query
  })
}

// 创建授权
export function createLicense(data) {
  return request({
    url: '/license/create',
    method: 'post',
    data
  })
}

// 更新授权
export function updateLicense(data) {
  return request({
    url: '/license/update',
    method: 'put',
    data
  })
}

// 删除授权
export function deleteLicense(id) {
    return request({
      url: '/license/delete',
      method: 'delete',
      params:{
        id:id
      }
    })
  }

// 修改授权状态
export function changeLicenseStatus(id, status) {
  return request({
    url: '/license/status',
    method: 'put',
    data: {
      id,
      status
    }
  })
}

// 下载授权文件
export function downloadLicenseFile(id) {
  return request({
    url: `/license/download/${id}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 校验授权文件
export function verifyLicenseFile(data) {
  return request({
    url: '/license/verify',
    method: 'post',
    data
  })
}

// 获取授权验证记录
export function getLicenseVerificationList(query) {
  return request({
    url: '/license/verification/list',
    method: 'get',
    params: query
  })
}

// 在线验证授权
export function verifyLicenseOnline(data) {
  return request({
    url: '/license/online',
    method: 'post',
    data
  })
}

// 导入授权文件
export function importLicenseFile(data) {
  return request({
    url: '/license/import',
    method: 'post',
    data
  })
}
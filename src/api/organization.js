import request from '@/utils/request'
export function getOrganization( name, pageNum, pageSize ) {
  return request({
    url: '/organization',
    method: 'get',
    params: { name, pageNum, pageSize }
  })
}
export function getSecurityOrganization() {
  return request({
    url: '/organization/getSecurity',
    method: 'get',
    // params: { name, pageNum, pageSize }
  })
}
export function addOrganization(data) {
  return request({
    url: '/organization',
    method: 'post',
    data
  })
}
export function updateOrganization(data) {
  return request({
    url: '/organization',
    method: 'put',
    data
  })
}
export function updateOrganizationSorts(data) {
  return request({
    url: '/organization/updateSorts',
    method: 'put',
    data
  })
}
export function deleteOrganization(id) {
  return request({
    url: '/organization',
    method: 'delete',
    params: { id }
  })
}
export function importOrganization(data) {
  return request({
    url: '/organization/import',
    method: 'post',
    data
  })
}
export function exportOrganization() {
  return request({
    url: '/organization/export',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

/**
 * 组织同步
 */
export function syncOrganization() {
  return request({
    url: '/organization/syncOrg',
    method: 'get',
  })
}

export function getUserByOrganization( organizationId, name, pageNum, pageSize ) {
  return request({
    url: '/organization/user',
    method: 'get',
    params: { organizationId, name, pageNum, pageSize }
  })
}
export function downloadOrganizationTemplate() {
  return request({
    url: '/organization/downloadTemplate',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

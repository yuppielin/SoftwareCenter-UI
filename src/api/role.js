import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/sys-role/routes',
    method: 'get'
  })
}

export function getRoles(keyword,status) {
  return request({
    url: '/sys-role/list',
    method: 'get',
    params:{
      keyword:keyword,
      status:status
    }
  })
}

export function addRole(data) {
  return request({
    url: '/sys-role/',
    method: 'post',
    data
  })
}

export function addRoleMenus(data) {
  return request({
    url: '/sys-role/addRoleMenus',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/sys-role/',
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/sys-role/${id}`,
    method: 'delete'
  })
}

export function getRole(id) {
  return request({
    url: `/sys-role/${id}`,
    method: 'get'
  })
}

export function changeStatus(id) {
  return request({
    url: '/sys-role/status',
    method: 'put',
    params:{id}
  })
}
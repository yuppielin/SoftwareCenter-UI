import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
export function getUserInfo(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

export function getUserServiceCodeUrl() {
  return request({
    url: '/user/service/getUserServiceCodeUrl',
    method: 'get'
  })
}


export function updateUserInfo(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function checked(data) {
  return request({
    url: '/user/checked',
    method: 'put',
    data
  })
}

export function checkToken(accessToken) {
  return request({
    url: '/user/service/user',
    method: 'post',
    params: { accessToken }
  })
}

export function getUserList() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserServiceToken(codeUrl) {
  return request({
    url: '/user/service/token',
    method: 'post',
    params: { codeUrl }
  })
}
export function getAllSoftwareSource(userId) {
  return request({
    url: '/software/source/list',
    method: 'get',
    params: { userId }
  })
}
export function getSystemSource(isNative, name) {
  return request({
    url: '/software/source/list',
    method: 'get',
    params: { isNative, name }
  })
}
export function getSourceUserList(sourceId, name, state, startDate, dueDate, pageNum, pageSize) {
  return request({
    url: '/software/source/user/list',
    method: 'get',
    params: { sourceId, name, state, startDate, dueDate, pageNum, pageSize }
  })
}
export function addSoftwareSource(data) {
  return request({
    url: '/software/source',
    method: 'post',
    data
  })
}
export function updateSoftwareSource(data) {
  return request({
    url: '/software/source',
    method: 'put',
    data
  })
}
export function deleteSoftwareSource(id) {
  return request({
    url: '/software/source',
    method: 'delete',
    params: { id }
  })
}
export function registerUser(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
//获取或查询审核用户
export function getReviewUser(type,keyword,pageNum,pageSize) {
  return request({
    url: '/user/review',
    method: 'get',
    params:{
      type:type,
      keyword:keyword,
      pageNum:pageNum,
      pageSize:pageSize,
    }
  })
}

export function addUser(data) {
  return request({
    url: '/user/',
    method: 'post',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: '/user',
    method: 'delete',
    params: { id }
  })
}
export function deleteUsers(ids) {
  return request({
    url: '/user/batch',
    method: 'delete',
    params: { ids }
  })
}
export function queryUsers(username, pageNum, pageSize, startTime, endTime) {
  return request({
    url: '/user/query',
    method: 'get',
    params: { username, pageNum, pageSize, startTime, endTime }
  })
}
export function queryUsers2(organizationId, username, pageNum, pageSize, startTime, endTime,status) {
  return request({
    url: '/user/query',
    method: 'get',
    params: { organizationId, username, pageNum, pageSize, startTime, endTime,status }
  })
}
export function editUserPassword(id, passPwd) {
  return request({
    url: '/user/pwd',
    method: 'put',
    params: { id, passPwd }
  })
}

export function getRouters() {
  return request({
    url: '/user/getRouters',
    method: 'get',
  })
}

export function unlock(data) {
  return request({
    url: '/user/unlock',
    method: 'post',
    params: data
  })
}

export function getCaptchaBase64() {
  let random = Math.random();
  return request({
    // url: '/getCaptchaImage?random='+random,
    url: '/getCaptchaImage/getCaptchaBase64?random='+random,
    method: 'get',
  })
}
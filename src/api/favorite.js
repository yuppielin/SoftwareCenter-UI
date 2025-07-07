import request from '@/utils/request'

// 关注软件
export function addFavorite(softwareId,versionId, userId) {
  return request({
    url: '/software-follow/follow',
    method: 'post',
    params: { softwareId, versionId, userId }
  })
}

// 取消关注
export function removeFavorite(softwareId,versionId, userId) {
  return request({
    url: '/software-follow/remove',
    method: 'post',
    params: { softwareId, versionId, userId }
  })
}

// 获取关注状态
export function getFavoriteStatus( versionId, userId) {
  return request({
    url: '/software-follow/status',
    method: 'get',
    params: {  versionId, userId }
  })
}

// 获取用户关注的软件列表
export function getUserFavorites(userId, pageNum, pageSize) {
  return request({
    url: '/software-follow/list',
    method: 'get',
    params: { userId, pageNum, pageSize }
  })
} 
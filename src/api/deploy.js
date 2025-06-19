import request from '@/utils/request'

export function getDeployScene() {
  return request({
    url: '/deploy/scene',
    method: 'get'
  })
}

export function getDeployService(sceneId) {
  return request({
    url: '/deploy/service',
    method: 'get',
    params: { sceneId }
  })
}

export function pushSoftware(id) {
  return request({
    url: '/software/version/send/service',
    method: 'post',
    params: { id }
  })
}

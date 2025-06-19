import request from '@/utils/request'

export function getSoftwareQuestionList(versionId, userId) {
  return request({
    url: '/software/question',
    method: 'get',
    params: { versionId, userId }
  })
}

export function addSoftwareQuestion(data) {
  return request({
    url: '/software/question',
    method: 'post',
    data
  })
}
export function deleteSoftwareQuestion(id, userId) {
  return request({
    url: '/software/question',
    method: 'delete',
    params: { id, userId }
  })
}
export function addSoftwareQuestionAnswer(data) {
  return request({
    url: '/software/question/answer',
    method: 'post',
    data
  })
}

export function getSoftwareQuestionListByUser(userId, flag, pageNum, pageSize) {
  return request({
    url: '/software/question/list',
    method: 'get',
    params: { userId, flag, pageNum, pageSize }
  })
}

import request from '@/utils/request'

// 查询系统消息记录列表
export function listSuggestion(query) {
  return request({
    url: '/system-suggestion/list',
    method: 'get',
    params: query
  })
}

// // 查询系统消息记录详细
// export function getSuggestion(noticeId) {
//   return request({
//     url: '/system-suggestion/' + noticeId,
//     method: 'get'
//   })
// }

// // 查询系统消息记录详细
// export function getSuggestionDetail(noticeId) {
//   return request({
//     url: '/system-suggestion/detail/' + noticeId,
//     method: 'get'
//   })
// }

// 新增系统消息记录
export function addSuggestion(data) {
  return request({
    url: '/system-suggestion',
    method: 'post',
    data: data
  })
}

// 回复系统消息记录
export function reply(data) {
  return request({
    url: '/system-suggestion/reply',
    method: 'post',
    data: data
  })
}



// // 修改系统消息记录
// export function updateSuggestion(data) {
//   return request({
//     url: '/system-suggestion',
//     method: 'put',
//     data: data
//   })
// }

// 删除系统消息记录
export function delSuggestion(noticeId) {
  return request({
    url: '/system-suggestion/' + noticeId,
    method: 'delete'
  })
}

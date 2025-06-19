import request from '@/utils/request'

// 查询系统消息记录列表
export function listSysMessages(query) {
  return request({
    url: '/sys-messages/list',
    method: 'get',
    params: query
  })
}

// 查询系统消息记录列表(包含读取信息)
export function listSysMessagesByUser(query) {
  return request({
    url: '/sys-messages/listByUser',
    method: 'get',
    params: query
  })
}

//设置为已读
export function read(data) {
  return request({
    url: '/sys-messages/read',
    method: 'post',
    data: data
  })
}

//设置全部为已读
export function readAll(data) {
  return request({
    url: '/sys-messages/readAll',
    method: 'post',
    data: data
  })
}

// 获取未读消息数量
export function messageReadCount(data) {
  return request({
    url: '/sys-messages/messageReadCount',
    method: 'get',
  })
}
// // 查询系统消息记录详细
// export function getSysMessages(noticeId) {
//   return request({
//     url: '/sys-messages/' + noticeId,
//     method: 'get'
//   })
// }

// // 查询系统消息记录详细
// export function getSysMessagesDetail(noticeId) {
//   return request({
//     url: '/sys-messages/detail/' + noticeId,
//     method: 'get'
//   })
// }

// // 新增系统消息记录
// export function addSysMessages(data) {
//   return request({
//     url: '/sys-messages',
//     method: 'post',
//     data: data
//   })
// }


// // 新增系统消息记录
// export function addTaskWithSoftware(data) {
//   return request({
//     url: '/sys-messages/addSoftware',
//     method: 'post',
//     data: data
//   })
// }

// // 修改系统消息记录
// export function updateSysMessages(data) {
//   return request({
//     url: '/sys-messages',
//     method: 'put',
//     data: data
//   })
// }

// // 删除系统消息记录
// export function delSysMessages(noticeId) {
//   return request({
//     url: '/sys-messages/' + noticeId,
//     method: 'delete'
//   })
// }


// 获取待审核数量
export  function getAuditNum(data) {
  return request({
    url: '/sys-messages/getAuditNum',
    method: 'get',
  })
}

import request from '@/utils/request'

// 查询任务审核记录列表
export function listSoftwareTaskRecord(query) {
  return request({
    url: '/software-task-record/list',
    method: 'get',
    params: query
  })
}

// 查询任务审核记录列表
export function listByTask(taskId) {
  return request({
    url: '/software-task-record/listByTask/'+ taskId,
    method: 'get'
  })
}

// // 查询任务审核记录详细
// export function getSoftwareTaskRecord(noticeId) {
//   return request({
//     url: '/software-task/' + noticeId,
//     method: 'get'
//   })
// }

// // 查询任务审核记录详细
// export function getSoftwareTaskRecordDetail(noticeId) {
//   return request({
//     url: '/software-task/detail/' + noticeId,
//     method: 'get'
//   })
// }

// // 新增任务审核记录
// export function addSoftwareTaskRecord(data) {
//   return request({
//     url: '/software-task',
//     method: 'post',
//     data: data
//   })
// }


// // 新增任务审核记录
// export function addTaskWithSoftware(data) {
//   return request({
//     url: '/software-task/addSoftware',
//     method: 'post',
//     data: data
//   })
// }

// // 修改任务审核记录
// export function updateSoftwareTaskRecord(data) {
//   return request({
//     url: '/software-task',
//     method: 'put',
//     data: data
//   })
// }

// // 删除任务审核记录
// export function delSoftwareTaskRecord(noticeId) {
//   return request({
//     url: '/software-task/' + noticeId,
//     method: 'delete'
//   })
// }

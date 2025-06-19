import request from '@/utils/request'

// 查询公告列表
export function listSoftwareTask(query) {
  return request({
    url: '/software-task/list',
    method: 'get',
    params: query
  })
}

export function listSoftwareTaskAll() {
  return request({
    url: '/software-task/list/all',
    method: 'get',
  })
}
// 查询公告列表
export function listSoftwareTaskByRole(query) {
  return request({
    url: '/software-task/listByRole',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getSoftwareTask(noticeId) {
  return request({
    url: '/software-task/' + noticeId,
    method: 'get'
  })
}

// 查询公告详细
export function getSoftwareTaskDetail(noticeId) {
  return request({
    url: '/software-task/detail/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addSoftwareTask(data) {
  return request({
    url: '/software-task',
    method: 'post',
    data: data
  })
}


// 新增公告
export function addTaskWithSoftware(data) {
  return request({
    url: '/software-task/addSoftware',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateSoftwareTask(data) {
  return request({
    url: '/software-task',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delSoftwareTask(noticeId) {
  return request({
    url: '/software-task/' + noticeId,
    method: 'delete'
  })
}

// 上传系统软件资料
export function uploadSoftwareData(data) {
  return request({
    url: '/software-task/addSoftwareData',
    method: 'post',
    data
  })
}

// 上传系统杀毒证明
export function addSoftwareAntivirus(data) {
  return request({
    url: '/software-task/addSoftwareAntivirus',
    method: 'post',
    data
  })
}

// 上传系统公告试用
export function addSoftwareApply(data) {
  return request({
    url: '/software-task/taskProcess',
    method: 'post',
    data
  })
}

// 保存公告修改
export function saveTaskNotice(data) {
  return request({
    url: '/software-task/saveTaskNotice',
    method: 'post',
    data
  })
}

// 部门主管审核
export function afTaskAudit(data) {
  return request({
    url: '/software-task/taskProcess',
    method: 'post',
    data
  })
}

// 审核状态上传
export function taskProcess(data) {
  return request({
    url: '/software-task/taskProcess',
    method: 'post',
    data
  })
}

// 下达安防检测任务
export function afTastPublishAudit(data) {
  return request({
    url: '/software-task/taskProcess',
    method: 'post',
    data
  })
}

//完成安防报告上传
export function afTaskFinshed(data) {
  return request({
    url: '/software-task/taskProcess',
    method: 'post',
    data
  })
}

//完成试用报告上传
export function syTaskFinshed(data) {
  return request({
    url: '/software-task/taskProcess',
    method: 'post',
    data
  })
}

//完成软件发布申请
export function publishApply(data) {
  return request({
    url: '/software-task/taskProcess',
    method: 'post',
    data
  })
}

//删除任务上传阶段软件
export function deleteUploadSoftware(data) {
  return request({
    url: '/software-task/deleteUploadSoftware',
    method: 'delete',
    data
  })
}

//删除任务上传阶段软件分卷
export function deleteUploadSoftwareVolumes(data) {
  return request({
    url: '/software-task/deleteUploadSoftwareVolumes',
    method: 'delete',
    data
  })
}

//未通过软件重传
export function updateUploadSoftware(data) {
  return request({
    url: '/software-task/updateUploadSoftware',
    method: 'put',
    data
  })
}
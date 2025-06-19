import request from '@/utils/request'

export function operlogList(pageNum,pageSize,operName,startTime,endTime,operIp,roles,requestType) {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params:{
      pageNum:pageNum,
      pageSize:pageSize,
      operName: operName,
      startTime: startTime,
      endTime: endTime,
      operIp: operIp,
      roles: roles,
      businessType:requestType,
    }
  })
}
export function operlogLoginList(pageNum,pageSize,userName,startTime,endTime) {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params:{
      pageNum:pageNum,
      pageSize: pageSize,
      userName: userName,
      startTime: startTime,
      endTime: endTime,
    }
  })
}

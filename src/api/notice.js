import request from '@/utils/request'

export function getNoticeList(uid,keyword,pageNum,pageSize) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: {
        uid,uid,
        keyword:keyword,
        pageNum:pageNum,
        pageSize:pageSize
    }
  })
}

export function getNotice(id) {
  return request({
    url: '/notice/one',
    method: 'get',
    params: { id }
  })
}


export function createNotice(data) {
  return request({
    url: '/notice/',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/notice/',
    method: 'put',
    data
  })
}

export function delNotice(id) {
    return request({
      url: '/notice/',
      method: 'delete',
      params: { id }
    })
  }

  export function changeNoticeStatus(id) {
    return request({
      url: '/notice/status',
      method: 'put',
      params: { 
          id:id,
      }
    })
  }

  export function setTop(id) {
    return request({
      url: '/notice/setTop',
      method: 'put',
      params: { 
          id:id,
      }
    })
  }

  export function uploadNoticeFile(data) {
    return request({
      url: '/notice/file',
      method: 'post',
      data
    })
  }

  export function downNoticeFile(id) {
    return request({
      url: '/notice/file',
      method: 'get',
      params:{id}
    })
  }

  export function delNoticeFile(id) {
    return request({
      url: '/notice/file',
      method: 'delete',
      params:{id}
    })
  }

  export function updateNoticeView(data) {
    return request({
      url: '/notice-view/',
      method: 'post',
      data
    })
  }
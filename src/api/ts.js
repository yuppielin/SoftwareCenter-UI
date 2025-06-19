import request from '@/utils/request'

export function getTsQuestion(uid,keyword,status,pageNum,pageSize) {
  return request({
    url: '/ts-question/',
    method: 'get',
    params:{
        uid:uid,
        keyword:keyword,
        status:status,
        pageNum:pageNum,
        pageSize:pageSize
    }
  })
}

export function getSoftwareTs(software_id, version_id, pageNum, pageSize) {
  return request({
    url: '/ts-question/queryBySoftware',
    method: 'get',
    params: { software_id, version_id, pageNum, pageSize }
  })
}

export function addTsQuestion(data) {
  return request({
    url: '/ts-question/',
    method: 'post',
    data
  })
}
export function finishTsQuestion(params) {
  return request({
    url: '/ts-question/finish',
    method: 'post',
    params
  })
}

export function delTsQuestion(id) {
  return request({
    url: '/ts-question/',
    method: 'delete',
    params:{id}
  })
}

// export function reply(tsQuestionId,content,cid,pid,files) {
export function reply(files) {
  return request({
    url: '/ts-question-answer/',
    method: 'post',
    // params: {
    //   tsQuestionId: tsQuestionId,
    //   description: content,
    //   cid: cid,
    //   pid: pid
    // },
    data:files
  })
}

export function getReply(pageNum,pageSize) {
  return request({
    url: '/ts-question/',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function getSupport(questionId) {
  return request({
    url: '/ts-question/queryQuestionByid',
    method: 'get',
    params: {
      questionId:questionId
    }
  })
}

export function getSupportAnswer(param) {
  return request({
    url: '/ts-question/queryQuestionAnswerByid',
    method: 'get',
    params: {
      questionId:param.questionId,
      pageNum:param.pageNum,
      pageSize:param.pageSize,
    }
  })
}
export function getSupportAnswerPage(param) {
  return request({
    url: '/ts-question/queryQuestionAnswerByQuestionAndAnswer',
    method: 'get',
    params: {
      questionId:param.questionId,
      answerId:param.answerId,
      pageNum:param.pageNum,
      pageSize:param.pageSize,
    }
  })
}

export function getAllSoftware() {
  return request({
    url: '/ts-question/getAllSoftware',
    method: 'get',
  })
}

export function getSoftwareVersion(softwareId) {
  return request({
    url: '/ts-question/getSoftwareVersion',
    method: 'get',
    params: {
      softwareId:softwareId
    }
  })
}

export function delQuestionAnswer(answerId) {
  return request({
    url: '/ts-question-answer/',
    method: 'delete',
    params: {
      id:answerId
    }
  })
}

export function getTsData(uid,keyword,type,pageNum,pageSize,validateStatus=null) {
  return request({
    url: '/ts-data/',
    method: 'get',
    params:{
        uid:uid,
        keyword:keyword,
        type:type,
        pageNum:pageNum,
        pageSize:pageSize,
        validateStatus:validateStatus
    }
  })
}

export function getData(dataId) {
  return request({
    url: '/ts-question/queryByDataId',
    method: 'get',
    params: {
      dataId:id
    }
  })
}

export function downloadData(id) {
  return request({
    url: '/ts-data/download',
    method: 'get',
    params: {
      id:id
    },
    responseType:"blob",
  })
}

export function delData(id) {
  return request({
    url: '/ts-data/',
    method: 'delete',
    params: {
      id:id
    }
  })
}

export function downloadDataByPath(path) {
  return request({
    url: '/ts-data/downloadByPath',
    method: 'get',
    params: {
      path:path
    },
    responseType:"blob",
  })
}

export function addTsData(data) {
  return request({
    url: '/ts-data/',
    method: 'post',
    data
    // params: {
    //   name: name,
    //   typeId: typeId,
    //   cid: cid,
    //   typeName: typeName
    // },
  })
}

export function editTsData(data) {
  return request({
    url: '/ts-data/',
    method: 'put',
    data
  })
}

export function validate(data) {
  return request({
    url: '/ts-data/validate',
    method: 'put',
    data
  })
}

export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()
  const diff = (now - d) / 1000
  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}






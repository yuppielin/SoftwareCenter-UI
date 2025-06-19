import request from '@/utils/request'

export function queryImagesList(query, pageNum, pageSize) {
  return request({
    url: '/softwareImage/getImagesList',
    method: 'get',
    params: {query, pageNum, pageSize }
  })
}

export function addImages(data) {
  return request({
    url: '/softwareImage/addImages',
    method: 'post',
    data
  })
}

export function updateImages(data) {
  return request({
    url: '/softwareImage/edit',
    method: 'put',
    data
  })
}

export function deleteImages(imageId) {
  return request({
    url: '/softwareImage/del',
    method: 'delete',
    params:{
      imageId:imageId
    }
  })
}

export function downloadImage(id) {
  return request({
    url: '/softwareImage/download',
    method: 'get',
    responseType: 'arraybuffer',
    params:{
      id:id
    }
  })
}


//容器镜像配置文件相关接口
export function getConfigFileList(query,imageId, pageNum, pageSize) {
  return request({
    url: '/softwareImageConfigFile/getConfigFileList',
    method: 'get',
    params: {query,imageId, pageNum, pageSize }
  })
}

export function addConfigFiles(data) {
  return request({
    url: '/softwareImageConfigFile/addConfigFiles',
    method: 'post',
    data
  })
}

export function updateConfigFile(data) {
  return request({
    url: '/softwareImageConfigFile/edit',
    method: 'put',
    data
  })
}

export function deleteConfigFiles(id) {
  return request({
    url: '/softwareImageConfigFile/del',
    method: 'delete',
    params:{
      id:id
    }
  })
}

export function downloadConfigFile(id) {
  return request({
    url: '/softwareImageConfigFile/download',
    method: 'get',
    responseType: 'arraybuffer',
    params:{
      id:id
    }
  })
}



import request from '@/utils/request'
import { get } from 'js-cookie'

export function getFragmentPushRecord(repo_addr,pageNum, pageSize ) {
  return request({
    url: '/deployment/getFragmentPushRecord/',
    method: 'get',
    params: {
      repo_addr:repo_addr,
      pageNum:pageNum,
      pageSize:pageSize
   }
  })
  
}

export function deleteRecord(record_id){
  return request({
    url: '/deployment/deleteRecord/',
    method: 'delete',
    params: {
      record_id:record_id,
   }
  })

}
export function getFragmentAddress(repo_name,status,pageNum,pageSize) {
  return request({
    url: '/deployment/',
    method: 'get',
    params: {
      repo_name:repo_name,
      status:status,
      pageNum:pageNum,
      pageSize:pageSize
   }
  })
  
}

export function addFrgmentAddress(data) {
  return request({
    url: '/deployment/',
    method: 'post',
    data
  })
}

export function updateFrgmentAddress(data) {
  return request({
    url: '/deployment/',
    method: 'put',
    data
  })
}

export function deleteFragmentAddress(repo_id) {
  return request({
    url: '/deployment/',
    method: 'delete',
    params:{
      repo_id
    }
  })
}


// 部署态势展示


export function getDeploymentData() {
  return request({
    url: '/deployment/getDeploymentData',
    method: 'get',

  })
}

export function getDeployNodeInfo(pageNum,pageSize) {
  return request({
    url: '/deployment/getDeployNodeInfo/',
    method: 'get',
    params: {
      pageNum:pageNum,
      pageSize:pageSize
   }
  })
}

export function getDeployInstallInfo(repoId,pageNum,pageSize) {
  return request({
    url: '/deployment/getDeployInstallInfo/',
    method: 'get',
    params: {
      repoId:repoId,
      pageNum:pageNum,
      pageSize:pageSize
   }
  })
}

export function getDeployDetailInfo(nodeName,searchName,pageNum,pageSize) {
  return request({
    url: '/deployment/getDeployDetailInfo/',
    method: 'get',
    params: {
      nodeName: nodeName,
      searchName:searchName,
      pageNum:pageNum,
      pageSize:pageSize
   }
  })
}

export function getgetDeploymentData() {
  return request({
    url: '/deployment/getDeploymentData',
    method: 'get',

  })
}

export function getDeployInfoByRepoName(repoId){
  return request({
    url: '/deployment/getDeployInfoByRepoName/',
    method: 'get',
    params: {
      repoId:repoId
   }
  })
}



export function getDeployDetailInfoByRepoId(repoId,nodeName,searchName,pageNum,pageSize){
  return request({
    url: '/deployment/getDeployDetailInfoByRepoId/',
    method: 'get',
    params: {
      repoId : repoId,
      nodeName : nodeName,
      searchName : searchName,
      pageNum : pageNum,
      pageSize : pageSize
   }
  })
}


export function sendFragmentOne(fragment_repo_id,software_id,version_id){
  return request({
    url: '/deployment/send_fragment_one/',
    method: 'post',
    params: {
      fragment_repo_id : fragment_repo_id,
      software_id : software_id,
      version_id : version_id
   }
  })
}


export function sendFragmentMore(data){
  return request({
    url: '/deployment/send_fragment_more/',
    method: 'post',
    data:data,
  })
}

export function getDeployNodeByRepoId(repoId, pageNum, pageSize){
  return request({
    url: '/deployment/getDeployNodeByRepoId',
    method: 'get',
    params: {
      repoId: repoId,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

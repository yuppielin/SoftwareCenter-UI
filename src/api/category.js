import request from '@/utils/request'

export function getCategoryList(cate, pageNum, pageSize) {
  return request({
    url: '/software/set/tree',
    method: 'get',
    params: { cate, pageNum, pageSize }
  })
}
export function getHotCategoryList(size, parentId) {
  return request({
    url: '/software/set/hot',
    method: 'get',
    params: { size, parentId }
  })
}
export function addCategory(name, identity, pid) {
  return request({
    url: '/software/set',
    method: 'post',
    params: { name, identity, pid }
  })
}
export function updateCategory(id, name, identity, pid) {
  return request({
    url: '/software/set',
    method: 'put',
    params: { id, name, identity, pid }
  })
}
export function deleteCategory(id) {
  return request({
    url: '/software/set',
    method: 'delete',
    params: { id }
  })
}

export function updateCategorySort(id, sort) {
  return request({
    url: '/software/set/sort',
    method: 'put',
    params: { id, sort }
  })
}

export function queryCategory(cate, queryStr, pageNum, pageSize) {
  return request({
    url: '/software/set/search',
    method: 'get',
    params: { cate, queryStr, pageNum, pageSize }
  })
}

export function queryCategoryByPid(pid) {
  return request({
    url: '/software/set/query',
    method: 'get',
    params: { queryStr:null, parentId:pid }
  })
}

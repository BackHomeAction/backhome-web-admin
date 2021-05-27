import request from '@/utils/request'

const memoryApi = {
  searchMemo: '/memo',
  adminMemo: '/memo/admin'
}

export function getMemory (params) {
  return request({
    url: memoryApi.searchMemo,
    method: 'get',
    params
  })
}

export function addMemory (data) {
  return request({
    url: memoryApi.adminMemo,
    method: 'post',
    data
  })
}

export function changeMemory (data) {
  return request({
    url: memoryApi.adminMemo,
    method: 'put',
    data
  })
}

export function deleMemory (params) {
  return request({
    url: memoryApi.adminMemo,
    method: 'delete',
    params
  })
}

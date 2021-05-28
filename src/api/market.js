import request from '@/utils/request'

const marketApi = {
  getMarket: '/mark',
  addMarket: '/mark/admin/add',
  updateMarket: '/mark/admin/update',
  deleteMarket: '/mark/admin/delete'
}

export function getMarkets (params) {
  return request({
    url: marketApi.getMarket,
    method: 'get',
    params
  })
}

export function addMarkets (data) {
  return request({
    url: marketApi.addMarket,
    method: 'post',
    data
  })
}

export function updateMarket (data) {
  return request({
    url: marketApi.updateMarket,
    method: 'put',
    data
  })
}

export function deleteMarket (params) {
  return request({
    url: marketApi.deleteMarket,
    method: 'delete',
    params
  })
}

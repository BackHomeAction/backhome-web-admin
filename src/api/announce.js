import request from '@/utils/request'

const announceApi = {
  AnnounceSearch: '/notice',
  AnnounceSearchAdmin: '/notice/admin',
  Announce: '/notice/admin',
  BannerSearch: '/notice/banner',
  BannerAdmin: '/notice/banner/admin',
  BannerSearchByid: '/notice/banner/id',
  AnnounceSearchByid: '/notice/id'
}
export function announceSearchGet (params) {
  return request({
    url: announceApi.AnnounceSearch,
    method: 'get',
    params
  })
}
export function announSearch (params) {
  return request({
    url: announceApi.AnnounceSearchAdmin,
    method: 'get',
    params
  })
}
export function bannerSearch (params) {
  return request({
    url: announceApi.BannerAdmin,
    method: 'get',
    params
  })
}
export function bannerUserSearch (params) {
  return request({
    url: announceApi.BannerAdmin,
    method: 'get',
    params
  })
}
export function bannerCreate (data) {
  return request({
    url: announceApi.BannerAdmin,
    method: 'post',
    data
  })
}
export function bannerDelete (data) {
  return request({
    url: announceApi.BannerAdmin,
    method: 'delete',
    data
  })
}
export function bannerChange (data) {
  return request({
    url: announceApi.BannerAdmin,
    method: 'put',
    data
  })
}

import request from '@/utils/request'

const announceApi = {
  AnnounceSearch: '/notice',
  AnnounceSearchAdmin: '/notice/admin',
  Announce: '/notice/admin',
  BannerSearch: '/notice/banner',
  BannerAdmin: '/notice/banner/admin',
  BannerSearchByid: '/notice/banner/id',
  AnnounceSearchByid: '/notice/id',
  ThreeAdmin: '/admin/thirdParty'
}
export function threeDelete (params) {
  return request({
    url: announceApi.ThreeAdmin,
    method: 'delete',
    params
  })
}
export function threeChange (data) {
  return request({
    url: announceApi.ThreeAdmin,
    method: 'put',
    data
  })
}
export function threeNew (data) {
  return request({
    url: announceApi.ThreeAdmin,
    method: 'post',
    data
  })
}
export function threeSearch (params) {
  return request({
    url: announceApi.ThreeAdmin,
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
export function bannerDelete (params) {
  return request({
    url: announceApi.BannerAdmin,
    method: 'delete',
    params
  })
}
export function bannerChange (data) {
  return request({
    url: announceApi.BannerAdmin,
    method: 'put',
    data
  })
}
export function searchBannerUser (params) {
  return request({
    url: announceApi.BannerSearch,
    method: 'get',
    params
  })
}
export function listSearch (params) {
  return request({
    url: announceApi.AnnounceSearchAdmin,
    method: 'get',
    params
  })
}
export function announDelete (params) {
  return request({
    url: announceApi.Announce,
    method: 'delete',
    params
  })
}

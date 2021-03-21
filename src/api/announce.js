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

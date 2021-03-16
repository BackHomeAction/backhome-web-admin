import request from '@/utils/request'

const adminAPI = {
  adminList: '/admin/all',
  adminUser: '/admin',
  adminCreate: '/admin/admin/add',
  adminUpdate: '/admin/update'
}

export function adminUpdate (data) {
  return request({
    url: adminAPI.adminUpdate,
    method: 'put',
    data
  })
}

export function adminList (param) {
  return request({
    url: adminAPI.adminList,
    method: 'get',
    param
  })
}
export function adminUser (param) {
  return request({
    url: adminAPI.adminUser,
    method: 'get',
    param
  })
}
export function adminCreate (data) {
  return request({
    url: adminAPI.adminCreate,
    method: 'post',
    data
  })
}

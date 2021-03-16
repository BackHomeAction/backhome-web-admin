import request from '@/utils/request'

const adminAPI = {
  adminList: 'admin/all',
  adminUser: 'admin'
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

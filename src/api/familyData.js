import request from '@/utils/request'

const userAPI = {
  FamilyData: '/admin/family',
  FamilyDataChange: 'admin/family',
  FamilyAvarat: '/admin/family/avatar',
  FamilysearchByid: '/admin/family/id',
  OldmanData: '/admin/family/oldMan',
  OldmanDataChange: '/admin/family/oldMan'

}

export function getFamilyData (params) {
  return request({
    url: userAPI.FamilyData,
    method: 'get',
    params
  })
}

export function getFamilyByid (params) {
  return request({
    url: userAPI.FamilysearchByid,
    method: 'get',
    params
  })
}

export function familyChangeAvarat (params) {
  return request({
    url: userAPI.FamilyAvarat,
    method: 'put',
    params
  })
}

export function oldManinf (param) {
  return request({
    url: userAPI.OldmanData,
    method: 'get',
    params: { familyId: param }
  })
}

export function oldManinfChange (params) {
  return request({
    url: userAPI.OldmanDataChange,
    method: 'put',
    params
  })
}

export function familyDataChange (params) {
  return request({
    url: userAPI.FamilyDataChange,
    method: 'get',
    params
  })
}

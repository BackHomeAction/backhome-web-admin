import request from '@/utils/request'

const userAPI = {
  FamilyData: '/admin/family',
  FamilyDataChange: 'admin/family',
  FamilyAvarat: '/admin/family/avatar',
  FamilysearchByid: '/admin/family/id',
  OldmanData: '/admin/family/oldMan',
  OldmanDataChange: '/admin/family/oldMan',
  Familymissionlist: '/admin/family/case',
  OldManCase: '/admin/family/oldMan/case',
  FamilyDelete: '/admin/family'

}
export function familyDelete (params) {
  return request({
    url: userAPI.FamilyDelete,
    method: 'get',
    params
  })
}
export function OldManCase (params) {
  return request({
    url: userAPI.OldManCase,
    method: 'get',
    params
  })
}
export function familyMission (params) {
  return request({
    url: userAPI.Familymissionlist,
    method: 'get',
    params
  })
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

export function familyChangeAvarat (data) {
  return request({
    url: userAPI.FamilyAvarat,
    method: 'put',
    data
  })
}

export function oldManinf (params) {
  return request({
    url: userAPI.OldmanData,
    method: 'get',
    params
  })
}

export function oldManinfChange (data) {
  return request({
    url: userAPI.OldmanDataChange,
    method: 'put',
    data
  })
}

export function familyDataChange (data) {
  return request({
    url: userAPI.FamilyDataChange,
    method: 'put',
    data
  })
}

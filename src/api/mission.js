import request from '@/utils/request'

const missionApi = {
  caseListAll: '/case',
  caseList: '/admin/case'
}

export function getMissionListAll (params) {
  return request({
    url: missionApi.caseListAll,
    method: 'get',
    params
  })
}

export function getMissionList (params) {
  return request({
    url: missionApi.caseList,
    method: 'get',
    params
  })
}

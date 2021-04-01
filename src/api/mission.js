import request from '@/utils/request'

const missionApi = {
  caseListAll: '/case',
  caseList: '/admin/case',
  volunteerInCase: '/case/volunteer',
  timeline: '/admin/case/dynamic',
  end: '/admin/case/end'
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

export const requestGetVolunteersInCase = (params) => {
  return request({
    url: missionApi.volunteerInCase,
    method: 'get',
    params
  })
}

export function getMissionTimeline (params) {
  return request({
    url: missionApi.timeline,
    method: 'get',
    params
  })
}

export function endMission (data) {
  return request({
    url: missionApi.end,
    method: 'post',
    data
  })
}

import request from '@/utils/request'

const missionList = {
  caseALL: '/case'

}

export function getMission (params) {
  return request({
    url: missionList.caseALL,
    method: 'get',
    params
  })
}

export default missionList

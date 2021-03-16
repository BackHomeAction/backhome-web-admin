import request from '@/utils/request'

const missionList = {
  OldmanDataChange: '/admin/family/oldMan'

}

export function getFamilyData (params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}

export default missionList

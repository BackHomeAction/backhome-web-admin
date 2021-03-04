import request from '@/utils/request'

const userAdminApi = {
  VolunteerList: '/admin/volunteer'
}

export function getVolunteerList (parameter) {
  return request({
    url: userAdminApi.VolunteerList,
    method: 'get',
    params: parameter
  })
}

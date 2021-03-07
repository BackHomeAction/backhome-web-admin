import request from '@/utils/request'

const userAdminApi = {
  Volunteer: '/admin/volunteer',
  VolunteerById: '/admin/volunteer/id',
  VolunteerAvatar: '/admin/volunteer/avatar',
  VolunteerLiveness: '/admin/volunteer/liveness',
  VolunteerFinishTasksNumber: '/admin/volunteer/case/finishNum',
  VolunteerTotalTasksNumber: '/admin/volunteer/case/totalNum'
}

export function getVolunteerList (params) {
  return request({
    url: userAdminApi.Volunteer,
    method: 'get',
    params
  })
}

export function getVolunteerByID (params) {
  return request({
    url: userAdminApi.VolunteerById,
    method: 'get',
    params
  })
}

export function addVolunteer (data) {
  return request({
    url: userAdminApi.Volunteer,
    method: 'post',
    data
  })
}

export function editVolunteer (data) {
  return request({
    url: userAdminApi.Volunteer,
    method: 'put',
    data
  })
}

export function changeVolunteerAvatar (data) {
  return request({
    url: userAdminApi.VolunteerAvatar,
    method: 'put',
    data
  })
}

export function getVolunteerOnlineDaysNumber (params) {
  return request({
    url: userAdminApi.VolunteerLiveness,
    method: 'get',
    params
  })
}

export function getVolunteerFinishTasksNumber (params) {
  return request({
    url: userAdminApi.VolunteerFinishTasksNumber,
    method: 'get',
    params
  })
}

export function getVolunteerTotalTasksNumber (params) {
  return request({
    url: userAdminApi.VolunteerTotalTasksNumber,
    method: 'get',
    params
  })
}

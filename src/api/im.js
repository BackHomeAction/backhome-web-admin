import request from '@/utils/request'

const imApi = {
  userSig: '/admin/im/userSig',
  group: '/admin/case/group'
}

export const getImUserSig = () => {
  return request({
    url: imApi.userSig,
    method: 'get'
  })
}

export const joinIMGroup = (data) => {
  return request({
    url: imApi.group,
    method: 'post',
    data: {
      type: 1,
      ...data
    }
  })
}

export const leaveIMGroup = (data) => {
  return request({
    url: imApi.group,
    method: 'post',
    data: {
      type: 2,
      ...data
    }
  })
}

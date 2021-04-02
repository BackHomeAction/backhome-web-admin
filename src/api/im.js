import request from '@/utils/request'

const imApi = {
  userSig: '/admin/im/userSig'
}

export const getImUserSig = () => {
  return request({
    url: imApi.userSig,
    method: 'get'
  })
}

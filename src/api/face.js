import request from '@/utils/request'

const faceApi = {
  one: '/face',
  list: '/face/admin',
  check: '/face/result/admin'
}

export const getFaceIdentificationRecords = (params) => {
  return request({
    url: faceApi.one,
    method: 'get',
    params
  })
}

export function getFaceRecognizationList (params) {
  return request({
    url: faceApi.list,
    method: 'get',
    params
  })
}

export function checkFaceRecognizationResult (data) {
  return request({
    url: faceApi.check,
    method: 'post',
    data
  })
}

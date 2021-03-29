import request from '@/utils/request'

const commonApi = {
  upload: '/admin/photo'
}

export function uploadImage (file) {
  const formData = new FormData()
  formData.append('photo', file)

  return request({
    url: commonApi.upload,
    method: 'post',
    data: formData,
    transformRequest (data) {
      return data
    }
  })
}

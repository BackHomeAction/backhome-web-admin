import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})
const requestNoAuth = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 刷新 token
const refreshToken = async () => {
  const res = await requestNoAuth.request({
    url: `admin/refresh`,
    method: 'POST',
    params: {},
    data: {
      refreshToken: storage.get(REFRESH_TOKEN)
    }
  })
  if (res.data.status !== 200) {
    throw Error()
  }
  return res
}

// 异常拦截处理器
const errorHandler = (error) => {
  notification.error({
    message: '服务器错误',
    description: '请稍后再试，或联系管理员处理'
  })
  // if (error.response) {
  //   const data = error.response.data
  //   // 从 localstorage 获取 token
  //   const token = storage.get(ACCESS_TOKEN)
  //   if (error.response.status === 403) {
  //     notification.error({
  //       message: 'Forbidden',
  //       description: data.message
  //     })
  //   }
  //   if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
  //     notification.error({
  //       message: 'Unauthorized',
  //       description: 'Authorization verification failed'
  //     })
  //   }
  // }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  const state = response.data.status
  const message = response.data.message

  // 无感刷新 token
  if (state === 103) {
    const { config } = response
    if (!isRefreshing) {
      isRefreshing = true
      return refreshToken()
        .then((res) => {
          const { token, refreshToken } = res.data
          if (token && refreshToken) {
            storage.set(ACCESS_TOKEN, token)
            storage.set(REFRESH_TOKEN, refreshToken)
            console.log('[request] Refresh token success.')
            config.header.Authorization = `Bearer ${token}`
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach((cb) => cb(token))
            requests = []
            return request.request(config)
          } else {
            throw new Error('刷新 token 失败')
          }
        })
        .catch(async (res) => {
        // 无法刷新 token，需要重新登录
          console.error('[request] Refresh token error =>', res)
          // 抛出错误，阻止本次请求
          const error = new Error('登录态过期')
          const token = storage.get(ACCESS_TOKEN)
          if (token) {
            store.dispatch('Logout').then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
          }
          // error.response = response
          throw error
        })
        .finally(() => {
          isRefreshing = false
        })
    }
    // 正在刷新token，返回一个未执行resolve的promise
    return new Promise((resolve) => {
    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push((token) => {
        if (token) {
          config.header.Authorization = `Bearer ${token}`
        }
        resolve(request.request(config))
      })
    })
  }

  if (state !== 200) {
    if (state === 102) {
      notification.error({
        message: '错误',
        description: 'token 错误'
      })
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
    } else {
      notification.error({
        message: '错误',
        description: message
      })
    }

    return Promise.reject(response)
  }

  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}

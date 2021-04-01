import request from '@/utils/request'

const userApi = {
  Login: '/admin/login',
  // Logout: '/auth/logout',
  // ForgePassword: '/auth/forge-password',
  // Register: '/auth/register',
  // get my info
  UserInfo: '/admin',
  // UserMenu: '/user/nav'
  ChangePassword: '/admin/password'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get'
  })
}

export function changePassword (data) {
  return request({
    url: userApi.ChangePassword,
    method: 'put',
    data
  })
}

// export function getCurrentUserNav () {
//   return request({
//     url: userApi.UserMenu,
//     method: 'get'
//   })
// }

// export function logout () {
//   return request({
//     url: userApi.Logout,
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }

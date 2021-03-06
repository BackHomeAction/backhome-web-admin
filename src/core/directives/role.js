import Vue from 'vue'
import store from '@/store'

/**
 * Role 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-role:"[]"" , 如下：
 *    <i-button v-role:"['superAdmin', 'admin']" >添加用户</a-button>
 *    <a-button v-role:"['superAdmin']">删除用户</a-button>
 *    <a v-role:"['superAdmin', 'admin']" @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *
 */
const role = Vue.directive('role', {
  inserted: function (el, binding, vnode) {
    const roleNames = binding.value
    const roles = store.getters.roles
    roles.forEach(role => {
      if (!roleNames.includes(role)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    })
  }
})

export default role

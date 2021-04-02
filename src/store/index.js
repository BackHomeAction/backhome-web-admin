import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import data from '@/store/modules/data'
import mission from './modules/mission'
import im from './modules/im'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    namespace: true,
    app,
    user,
    permission,
    data,
    mission,
    im
  },
  state: {
  },
  mutations: {
  },
  actions: {

  },
  getters
})

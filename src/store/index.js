import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

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
    permission
  },
  state: {
    oldManData: {
      oldmanWatch: []
    },
    familyData: {
      editUser: [],
      watchUser: []
    },
    commander: {
      editUser: [],
      watchUser: []
    },
    familyList: [],
    commanderList: [],
    mission: {
      missionWatchList: [],
      missionList: []
    }
  },
  mutations: {
  },
  actions: {

  },
  getters
})

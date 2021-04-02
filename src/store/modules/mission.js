import { getMissionList, requestGetVolunteersInCase } from '@/api/mission'
import { getFaceIdentificationRecords } from '@/api/face'

const mission = {
  state: {
    currentMission: {
      missionInfo: null,
      teamMembers: [],
      onlineTeamMembers: [],
      faceRecognitionHistory: []
    }
  },

  mutations: {
    SET_CURRENT_MISSION: (state, currentMission) => {
      state.currentMission = currentMission
      console.debug(state)
    },
    SET_CURRENT_MISSION_INFO: (state, currentMissionInfo) => {
      state.currentMission.missionInfo = currentMissionInfo
      console.debug(state)
    },
    SET_CURRENT_MISSION_MEMBERS: (state, currentMissionMembers) => {
      state.currentMission.teamMembers = currentMissionMembers
      state.currentMission.onlineTeamMembers = currentMissionMembers.filter(
        (item) => item?.online === 1
      )
      console.debug(state)
    },
    UPDATE_MISSION_VOLUNTEER_LOCATION: (state, params) => {
      // 更新 teamMembers
      const index1 = state.currentMission.teamMembers.findIndex(
        (item) => item.id === params.volunteerId
      )
      if (index1 >= 0) {
        state.currentMission.teamMembers[index1].latitude = params.latitude
        state.currentMission.teamMembers[index1].longitude = params.longitude
        state.currentMission.teamMembers[index1].online = 1
        // 更新 onlineTeamMembers
        const index2 = state.currentMission.onlineTeamMembers.findIndex(
          (item) => item.id === params.volunteerId
        )
        if (index2 >= 0) {
          state.currentMission.onlineTeamMembers[index2].latitude =
      params.latitude
          state.currentMission.onlineTeamMembers[index2].longitude =
      params.longitude
          state.currentMission.onlineTeamMembers[index2].online = 1
        } else {
          // 如果没在 onlineTeamMembers 里找到，说明这个志愿者是新上线的，需要把他加入 onlineTeamMembers 中
          state.currentMission.onlineTeamMembers.push(
            state.currentMission.teamMembers[index1]
          )
        }
      }
      console.debug(state)
    },
    UPDATE_MISSION_VOLUNTEER_OFFLINE: (state, volunteerId) => {
      // 更新 teamMembers
      const index1 = state.currentMission.teamMembers.findIndex(
        (item) => item.id === volunteerId
      )
      if (index1 >= 0) {
        state.currentMission.teamMembers[index1].latitude = 0
        state.currentMission.teamMembers[index1].longitude = 0
        state.currentMission.teamMembers[index1].online = 2
        // 更新 onlineTeamMembers
        const index2 = state.currentMission.onlineTeamMembers.findIndex(
          (item) => item.id === volunteerId
        )
        if (index2 >= 0) {
          state.currentMission.onlineTeamMembers.splice(index2)
        }
      }
      console.debug(state)
    },
    SET_FACE_RECOGNITION_HISTORY: (state, faceRecognitionHistory) => {
      state.currentMission.faceRecognitionHistory = faceRecognitionHistory
      console.debug(state)
    }
  },

  actions: {
    getCurrentMissionInfo: ({ commit }, params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await getMissionList({
            id: params.id
          })
          if (res.data.data) {
            commit('SET_CURRENT_MISSION_INFO', res.data.data[0])
            resolve()
          } else {
            reject(new Error('no mission data'))
          }
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    },
    getCurrentMissionMembers: ({ commit }, params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await requestGetVolunteersInCase({
            caseId: params.id
          })
          if (res.data) {
            commit('SET_CURRENT_MISSION_MEMBERS', res.data)
            resolve()
          } else {
            reject(new Error())
          }
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    },
    clearCurrentMission: ({ commit }) => {
      return new Promise(async (resolve, reject) => {
        try {
          commit('SET_CURRENT_MISSION', {
            missionInfo: null,
            teamMembers: [],
            onlineTeamMembers: [],
            faceRecognitionHistory: []
          })
          resolve()
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    },
    getCurrentMissionFaceRecognitionHistories: ({ commit }, params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await getFaceIdentificationRecords({
            oldManId: params.oldManId
          })
          if (res.data) {
            commit('SET_FACE_RECOGNITION_HISTORY', res.data)
            resolve()
          } else {
            reject(new Error('no data'))
          }
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    },
    initCurrentMission: ({ state, dispatch }, params) => {
      return new Promise(async (resolve, reject) => {
        try {
          // 清空选中的案件信息
          await dispatch('clearCurrentMission')
          // 获取选中的案件信息
          await Promise.all([
            dispatch('getCurrentMissionInfo', params),
            dispatch('getCurrentMissionMembers', params)
          ])
          await dispatch(
            'getCurrentMissionFaceRecognitionHistories',
            { oldManId: state.currentMission.missionInfo.oldMan.id }
          )
          resolve()
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    }
  }
}

export default mission

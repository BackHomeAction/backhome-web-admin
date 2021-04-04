import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import store from '../store'
import { getImUserSig } from '../api/im'

export default class IM {
  constructor () {
    this.tim = TIM.create({
      SDKAppID: process.env.VUE_APP_TIM_APPID
    })
    this.tim.setLogLevel(process.env.NODE_ENV.localeCompare('development') === 0 ? 0 : 1)
    this.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
    this.tim.on(TIM.EVENT.SDK_READY, this.onReadyStateUpdate)
    this.tim.on(TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate)

    // this.tim.on(TIM.EVENT.KICKED_OUT, kickOut);
    // this.tim.on(TIM.EVENT.ERROR, onError);

    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.messageReceived)
    this.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.convListUpdate)
    this.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, this.groupListUpdate)
    // this.tim.on(TIM.EVENT.BLACKLIST_UPDATED, blackListUpdate);
    // this.tim.on(TIM.EVENT.NET_STATE_CHANGE, netStateChange);
    // this.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer);
  }

  onReadyStateUpdate (params) {
    const isSDKReady = params.name === TIM.EVENT.SDK_READY
    if (isSDKReady) {
      // 拉取个人资料
      this.tim.getMyProfile().then((res) => {
        console.log(res)
        store.commit('SET_TIM_MY_INFO', res.data)
      })
      // 拉取群组列表
      this.tim.getGroupList()
      // wx.$app.getBlacklist().then((res) => {
      //   store.commit("setBlacklist", res.data);
      // });
    }
    store.commit('SET_TIM_SDK_READY', isSDKReady)
  }

  groupListUpdate (event) {
    store.commit('SET_TIM_MY_GROUPS', event.data)
  }

  convListUpdate (event) {
    store.commit('SET_TIM_ALL_CONVERSATION', event.data)
  }

  messageReceived (event) {
    store.dispatch('onMessageEvent', event)
  }

  async login () {
    const state = store.getters.im && store.getters.im.isSdkReady
    if (state) return
    if (!this.tim) return

    const uid = store.getters.userInfo.id
    const userID = `admin_${uid}`

    try {
      const res = await getImUserSig()
      this.tim.login({
        userID,
        userSig: res.data
      })
    } catch (e) {
      console.log(e)
    }
  }

  async checkLogin () {
    const state = store.getters.im.isSdkReady
    if (!state) {
      await this.login()
    }
  };

  getGroupID (caseId) {
    return store.getters.im.groupIDsMap.get(`case_${caseId}`)
  };

  getConversationID (caseId) {
    return 'GROUP' + this.getGroupID(caseId)
  };

  async checkoutGroup (caseId) {
    await this.checkLogin()
    store.dispatch('checkoutConversation', this.getConversationID(caseId))
  };

  async getMessageList () {
    // eslint-disable-next-line no-return-await
    return await store.dispatch('getMessageList')
  };

  resetGroup () {
    store.commit('RESET_CURRENT_CONVERSATION')
  };

  async sendGroupTextMessage (caseId, text) {
    await this.checkLogin()

    const message = this.tim.createTextMessage({
      to: this.getGroupID(caseId),
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        text
      }
    })
    await this.tim.sendMessage(message)
    store.commit('SEND_MESSAGE', message)
  };

  async sendGroupImageMessage (caseId, file) {
    await this.checkLogin()

    const message = this.tim.createImageMessage({
      to: this.getGroupID(caseId),
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        file
      }
    })
    await this.tim.sendMessage(message)
    store.commit('SEND_MESSAGE', message)
  };

  static getInstance () {
    if (!this.instance) {
      this.instance = new IM()
    }
    return this.instance
  }
}

import dayjs from '@/utils/dayjs'
import notification from 'ant-design-vue/es/notification'

function formatTime (date) {
  if (dayjs(date).isToday()) {
    return dayjs(date).format('AHH:mm')
  }
  return dayjs(date).format('MM-DD AHH:mm')
}

const tim = {
  state: {
    isSdkReady: false, // TIM SDK 初始化状态
    myInfo: {}, // 个人信息
    allConversation: [], // 所有的conversation
    currentConversationID: '', // 当前聊天对话ID
    currentConversation: {}, // 当前聊天对话信息
    currentMessageList: [], // 当前聊天消息列表
    unreadMessageNumber: 0,
    nextReqMessageID: '', // 下一条消息标志
    isCompleted: false, // 当前会话消息是否已经请求完毕
    isLoading: false, // 是否正在请求
    groupIDsMap: new Map() // 群名 -> 群 ID 的 Map
  },

  mutations: {
    SET_TIM_SDK_READY: (state, payload) => {
      state.isSdkReady = payload
      console.debug('TIM state:', state)
    },
    SET_TIM_MY_INFO: (state, payload) => {
      state.myInfo = payload
      console.debug('TIM state:', state)
    },
    SET_TIM_MY_GROUPS: (state, payload) => {
      payload.map(item => {
        state.groupIDsMap.set(item.name, item.groupID)
      })
      state.myInfo = payload
      console.debug('TIM state:', state)
    },
    // 更新当前所有会话列表
    SET_TIM_ALL_CONVERSATION: (state, list) => {
      for (let i = 0; i < list.length; i++) {
        if (
          list[i].lastMessage &&
          typeof list[i].lastMessage.lastTime === 'number'
        ) {
          const date = new Date(list[i].lastMessage.lastTime * 1000)
          list[i].lastMessage._lastTime = formatTime(date)
        }
      }
      state.allConversation = list
    },
    // 重置当前会话
    RESET_CURRENT_CONVERSATION: (state) => {
      state.currentConversationID = '' // 当前聊天对话ID
      state.currentConversation = {} // 当前聊天对话信息
      state.currentMessageList = [] // 当前聊天消息列表
      state.nextReqMessageID = '' // 下一条消息标志
      state.isCompleted = false // 当前会话消息是否已经请求完毕
      state.isLoading = false // 是否正在请求
    },
    // 更新当前的会话
    UPDATE_CURRENT_CONTERSATION: (state, conversation) => {
      state.currentConversation = conversation
      state.currentConversationID = conversation.conversationID
    },
    // 历史头插消息列表
    UNSHIFT_MESSAGE_LIST: (state, messageList) => {
      const list = [...messageList]
      for (let i = 0; i < list.length; i++) {
        const message = list[i]
        const date = new Date(message.time * 1000)
        list[i].newtime = formatTime(date)
      }
      state.currentMessageList = [...list, ...state.currentMessageList]
    },
    // 收到了消息
    RECEIVE_MESSAGE: (state, messageList) => {
      const list = [...messageList]
      for (let i = 0; i < list.length; i++) {
        const message = list[i]
        const date = new Date(message.time * 1000)
        list[i].newtime = formatTime(date)
      }
      state.currentMessageList = [...state.currentMessageList, ...list]
    },
    // 发送了消息
    SEND_MESSAGE: (state, message) => {
      const date = new Date(message.time * 1000)
      message.newtime = formatTime(date)
      state.currentMessageList = [...state.currentMessageList, message]
    },
    // 增加未读消息数量
    ADD_UNREAD_MESSAGE_NUMBER: (state, delta = 1) => {
      state.unreadMessageNumber += delta
    },
    // 清空未读消息数量
    CLEAR_UNREAD_MESSAGE_NUMBER: (state) => {
      state.unreadMessageNumber = 0
    }
  },

  actions: {
    // 消息事件
    onMessageEvent: (context, event) => {
      if (event.name === 'onMessageReceived') {
        const id = context.state.currentConversationID
        if (!id) {
          return
        }
        const list = []
        event.data.forEach(item => {
          if (item.conversationID === id) {
            list.push(item)
            context.commit('ADD_UNREAD_MESSAGE_NUMBER')
          }
        })
        context.commit('RECEIVE_MESSAGE', list)
      }
    },
    // 获取消息列表
    getMessageList: (context) => {
      return new Promise((resolve, reject) => {
        const { currentConversationID, nextReqMessageID } = context.state
        // 判断是否拉完了，isCompleted 的话要报一下没有更多了
        if (!context.state.isCompleted) {
          // 如果请求还没回来，又拉，此时做一下防御
          if (!context.state.isLoading) {
            context.state.isLoading = true
            tim
              .getMessageList({
                conversationID: currentConversationID,
                nextReqMessageID: nextReqMessageID,
                count: 15
              })
              .then(
                (res) => {
                  context.state.nextReqMessageID = res.data.nextReqMessageID
                  context.commit(
                    'UNSHIFT_MESSAGE_LIST',
                    res.data.messageList
                  )
                  if (res.data.isCompleted) {
                    context.state.isCompleted = true
                  }
                  context.state.isLoading = false
                  resolve(res)
                }
              )
              .catch((err) => {
                console.log(err)
                reject(err)
              })
          } else {
            notification.error({
              message: '错误',
              description: '你拉得太快啦！'
            })
            reject(new Error('你拉的太快了'))
          }
        } else {
          reject(new Error('没有更多啦'))
        }
      })
    },
    checkoutConversation: (context, conversationID) => {
      context.commit('RESET_CURRENT_CONVERSATION')
      tim.setMessageRead({ conversationID })
      return tim
        .getConversationProfile(conversationID)
        .then((res) => {
          const conversation = res.data.conversation
          context.commit(
            'UPDATE_CURRENT_CONTERSATION',
            conversation
          )
          context.dispatch('getMessageList')
          // let name = "";
          // switch (conversation.type) {
          //   case TIM.TYPES.CONV_C2C:
          //     name =
          //       conversation.userProfile.nick ||
          //       conversation.userProfile.userID;
          //     break;
          //   case TIM.TYPES.CONV_GROUP:
          //     name =
          //       conversation.groupProfile.name ||
          //       conversation.groupProfile.groupID;
          //     break;
          //   default:
          //     name = "系统通知";
          // }
          return Promise.resolve()
        })
    }
  }
}

export default tim

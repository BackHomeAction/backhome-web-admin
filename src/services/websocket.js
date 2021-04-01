import Stomp from 'stompjs'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default class WebSocket {
  constructor () {
    this.client = Stomp.client('wss://fwwb2020-app-volunteer.tgucsdn.com/websocket')
    this.subscribes = {}
    this.heartBeatTimer = null
  }

  connect () {
    if (this.client && this.client.connected) {
      return
    }

    this.client.connect(
      {
        Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)
      },
      (frame) => {
        console.log(frame)
        // 初始化订阅
        Object.keys(this.subscribes).forEach((key) => {
          this.subscribe(key, this.subscribes[key].callback)
        })
        this.heartBeatTimer = setInterval(() => {
          this.send('/home/admin', 'ping')
        }, 10000)
      },
      (error) => {
        console.warn(error)
        throw new Error(error)
      }
    )
  }

  disconnect () {
    if (this.client) {
      this.client.disconnect()
      clearInterval(this.heartBeatTimer)
      this.heartBeatTimer = null
    }
  }

  subscribe (destination, callback) {
    if (
      this.subscribes[destination] &&
    this.subscribes[destination]['subscribed']
    ) {
    // 已订阅

    } else if (this.client && this.client.connected) {
    // 已连接：调用订阅，缓存订阅信息
      const subscribe = this.client.subscribe(destination, (res) => {
        console.debug('Websocket receive message:', destination, res)
        callback(res)
      })
      this.subscribes[destination] = {
        callback: callback,
        subscribed: true,
        subscribe: subscribe
      }
    } else {
    // 未连接：缓存订阅信息
      this.subscribes[destination] = { callback: callback, subscribed: false }
    }
  }

  unsubscribe (destination) {
    if (this.subscribes[destination]) {
      // 取消订阅
      this.subscribes[destination].subscribe.unsubscribe()
      // 删除订阅缓存
      delete this.subscribes[destination]
    }
  }

  send (destination, data) {
    if (this.client && this.client.connected) {
      const message = data instanceof Object ? JSON.stringify(data) : data
      console.debug('Websocket send message:', destination, message)
      this.client.send(destination, null, message)
    } else {
      try {
        this.connect()
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  static getInstance () {
    if (!this.instance) {
      this.instance = new WebSocket()
    }
    return this.instance
  }
}

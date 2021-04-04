<template>
  <div
    v-if="data"
    class="body"
    :class="{'body-send': data.flow === 'out', 'body-receive': data.flow === 'in'}"
  >
    <div class="avatar">
      <a-avatar v-if="userAvatar" shape="square" :size="50" :src="userAvatar" />
      <a-avatar v-else shape="square" :size="50" icon="user" />
    </div>
    <div class="content">
      <div class="info">
        <a-tag v-if="userRole === 1" color="#32bb87">
          志愿者
        </a-tag>
        <a-tag v-if="userRole === 2" color="#9b9266">
          家属
        </a-tag>
        <a-tag v-if="userRole === 3" color="#c63f47">
          管理员
        </a-tag>
        <div class="info-name">
          {{ data.flow === 'out' ? '我' : (data.nick || this.userRoleName) }}
        </div>
      </div>
      <div>
        <div
          v-if="data.type === TIM.TYPES.MSG_TEXT"
          class="bubble bubble-text"
        >
          {{ data.payload.text }}
        </div>
        <img
          v-if="data.type === TIM.TYPES.MSG_IMAGE"
          class="bubble bubble-image"
          :src="data.payload.imageInfoArray[1].url"
          :style="{width: data.payload.imageInfoArray[1].width <= 200 ? `${data.payload.imageInfoArray[1].width}px` : '200px'}"
          v-viewer
        />
      </div>
    </div>
  </div>
</template>

<script>
import TIM from 'tim-js-sdk'

export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  computed: {
    userRole () {
      const imUserID = this.data.from

      if (imUserID.indexOf('volunteer') !== -1) {
        return 1
      } else if (imUserID.indexOf('family') !== -1) {
        return 2
      } else if (imUserID.indexOf('admin') !== -1) {
        return 3
      }

      return 0
    },
    userRoleName () {
      const roleId = this.userRole

      if (roleId === 1) {
        return '志愿者'
      } else if (roleId === 2) {
        return '家属'
      } else if (roleId === 3) {
        return '志愿者'
      }

      return ''
    },
    userID () {
      const imUserID = this.data.from
      const idStr = imUserID.match(/_(.*)/)[1]

      return parseInt(idStr, 10)
    },
    userAvatar () {
      const role = this.userRole

      if (role === 1) {
        const users = this.$store.getters.currentMission.teamMembers
        for (let i = 0; i < users.length; i++) {
          if (users[i].id === this.userID) {
            return users[i].avatarUrl
          }
        }
      }

      return null
    },
    userInfo () {
      const role = this.userRole

      if (role === 1) {
        const users = this.$store.getters.currentMission.teamMembers
        for (let i = 0; i < users.length; i++) {
          if (users[i].id === this.userID) {
            return users[i]
          }
        }
      }

      return null
    }
  },
  data () {
    return { TIM }
  }
}
</script>

<style lang="less" scoped>
.body {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18px;

  .content {
    display: flex;
    flex-direction: column;
    max-width: 450px;

    .info {
      display: flex;
      align-items: center;

      &-name {
        margin-left: 0;
        font-size: 13px;
        color: #000000;
        line-height: 20px;
      }
    }
  }
  .bubble {
    margin-top: 8px;
    display: inline-block;

    &-text {
      padding: 10px 14px;
      font-size: 14px;
      line-height: 20px;
      word-break: break-all;
    }

    &-image {
      object-fit: contain;
      cursor: pointer;
    }
  }
}

.body-send {
  flex-direction: row-reverse;

  .avatar {
    padding-left: 12px;
  }

  .content {
    align-items: flex-end;

    .bubble {
      border-radius: 15px 0 15px 15px;

      &-text {
        background: #409eff;
        color: #ffffff;
      }
    }
  }
}

.body-receive {
  .avatar {
    padding-right: 12px;
  }

  .content {
    .bubble {
      border-radius: 0 15px 15px 15px;

      &-text {
        background: #f8f8f8;
        color: #000000;
      }
    }
  }
}
</style>

<template>
  <div class="message" ref="list">
    <div class="more">
      <a v-if="!messageListCompleted" class="" @click="handleLoadPrevious">点击加载更多</a>
    </div>
    <div
      v-for="(item, index) in messageList"
      :id="`message-${item.ID.slice(10)}`"
      :key="item.ID"
    >
      <div
        v-if="index === 0 || item.newtime !== messageList[index - 1].newtime"
        class="message-time"
      >
        {{ item.newtime }}
      </div>
      <bubble-notification
        v-if="item.from === 'administrator'"
        :data="item"
      />
      <bubble
        v-else
        :data="item"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Bubble from './MessageListBubble.vue'
import BubbleNotification from './MessageListBubbleNotification.vue'
import IM from '@/services/im'

export default {
  components: {
    Bubble,
    BubbleNotification
  },
  computed: {
    ...mapGetters(['messageListCompleted', 'messageList'])
  },
  watch: {
    messageList () {
      if (this.isLoadPrevious) {
        this.isLoadPrevious = false
        return
      }
      this.scrollToBottom()
    }
  },
  data () {
    return {
      isLoadPrevious: false,
      im: IM.getInstance()
    }
  },
  methods: {
    scrollToBottom () {
      this.$nextTick(() => {
        const container = this.$refs.list
        container.scrollTop = container.scrollHeight
      })
    },
    async handleLoadPrevious () {
      try {
        this.isLoadPrevious = true
        await this.im.getMessageList()
      } catch (e) {
        console.log(e)
        this.isLoadPrevious = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.message {
  padding: 0 8px;
  max-height: 500px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &-time {
    text-align: center;
    font-size: 12px;
    color: #999898;
    margin-bottom: 18px;
  }
}

.more {
  margin-bottom: 16px;
  text-align: center;
  font-size: 13px;
}
</style>

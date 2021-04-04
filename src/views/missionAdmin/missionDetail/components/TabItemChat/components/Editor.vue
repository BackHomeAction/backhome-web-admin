<template>
  <div class="editor">
    <a-textarea
      v-model="text"
      placeholder="请输入内容..."
      :auto-size="{ minRows: 3, maxRows: 5 }"
    />
    <div class="actions">
      <a-icon
        type="file-image"
        @click="handleChooseImage"
        style="margin-top: 2px; margin-right: 8px; font-size: 20px; line-height: 24px; cursor: pointer; color: #999999"
      />
      <a-button type="primary" @click="handleSendText">发送</a-button>
    </div>

    <input
      ref="filElem"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleSendImage"
    />
  </div>
</template>

<script>
import IM from '@/services/im'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['currentMissionInfo'])
  },
  data () {
    return {
      text: '',
      im: IM.getInstance()
    }
  },
  methods: {
    async handleSendText () {
      try {
        await this.im.sendGroupTextMessage(this.currentMissionInfo.id, this.text)
        this.text = ''
      } catch (e) {
        console.log(e)
        this.$notification.error({
          message: '消息发送失败'
        })
      }
    },
    async handleChooseImage () {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    async handleSendImage () {
      try {
        await this.im.sendGroupImageMessage(this.currentMissionInfo.id, this.$refs.filElem)
      } catch (e) {
        console.log(e)
        this.$notification.error({
          message: '图片发送失败'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

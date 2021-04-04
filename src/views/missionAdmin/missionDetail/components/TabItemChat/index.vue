<template>
  <div class="chat">
    <message-list ref="list" />
    <a-divider />
    <editor />
  </div>
</template>

<script>
import MessageList from './components/MessageList.vue'
import Editor from './components/Editor.vue'

export default {
  components: {
    MessageList,
    Editor
  },
  methods: {
    scrollToBottom () {
      this.$refs.list.scrollToBottom()
    }
  }
}
</script>

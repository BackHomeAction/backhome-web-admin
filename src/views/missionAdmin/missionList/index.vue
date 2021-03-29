<template>
  <component @onView="handleView" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component>
</template>

<script>
// 动态切换组件
import List from './components/List'

export default {
  name: 'MissionList',
  components: {
    List
  },
  data () {
    return {
      currentComponet: 'List',
      record: ''
    }
  },
  created () {

  },
  methods: {
    handleView (record) {
      this.record = record || ''
      this.currentComponet = 'Info'
      console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    }
  },
  watch: {
    '$route.path' () {
      this.record = ''
      this.currentComponet = 'List'
    }
  }
}
</script>

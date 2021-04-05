<template>
  <component @onView="handleView" :record="record" :is="currentComponet"></component>
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
      this.$router.push({ path: '/missionAdmin/missionDetail', query: { id: record.id } })
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

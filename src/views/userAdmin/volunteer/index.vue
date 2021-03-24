<template>
  <component @onView="handleView" @onEdit="handleEdit" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component>
</template>

<script>
// 动态切换组件
import List from './components/List'
import Edit from './components/Edit'
import Info from './components/Info'

export default {
  name: 'VolunteerUserAdmin',
  components: {
    List,
    Edit,
    Info
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
    handleEdit (record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
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

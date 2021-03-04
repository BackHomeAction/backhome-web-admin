<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <component @onEdit="handleEdit" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 动态切换组件
import List from './components/List'
import Edit from './components/Edit'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

export default {
  name: 'VolunteerUserAdmin',
  components: {
    List,
    Edit,
    PageHeaderWrapper
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

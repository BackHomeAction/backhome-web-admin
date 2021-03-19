<template>
  <div>
    <component @create="handleCreate" @onGoBack="handleGoBack" :is="page"></component>
  </div>
</template>

<script>
// 动态切换组件
import List from '@/views/platformAdmin/announcement/component/List'
import newCreate from '@/views/platformAdmin/announcement/component/newCreate'
export default {
  name: 'Index',
  components: {
    List,
    newCreate
  },
  data () {
    return {
      page: 'newCreate'
    }
  },
  methods: {
    handleGoBack: function () {
      this.page = 'List'
    },
    handleCreate: function () {
      this.page = 'newCreate'
    }
  }
}
</script>

<template>
  <div>
    <component @toEdit="handleEdit" @onGoBack="handleGoBack" :is="page"></component>
  </div>
</template>

<script>
import List from '@/views/platformAdmin/Banner/component/List'
import Edit from '@/views/platformAdmin/Banner/component/Edit'
export default {
  name: 'Index',
  components: {
    List, Edit
  },
  data () {
    return {
      page: 'List'
    }
  },
  methods: {
    handleEdit: function () {
      this.page = 'Edit'
    },
    handleGoBack: function () {
      this.page = 'List'
    }
  }
}
</script>

<style scoped>

</style>

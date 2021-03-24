<template>
  <div>
    <component :is="page" @onCreate="getCreate" @onGoBack="getBacks"></component>
  </div>
</template>

<script>
import List from '@/views/platformAdmin/openOut/component/List'
import Edit from '@/views/platformAdmin/openOut/component/Edit'
export default {
  components: {
    List, Edit
  },
  data () {
    return {
      page: 'List'
    }
  },
  methods: {
    getBacks: function () {
      this.page = 'List'
    },
    getCreate: function () {
      this.page = 'Edit'
    }
  }
}
</script>

<style scoped>

</style>

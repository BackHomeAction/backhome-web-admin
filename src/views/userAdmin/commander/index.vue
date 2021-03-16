<template>
  <div>
    <component
      @onCreate="createPage"
      @onView="handleView"
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
      @onWatch="handleWatch"
      :is="page"></component>
  </div>
</template>

<script>
import List from '@/views/userAdmin/commander/components/List'
import watch from '@/views/userAdmin/commander/components/watch'
import edit from '@/views/userAdmin/commander/components/edit'
import createPage from '@/views/userAdmin/commander/components/createPage'
export default {
  components: {
    List, watch, edit, createPage
  },
  data () {
    return {
      page: 'List'
    }
  },
  methods: {
    handleView: function () {
      this.page = 'List'
    },
    handleEdit: function () {
      this.page = 'edit'
    },
    handleGoBack: function () {
      this.page = 'List'
    },
    handleWatch: function () {
      this.page = 'watch'
    },
    createPage: function () {
      this.page = 'createPage'
    }

  }
}
</script>

<style scoped>

</style>

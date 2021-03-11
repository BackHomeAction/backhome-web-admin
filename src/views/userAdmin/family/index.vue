<template>
  <div class="body">
    <component @onView="handleView" @onEdit="handleEdit" @onGoBack="handleGoBack" @onWatch="handleWatch" :is="page"></component>
  </div>
</template>

<script>
import Search from '@/views/userAdmin/family/components/Search'
import edit from '@/views/userAdmin/family/components/edit'
import watch from '@/views/userAdmin/family/components/watch'
export default {
  name: 'Family',
  components: {
    Search,
    edit,
    watch
  },
  data () {
    return {
      page: 'Search'
    }
  },
  methods: {
    handleView: function () {
      this.page = 'Search'
    },
    handleEdit: function () {
      this.page = 'edit'
    },
    handleGoBack: function () {
      this.page = 'Search'
    },
    handleWatch: function () {
      this.page = 'watch'
    }
  }
}
</script>

<style scoped>
 .body{
   margin: 0;
   padding: 0;
 }
</style>

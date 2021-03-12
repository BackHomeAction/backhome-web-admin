<template>
  <div class="body">
    <component
      @oldView="oldmanWatch"
      @onView="handleView"
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
      @onWatch="handleWatch"
      @oldEdit="oldmanEdit"
      :is="page"></component>
  </div>
</template>

<script>
import Search from '@/views/userAdmin/family/components/Search'
import edit from '@/views/userAdmin/family/components/edit'
import watch from '@/views/userAdmin/family/components/watch'
import oldManWatch from '@/views/userAdmin/family/components/oldManWatch'
import oldManEdit from '@/views/userAdmin/family/components/oldMandEdit'
export default {
  name: 'Family',
  components: {
    Search,
    edit,
    watch,
    oldManEdit,
    oldManWatch
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
    },
    oldmanWatch: function () {
      this.page = 'oldManWatch'
    },
    oldmanEdit: function () {
      this.page = 'oldManEdit'
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

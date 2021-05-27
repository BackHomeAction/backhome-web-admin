<template>
  <div>
    <component :is="page" @onEdit="changeEdit()" @onList="changeList()" />
  </div>
</template>

<script>
import List from './component/List'
import Edit from './component/Edit'
export default {
  components: {
    List, Edit
  },
  name: 'Index',
  data () {
    return {
      page: 'List'
    }
  },
  methods: {
    changeEdit () {
      this.page = 'Edit'
    },
    changeList () {
      this.page = 'List'
    }
  }
}
</script>

<style scoped>

</style>

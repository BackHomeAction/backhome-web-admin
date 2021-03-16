<template>
  <div>
    <div>missionList!</div>
    <a-card :bordered="false">
       <a-page-header>{{ id }}</a-page-header>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: this.$route.query.id
    }
  }
}
</script>

<style scoped>

</style>

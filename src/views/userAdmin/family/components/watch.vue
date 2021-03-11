<template>
  <div>
    <page-go-back-top @back="$emit('onGoBack')" />
    假装可以查看
  </div>
</template>

<script>
import PageGoBackTop from '@/components'

export default {
  components: {
    PageGoBackTop
  },
  name: 'Watch'
}
</script>

<style scoped>

</style>

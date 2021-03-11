<template>
  <div>
    <page-go-back-top @back="$emit('onGoBack')" />
    假装可以设置
  </div>
</template>

<script>
import PageGoBackTop from '@/components'
export default {
  components: {
    PageGoBackTop
  },
  name: 'Edit'
}
</script>

<style scoped>

</style>

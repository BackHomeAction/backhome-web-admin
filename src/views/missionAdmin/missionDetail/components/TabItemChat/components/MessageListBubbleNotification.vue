<template>
  <div class="body">
    <div
      v-if="data.type === TIM.TYPES.MSG_TEXT"
      class="wrapper"
    >
      {{ data.payload.text }}
    </div>
  </div>
</template>

<script lang="ts">
import TIM from 'tim-js-sdk'

export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return { TIM }
  }
}
</script>

<style lang="less" scoped>
.body {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;

  .wrapper {
    padding: 4px 8px;
    font-size: 12px;
    color: #ffffff;
    background-color: #c7c7c7;
    border-radius: 4px;
  }
}
</style>

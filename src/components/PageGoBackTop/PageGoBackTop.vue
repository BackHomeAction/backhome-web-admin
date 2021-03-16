<template>
  <div class="back">
    <div class="back-iconOut" @click="handleBack">
      <a-icon type="left" class="back-icon" />
      <span class="back-text">返回</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageGoBackTop',
  methods: {
    handleBack () {
      this.$emit('back')
    }
  }
}
</script>

<style lang="less" scoped>
.back {
  width: 100%;
  padding: 10px;
  border-bottom: 2px solid #f0f2f5;
  color: #999;
  box-sizing: border-box;
  margin-bottom: 24px;

  &-iconOut {
    width: 80px;
    cursor: pointer;
  }

  &-icon {
    margin-left: 3px;
    margin-right: 8px;
    font-size: 14px;
  }

  &-text {
    font-size: 15px;
  }
}
</style>

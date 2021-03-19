<template>
  <div>
    <a-card :bordered="false" >
      <div class="table-page-search-wrapper">
        <page-go-back-top @back="goBack" ><a><a-icon type="left" />返回</a></page-go-back-top>
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :span="8" :md="8" :sm="24" >
              <a-form-item label="标题:">
                <a-input v-model="announce.title" :placeholder="placeholder"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :span="8" :md="12" :sm="14" >
              <a-form-item label="发布对象" >
                <a-select v-model="announce.obj" placeholder="请选择" >
                  <a-select-option :value="1">家属</a-select-option>
                  <a-select-option :value="2">志愿者</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48" >
            <a-col :md="8" :sm="24">
              <p>假装这个是一个富文本编辑器</p>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-button @click="takeOut">
                发布
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
import { PageGoBackTop } from '@/components'
export default {
  data () {
    return {
      name: '返回',
      announce: {},
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      placeholder: '请输入'
    }
  },
  components: {
    PageGoBackTop
  },
  methods: {
    goBack: function () {
      console.log('111')
      this.$emit('onGoBack')
    },
    takeOut: function () {
      console.log(this.announce)
    }
  },
  name: 'NewCreate'
}
</script>

<style scoped>

</style>

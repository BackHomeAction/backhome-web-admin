<template>
  <div>

    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="18" style="display: flex;justify-content: center;align-items: center">
            <a-col :md="8" :sm="24">
              <a-form-item label="应用名称" required>
                <a-input v-model="app.name" :placeholder="placeholder"></a-input>
              </a-form-item>
              <a-form-item label="APP-ID" >
                <a-input v-model="app.id" :placeholder="placeholder"></a-input>
              </a-form-item>
              <a-form-item label="Access Key">
                <span><a-input v-model="app.key" :placeholder="placeholder"/><a-button>生成</a-button></span>
              </a-form-item>
              <a-form-item label="备注">
                <a-input v-model="app.more" :placeholder="placeholder"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-button>确定</a-button>
              <a-button style="margin-left: 3%">取消</a-button>
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
  name: 'Edit',
  data () {
    return {
      app: {},
      placeholder: '请输入'
    }
  },
  components: {
    PageGoBackTop
  }
}
</script>

<style scoped>

</style>

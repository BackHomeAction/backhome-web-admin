<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-row :gutter="32" type="flex" justify="center" style="margin-top: 10px">
        <a-col :md="12" :xl="14">
          <a-form :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-form-item label="姓名" required prop="name">
              <a-input :placeholder="placeholder" v-model="create.name"></a-input>
            </a-form-item>
            <a-form-item label="身份" required prop="identify">
              <a-select v-model="create.identify" placeholder="请选择" default-value="0" @change="originSelect">
                <a-select-option value="0">总指战员</a-select-option>
                <a-select-option value="1">区域指战员</a-select-option>
                <a-select-option value="2">系统管理员</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="showOrigin" label="地区">
              <region-selector v-model="create.region"></region-selector>
            </a-form-item>
            <a-form-item label="手机号" prop="phoneNum" required >
              <a-input :placeholder="placeholder" v-model="create.phone"/>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      <a-row :gutter="32" style="display: flex;justify-content: center;align-items: center">
        <a-col type="flex" justify="center">
          <a-button type="primary" @click="submit" style="margin-right: 160px;margin-left:">提交</a-button>
          <a-button type="danger" @click="deletes" >删除</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { RegionSelector, PageGoBackTop } from '@/components'
export default {
  name: 'CreatePage',
  components: {
    RegionSelector, PageGoBackTop
  },
  data () {
    return {
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请输入您的姓名' }
        ],
        identify: [
          { required: true, trigger: 'blur', message: '请选择您的身份' }
        ],
        phoneNum: [
          { required: true, pattern: '/0-9/', message: '请输入您的联系电话' }
        ]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      create: {},
      showOrigin: false,
      placeholder: '请输入'
    }
  },
  methods: {
    originSelect: function (value) {
      console.log(value)
      if (value === '1') {
        this.showOrigin = true
      } else {
        this.showOrigin = false
        // console.log(this.showOrigin)
      }
    },
    submit: function () {
      console.log(this.create)
    },
    deletes: function () {
      this.create = {}
    },
    goBack: function () {
      this.$emit('onGoBack')
    }
  }

}
</script>

<style scoped>

</style>

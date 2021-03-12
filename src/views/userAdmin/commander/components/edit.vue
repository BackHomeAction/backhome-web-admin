<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-row :gutter="32" type="flex" justify="center">
        <a-col :md="6" :xl="4" style="display: flex;flex-direction: column;align-items: center">
          <a-avatar :size="120" icon="user" />
          <br>
          <a-button type="default" style="margin-top:5px">更改图片</a-button>
        </a-col>
        <a-col :md="12" :xl="14">
          <a-form-model :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
            <a-form-model-item label="姓名" required prop="name">
              <a-input v-model="form.name" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="身份证号" required prop="idcard">
              <a-input v-model="form.idcard" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="手机号" prop="phone" v-if="record && record.id && record.volunteer">
              <a-input v-model="form.phone" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="地区" prop="region">
              <region-selector v-model="form.region" />
            </a-form-model-item>
            <a-form-model-item label="性别" prop="sex">
              <a-radio-group v-model="form.sex">
                <a-radio :value="1">
                  男
                </a-radio>
                <a-radio :value="2">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="状态" prop="state" >
              <a-radio-group v-model="form.state">
                <a-radio :value="1">
                  启用
                </a-radio>
                <a-radio :value="2">
                  停用
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="onSubmit" :loading="submitLoad">
                保存
              </a-button>
              <a-button type="danger" ghost style="margin-left: 10px;">
                删除
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>

    </a-card>
  </div>

</template>

<script>
import { PageGoBackTop, RegionSelector } from '@/components'
export default {
  data () {
    return {
      name: '123',
      submitLoad: false,
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ],
        idcard: [
          { required: true, trigger: 'blur' }
        ]
      },
      form: {
        name: '赵六',
        idcard: '666667777666677',
        phone: '4008-123-123',
        region: [],
        sex: 1,
        state: 1
      }
    }
  },
  components: {
    PageGoBackTop, RegionSelector
  },
  methods: {
    goBack: function () {
      console.log(1123)
      this.$emit('onGoBack')
    },
    onSubmit: function () {
      console.log(this.form)
    }
  },
  name: 'Edit'
}
</script>

<style scoped>

</style>

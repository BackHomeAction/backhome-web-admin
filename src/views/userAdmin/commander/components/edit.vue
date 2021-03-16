<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-row :gutter="32" type="flex" justify="center">
        <a-col :md="6" :xl="4" style="display: flex;flex-direction: column;align-items: center">
          <a-avatar :url="form.avatarUrl" :size="120" icon="user" />
          <br>
          <a-button type="default" style="margin-top:5px">更改图片</a-button>
        </a-col>
        <a-col :md="12" :xl="14">
          <a-form-model :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
            <a-form-model-item label="账号" required >
              <a-input v-model="form.userName" placeholder="请输入(登录账号)" />
            </a-form-model-item>
            <a-form-model-item label="姓名" required >
              <a-input v-model="form.name" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="身份" required>
              <a-select v-model="form.roleId" placeholder="请选择" @change="originSelect">
                <a-select-option :value="3">总指战员</a-select-option>
                <a-select-option :value="4">系统管理员</a-select-option>
                <a-select-option :value="5">区域指战员</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="地区" v-if="showOrigin">
              <region-selector v-model="regionPoxy" />
            </a-form-model-item>
            <a-form-model-item label="新密码" required>
              <a-input v-model="form.password" plceholder="请输入"></a-input>
            </a-form-model-item>
            <a-form-model-item label="性别">
              <a-radio-group v-model="form.sex">
                <a-radio :value="1">
                  男
                </a-radio>
                <a-radio :value="2">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="状态" >
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
    <a-modal v-model="visible" title="权限警告" @ok="handleOk">
      <p>系统管理员不得更改超级管理员信息!!!</p>
    </a-modal>
  </div>
</template>

<script>
import { PageGoBackTop, RegionSelector } from '@/components'
import { adminUpdate } from '@/api/admin'
export default {
  mounted () {
    this.form = this.$store.state.commander.editUser
    console.log(this.form)
    if ((this.$store.state.roleId === 4) && (this.form.roleId === 3)) {
      this.showModal()
    }
    this.originSelect(this.form.roleId)
    this.regionPoxyUse(this.form.province, this.form.city, this.form.district)
  },
  data () {
    return {
      visible: false,
      showOrigin: false,
      name: '123',
      submitLoad: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      adminBean: [],
      regionPoxy: [],
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ],
        idcard: [
          { required: true, trigger: 'blur' }
        ]
      },
      form: [
        {
          avatarUrl: ''
        }
      ]
    }
  },
  components: {
    PageGoBackTop, RegionSelector
  },
  methods: {
    handleOk: function () {
      this.visible = false
      this.$emit('onGoBack')
    },
    showModal () {
      this.visible = true
    },
    goBack: function () {
      console.log(1123)
      this.$emit('onGoBack')
    },
    onSubmit: function () {
      this.form.province = this.regionPoxy[0]
      this.form.district = this.regionPoxy[1]
      this.form.city = this.regionPoxy[2]
      this.adminBean = this.form
      var adminBean = this.adminBean
      adminUpdate({ adminBean }).then(res => {
        console.log(res)
      })
    },
    originSelect: function (value) {
      console.log(value)
      if (value === 5) {
        this.showOrigin = true
      } else {
        this.showOrigin = false
        // console.log(this.showOrigin)
      }
    },
    regionPoxyUse: function (provin, city, district) {
      this.regionPoxy = [provin, city, district]
    }
  },
  name: 'Edit'
}
</script>

<style scoped>

</style>

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
            <a-form-item label="密码" required prop="password">
              <a-input type="password" :placeholder="placeholder" v-model="create.password"></a-input>
            </a-form-item>
            <a-form-item label="身份" required prop="identify">
              <a-select v-model="create.identify" placeholder="请选择" @change="originSelect">
                <a-select-option value="3" >总指战员</a-select-option>
                <a-select-option value="4" >系统管理员</a-select-option>
                <a-select-option value="5" >区域指战员</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="showOrigin" label="地区">
              <region-selector v-model="create.region"></region-selector>
            </a-form-item>
            <a-form-item label="手机号">
              <a-input :placeholder="placeholder" v-model="create.phone"></a-input>
            </a-form-item>
            <a-form-item label="性别" prop="phoneNum" required >
              <a-radio-group name="radioGroup" v-model="create.sex">
                <a-radio :value="1">
                  男
                </a-radio>
                <a-radio :value="2">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      <a-row :gutter="32" style="display: flex;justify-content: center;align-items: center">
        <a-col type="flex" justify="center">
          <a-button type="primary" @click="submit()" style="margin-right: 160px;">提交</a-button>
          <a-button type="danger" @click="deletes" >删除</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { RegionSelector, PageGoBackTop } from '@/components'
import { adminCreate } from '@/api/admin'
export default {
  mounted () {
  },
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
      create: [],
      adminsBean: [],
      showOrigin: false,
      placeholder: '请输入'
    }
  },
  methods: {
    originSelect: function (value) {
      console.log(value)
      console.log(this.$store.state.roleId)
      if ((this.$store.state.roleId === 4) && value === '3') {
        this.$message.info('您的权限不够')
        this.create.identify = null
      }
      if (value === '5') {
        this.showOrigin = true
      } else {
        this.showOrigin = false
        // console.log(this.showOrigin)
      }
    },
    submit: function () {
      this.dataEdit()
      console.log('admin数值')
      console.log(this.adminsBean)
      var adminData = this.adminsBean
      if (((this.create.name) && (this.create.identify) && (this.create.phone) && (this.create.password))) {
        if (this.create.identify === 5) {
          if (!(this.create.region)) {
            adminCreate({ ...adminData }).then(res => {
              if (res.status === 200) {
                this.$notification.success({
                  message: '成功',
                  description: '创建成功!!!'
                })
              }
            })
          } else {
            this.$message.info('请将信息填写完整')
          }
        } else {
          adminCreate({ ...adminData }).then(res => {
            if (res.status === 200) {
              this.$notification.success({
                message: '成功',
                description: '创建成功!!!'
              })
            }
          })
        }
      } else {
        console.log(this.create)
        this.$message.info('请将信息填写完整')
      }
    },
    deletes: function () {
      this.create = []
    },
    goBack: function () {
      this.$emit('onGoBack')
    },
    dataEdit: function () {
      this.adminsBean.userName = this.create.name
      this.adminsBean.roleId = this.create.identify
      this.adminsBean.sex = this.create.sex
      this.adminsBean.state = 1
      this.adminsBean.password = this.create.password
      if (this.create.region) {
        this.adminsBean.province = this.create.region[0]
        this.adminsBean.district = this.create.region[1]
        this.adminsBean.city = this.create.region[2]
      }
    }
  }

}
</script>

<style scoped>

</style>

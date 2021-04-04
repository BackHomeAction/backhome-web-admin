<template>
  <div>
    <a-card :bordered="false">
      <a-spin :spinning="pageLoading">
        <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
        <a-row :gutter="32" type="flex" justify="center" style="margin-top: 10px">
          <a-col :md="12" :xl="14">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol" >
              <a-form-item label="账号" required prop="name">
                <a-input :placeholder="placeholder" v-model="create.name"></a-input>
              </a-form-item>
              <a-form-item label="密码" required prop="password">
                <a-input type="password" :placeholder="placeholder" v-model="create.password"></a-input>
              </a-form-item>
              <a-form-item label="身份" required prop="identify">
                <a-select v-model="create.roleId" placeholder="请选择" @change="originSelect">
                  <a-select-option value="3" >区域指战员</a-select-option>
                  <a-select-option value="4" >系统管理员</a-select-option>
                  <a-select-option value="5" >总指战员</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item v-if="showOrigin" required label="地区">
                <region-selector v-model="create.region"></region-selector>
              </a-form-item>
              <a-form-item label="手机号" required>
                <a-input :placeholder="placeholder" v-model="create.phone"></a-input>
              </a-form-item>
              <a-form-item label="性别" prop="phoneNum">
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
            <a-button type="primary" @click="submit" style="margin-right: 160px;">提交</a-button>
            <a-button type="danger" @click="deletes" >重填</a-button>
          </a-col>
        </a-row>
      </a-spin>
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
      pageLoading: false,
      adminsBean: [],
      showOrigin: false,
      placeholder: '请输入'
    }
  },
  methods: {
    originSelect: function (value) {
      console.log(value)
      console.log(this.$store.state.data.roleId)
      if ((this.$store.state.data.roleId === 4) && value === '3') {
        this.$message.info('您的权限不够')
        this.create.identify = null
      }
      if (value === '3') {
        this.showOrigin = true
      } else {
        this.showOrigin = false
      }
    },
    submit: function () {
      this.dataEdit()
      this.pageLoading = true
      const adminData = this.adminsBean
      if (((this.create.name) && (this.create.roleId) && (this.create.phone) && (this.create.password))) {
        if (this.create.roleId === 5) {
          if (!(this.create.region)) {
            console.log(adminData)
            adminCreate({ ...adminData }).then(res => {
              if (res.status === 200) {
                this.$notification.success({
                  message: '成功',
                  description: '创建成功!!!'
                })
                this.goBack()
              }
              this.pageLoading = false
            }).catch(res => {
              this.pageLoading = false
            })
          } else {
            this.$message.info('请将信息填写完整')
          }
        } else {
          console.log(this.create.roleId)
          adminCreate({ ...adminData }).then(res => {
            if (res.status === 200) {
              this.$notification.success({
                message: '成功',
                description: '创建成功!!!'
              })
              this.goBack()
            }
            this.pageLoading = false
          }).catch(res => {
            this.pageLoading = false
          })
        }
      } else {
        this.$message.error('请将必要信息填写完整')
        this.pageLoading = false
      }
    },
    deletes: function () {
      this.create = []
      this.showOrigin = false
    },
    goBack: function () {
      this.$emit('onGoBack')
    },
    dataEdit: function () {
      // 信息预处理器
      this.adminsBean.userName = this.create.name
      this.adminsBean.name = this.create.name
      this.adminsBean.roleId = parseInt(this.create.roleId)
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

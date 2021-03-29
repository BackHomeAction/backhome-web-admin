<template>
  <div>

    <a-card :bordered="false">
      <a-spin :spinning="loadingPage">
        <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
        <a-row :gutter="32" type="flex" justify="center">
          <a-col :md="6" :xl="4" style="display: flex;flex-direction: column;align-items: center">
            <a-avatar :url="form.avatarUrl" :size="120" icon="user" />
            <br>
            <a-button type="default" style="margin-top:5px" @click="showAvatarUploader = true" :loading="isChangingAvatar">更改头像</a-button>
          </a-col>
          <a-col :md="12" :xl="14">
            <a-form-model :model="form[0]" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
              <a-form-model-item label="账号" required >
                <a-input v-model="form.userName" placeholder="请输入(登录账号)" />
              </a-form-model-item>
              <a-form-model-item label="姓名" required >
                <a-input v-model="form.name" placeholder="请输入" />
              </a-form-model-item>
              <a-form-model-item label="身份" required>
                <a-select v-model="form.roleId" placeholder="请选择" @change="originSelect">
                  <a-select-option :value="3">区域指战员</a-select-option>
                  <a-select-option :value="4">系统指战员</a-select-option>
                  <a-select-option :value="5">总指战员</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="地区" v-if="showOrigin">
                <region-selector v-model="regionPoxy" />
              </a-form-model-item>
              <a-form-model-item label="新密码">
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
                <a-button type="danger" ghost style="margin-left: 10px;" @click="modals">
                  删除
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-col>
        </a-row>
      </a-spin>
    </a-card>
    <a-modal :visible="visibles" title="删除提醒" @ok="deleteAdmin" @cancel="cancel">
      <p>您确定要删除ID为{{ '' + form.id+ '' }}的指战员么?</p>
    </a-modal>
    <a-modal :visible="changeVis" title="删除提醒" @ok="passwordNochange" @cancel="cancel">
      <p>您没有输入新密码，是否继续?</p>
    </a-modal>
    <image-cropper v-model="showAvatarUploader" @success="handleAvataruploaded" />
  </div>
</template>

<script>
import { PageGoBackTop, RegionSelector, ImageCropper } from '@/components'
import { adminUpdate, adminAvaratChange, adminDelete } from '@/api/admin'
export default {
  mounted () {
    this.form = this.$store.state.data.commander.editUser
    if (this.form.roleId === 3) {
      this.showOrigin = false
    }
    console.log(this.form)
    if ((this.$store.state.data.roleId === 4) && (this.form.roleId === 3)) {
      this.showModal()
    }
    this.originSelect(this.form.roleId)
    this.regionPoxyUse(this.form.province, this.form.city, this.form.district)
  },
  data () {
    return {
      changeVis: false,
      loadingPage: false,
      visibles: false,
      showOrigin: false,
      showAvatarUploader: false,
      isChangingAvatar: false,
      name: '123',
      submitLoad: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      adminBean: [],
      regionPoxy: [],
      form: []
    }
  },
  components: {
    PageGoBackTop, RegionSelector, ImageCropper
  },
  methods: {
    async handleAvataruploaded (url) {
      this.isChangingAvatar = true
      try {
        await adminAvaratChange({
          id: this.form.id,
          avatarUrl: url
        })
        this.form.avatarUrl = url
        console.log(url)
        console.log('我的URL')
        this.loadingPage = true
        console.log(this.form.avatarUrl)
        this.$notification.success({
          message: '成功',
          description: `更换头像成功`
        })
      } catch (e) {
        console.log(e)
      }
      this.isChangingAvatar = false
      this.loadingPage = false
    },
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
    cancel: function () {
      this.visibles = false
      this.changeVis = false
    },
    onSubmit: function () {
      if (this.form.userName !== '' && this.form.name !== '') {
        if (this.form.roleId === 3) {
          if (this.regionPoxy[0] !== null) {
            this.loadingPage = true
            this.form.province = this.regionPoxy[0]
            this.form.district = this.regionPoxy[1]
            this.form.city = this.regionPoxy[2]
            this.form.id = parseInt(this.form.id)
            this.adminBean = this.form
            const adminBean = this.adminBean
            if (!this.form.password) {
              delete adminBean.password
            }
            adminUpdate({ ...adminBean, roleId: this.$store.state.user.info.roleId }).then(res => {
              console.log(res)
              if (res.status === 200) {
                this.$notification.success({
                  message: '成功',
                  description: '保存成功!'
                })
                this.goBack()
              }
              this.loadingPage = false
            }).catch(res => {
              this.loadingPage = false
            })
          } else {
            this.$notification.error({
              message: '地区选择有误',
              description: '区域指战员必须选择指站区域!'
            })
          }
        } else {
          this.loadingPage = true
          this.form.province = this.regionPoxy[0]
          this.form.district = this.regionPoxy[1]
          this.form.city = this.regionPoxy[2]
          this.form.id = parseInt(this.form.id)
          this.adminBean = this.form
          const adminBean = this.adminBean
          adminUpdate({ ...adminBean, roleId: this.$store.state.user.info.roleId }).then(res => {
            console.log(res)
            if (res.status === 200) {
              this.$notification.success({
                message: '成功',
                description: '保存成功!'
              })
            }
            this.goBack()
          }).catch(res => {
            this.loadingPage = false
          })
        }
      } else {
        this.$notification.error({
          message: '信息不全',
          description: '请您补全必填项项目!'
        })
      }
    },
    originSelect: function (value) {
      // console.log(value)
      this.showOrigin = value === 3
    },
    regionPoxyUse: function (provin, city, district) {
      this.regionPoxy = [provin, city, district]
    },
    deleteAdmin: function () {
      this.visibles = true
      this.loadingPage = true
      adminDelete({ id: this.form.id }).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '删除成功'
          })
          this.visibles = false
          this.$emit('onGoBack')
        } else {
          this.$notification.error({
            message: '失败',
            description: '删除失败，请联系管理员'
          })
        }
        this.loadingPage = false
      }).catch(res => {
        console.log(res)
        this.loadingPage = false
      })
    },
    modals: function () {
      this.visibles = true
    },
    passwordNochange: function () {
      this.form.password = this.$store.state.data.commander.editUser.password
      this.changeVis = false
      this.loadingPage = true
      this.form.province = this.regionPoxy[0]
      this.form.district = this.regionPoxy[1]
      this.form.city = this.regionPoxy[2]
      this.form.id = parseInt(this.form.id)
      this.adminBean = this.form
      var adminBean = this.adminBean
      adminUpdate({ ...adminBean, roleId: this.$store.state.user.info.roleId }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '保存成功!'
          })
        }
        this.loadingPage = false
        this.goBack()
      }).catch(res => {
        this.pageLoading = false
      })
    }
  },
  name: 'Edit'
}
</script>

<style scoped>

</style>

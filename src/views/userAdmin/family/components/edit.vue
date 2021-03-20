<template>
  <div>
    <a-card :bordered="false">
      <a-spin :spinning="loadings">
        <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
        <a-row :gutter="32" type="flex" justify="center">
          <a-col :md="6" :xl="4" style="display: flex;flex-direction: column;align-items: center">
            <a-avatar :src="form.avatarUrl" :size="120" icon="user" />
            <br>
            <a-button type="default" style="margin-top:5px" @click="showAvatarUploader = true" :loading="isChangingAvatar">更改头像</a-button>
          </a-col>
          <a-col :md="12" :xl="14">
            <a-form-model :model="form[0]" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" >
              <a-form-model-item label="姓名" required prop="name">
                <a-input v-model="form.name" placeholder="请输入" />
              </a-form-model-item>
              <a-form-model-item label="昵称" prop="name">
                <a-input v-model="form.nickName" placeholder="请输入" />
              </a-form-model-item>
              <a-form-model-item label="手机号" prop="phone" required >
                <a-input v-model="form.phone" placeholder="请输入" />
              </a-form-model-item>
              <a-form-model-item label="地区" prop="region" required>
                <region-selector v-model="regionProxy" />
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
                <a-button type="danger" @click="modals" ghost style="margin-left: 10px;" >
                  删除
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-col>
        </a-row>
      </a-spin>
    </a-card>
    <image-cropper v-model="showAvatarUploader" @success="handleAvataruploaded" />
    <a-modal :visible="visibles" title="删除提醒" @ok="deleteFam" @cancel="visibles = false">
      <p>您确定要删除姓名为{{ '' + ' ' +form.name+ ' ' +'' }}的家属么?</p>
    </a-modal>
  </div>

</template>

<script>
import { PageGoBackTop, RegionSelector, ImageCropper } from '@/components'
import { familyDataChange, familyChangeAvarat, familyDelete } from '@/api/familyData'

export default {
  mounted () {
    this.dataList()
  },
  data () {
    return {
      visibles: false,
      regionProxy: [],
      submitLoad: false,
      loadings: false,
      isChangingAvatar: false,
      showAvatarUploader: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ],
        idcard: [
          { required: true, trigger: 'blur' }
        ]
      },
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
        await familyChangeAvarat({
          id: this.form.id,
          avatarUrl: url
        })
        this.form.avatarUrl = url
        this.$notification.success({
          message: '成功',
          description: `更换头像成功`
        })
      } catch (e) {
        console.log(e)
      }
      this.isChangingAvatar = false
    },
    goBack: function () {
      console.log(1123)
      this.$emit('onGoBack')
    },
    onSubmit: function () {
      this.loadings = true
      if (this.regionProxy === []) {
        this.$message.info('家属地区不能为空!')
        this.loadings = false
      } else {
        this.form.province = this.regionProxy[0]
        this.form.district = this.regionProxy[1]
        this.form.city = this.regionProxy[2]
        var family = this.form
        familyDataChange({
          ...family,
          id: this.form.id
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.$notification.success({
              message: '成功',
              description: '即将返回列表'
            })
            this.$emit('onView')
            this.loadings = false
          } else {
            this.$notification.error({
              message: '错误',
              description: '请检查服务器或联系管理员'
            })
            this.loadings = false
          }
        })
      }
    },
    dataList: function () {
      this.loadings = true
      this.form = this.$store.state.data.familyData.editUser
      console.log(this.form)
      this.regionProxy[0] = this.form.province
      this.regionProxy[1] = this.form.district
      this.regionProxy[2] = this.form.city
      if (this.form.province === null) {
        this.regionProxy = []
      }
      this.loadings = false
    },
    deleteFam: function () {
      this.visibles = true
      familyDelete({
        familyId: this.form.id
      }).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '已成功删除'
          })
          this.visibles = false
          this.$emit('onGoBack')
        } else {
          this.$notification.error({
            message: '错误',
            description: '删除失败，请联系管理员'
          })
          this.visibles = false
        }
      })
    },
    modals: function () {
      this.loadings = true
      if ((this.form.name !== '' || this.form.name !== null) && (this.regionProxy !== '' || this.regionProxy !== null) && (this.form.phone !== '' || this.form.phone !== null)) {
        this.visibles = true
        this.loadings = false
      } else {
        this.$notification.error({
          message: '信息不全',
          description: '请您补全必填项项目!'
        })
        this.loadings = false
      }
    }
  },
  name: 'Edit'
}
</script>

<style scoped>

</style>

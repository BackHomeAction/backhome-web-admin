<template>
  <div>
    <a-card :bordered="false">
      <a-spin :spinning="isLoading">
        <page-go-back-top @back="$emit('onGoBack')" />
        <a-row :gutter="32" type="flex" justify="center">
          <a-col v-if="record && record.id && record.volunteer" :md="6" :xl="4" style="display: flex; flex-direction: column; align-items: center">
            <a-avatar :size="120" :src="form.avatarUrl" />
            <a-button style="margin-top: 30px;" @click="showAvatarUploader = true" :loading="isChangingAvatar">
              更换头像
            </a-button>
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
              <a-form-model-item label="状态" prop="state" v-if="record && record.id && record.volunteer">
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
                <a-button type="primary" @click="onSubmit" :loading="isSubmitting">
                  保存
                </a-button>
                <a-button @click="visibles = true" type="danger" ghost style="margin-left: 10px;" v-if="record && record.id">
                  删除
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-col>
        </a-row>

        <image-cropper v-model="showAvatarUploader" @success="handleAvataruploaded" />
      </a-spin>
    </a-card>
    <a-modal :visible="visibles" title="删除提醒" @ok="deleteVolen" @cancel="stopShow">
      <p>您确定要删除ID为{{ '' + record.id+ '' }}的志愿者么?</p>
    </a-modal>
  </div>
</template>

<script>
import { PageGoBackTop, RegionSelector, ImageCropper } from '@/components'
import { getVolunteerByID, addVolunteer, editVolunteer, changeVolunteerAvatar, volDelete } from '@/api/volunteerAdmin'
export default {
  name: 'VolunteerUserAdminEdit',
  props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
  components: { PageGoBackTop, RegionSelector, ImageCropper },
  data () {
    return {
      visibles: false,
      isLoading: false,
      isSubmitting: false,
      isChangingAvatar: false,
      showAvatarUploader: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        avatarUrl: '',
        name: '',
        idcard: '',
        phone: '',
        region: undefined,
        sex: undefined,
        state: 1
      },
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ],
        idcard: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    stopShow: function () {
      this.visibles = false
    },
    deleteVolen: function () {
      this.visibles = true
      volDelete({
        volunteerId: this.record.id
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '已成功删除'
          })
          this.visibles = false
          this.$emit('onGoBack')
        }
      }).catch(res => {
        this.visibles = false
      })
    },
    async onSubmit () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return false
        }

        const submitForm = {}
        submitForm.name = this.form.name
        submitForm.idcard = this.form.idcard
        this.form.sex && (submitForm.sex = this.form.sex)
        if (this.form.region) {
          submitForm.province = this.form.region[0]
          submitForm.city = this.form.region[1]
          submitForm.district = this.form.region[2]
        }
        if (this.record && this.record.id && this.record.volunteer) {
          submitForm.volunteer = {}
          this.form.phone && (submitForm.volunteer.phone = this.form.phone)
          submitForm.volunteer.state = this.form.state
        }

        console.log(submitForm)

        this.isSubmitting = true
        try {
          if (this.record && this.record.id) {
            // edit
            await editVolunteer({ id: this.record.id, ...submitForm })
          } else {
            // add
            await addVolunteer(submitForm)
          }
          this.$notification.success({
            message: '成功',
            description: `保存成功`
          })
          this.$emit('onGoBack')
        } catch (e) {
          console.log(e)
        }
        this.isSubmitting = false
      })
    },
    async handleAvataruploaded (url) {
      this.isChangingAvatar = true
      try {
        await changeVolunteerAvatar({
          id: this.record.id,
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
    }
  },
  mounted () {
    this.$nextTick(async () => {
      if (this.record && this.record.id) {
        this.isLoading = true
        try {
          const { id } = this.record
          const { data } = await getVolunteerByID({ id })
          if (data.volunteer) {
            this.form.avatarUrl = data.volunteer.avatarUrl
            this.form.state = data.volunteer.state
            this.form.phone = data.volunteer.phone
          }
          this.form.name = data.name
          this.form.idcard = data.idcard
          this.form.sex = data.sex
          if (data.province && data.city && data.district) {
            this.form.region = [data.province, data.city, data.district]
          }
          console.log(this.form)
        } catch (e) {
          console.log(e)
          this.$emit('onGoBack')
        }
        this.isLoading = false
      }
    })
  }
}
</script>

<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-form-model layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :model="datas[0]" >
        <a-row :gutter="48" style="display: flex;justify-content: center;align-items: center">
          <a-col :span="12" >
            <a-form-model-item label="对应公告" >
              <a-input v-model="datas.title" :placeholder="placeholder"></a-input>
            </a-form-model-item>
            <a-form-model-item label="公告详情" v-if="state===1">
              <a-input v-model="datas.description" :placeholder="placeholder"></a-input>
            </a-form-model-item>
            <a-form-model-item label="Banner 图片" >
              <a-button @click="showPhoto" :loading="photoLoad"><a-icon type="arrow-up" />上传图片</a-button>
              <br>
              <div style="margin-top:15px">
                <a-avatar v-if="!(datas.url)" @click="showPhoto" shape="square" :size="260" :src="datas.url" ><a-icon type="plus"/>点击上传</a-avatar>
                <a-avatar v-if="datas.url" shape="square" :size="260" :src="datas.url" />
              </div>
            </a-form-model-item>
            <a-form-model-item label=" ">
              <a-button type="primary" @click="editSure" :loading="loadings" style="margin-right: 20px">
                保存
              </a-button>
              <a-button type="danger" ghost style="margin-left: 20px;" @click="deleteAll">
                删除
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <image-cropper v-model="getPhoto" @success="handleAvataruploaded"></image-cropper>
  </div>
</template>

<script>
import { PageGoBackTop, ImageCropper } from '@/components'
import { bannerChange, announceSearchGet, bannerCreate } from '@/api/announce'

export default {
  mounted () {
    this.getData()
  },
  data () {
    return {
      name: '返回',
      announce: {},
      loadings: false,
      state: 1,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      placeholder: '请输入',
      getPhoto: false,
      datas: [],
      photoLoad: false
    }
  },
  components: {
    PageGoBackTop, ImageCropper
  },
  methods: {
    goBack: function () {
      this.$emit('onGoBack')
    },
    takeOut: function () {
      console.log(this.announce)
    },
    showPhoto: function () {
      this.getPhoto = true
    },
    editSure: function () {
      if ((this.datas.title !== '' || this.datas.title !== null) && (this.datas.url !== '' || this.datas.url !== null) && this.state === 2) {
        const banner = this.datas
        bannerChange({ ...banner }).then(res => {
          console.log(res.status)
          if (res.status === 200) {
            this.$notification.success({
              message: '成功',
              description: '更改成功'
            })
          }
        })
      } else {
        this.$notification.error({
          message: '失败',
          description: '更改失败，请联系管理员'
        })
      }
      if (this.state === 1) {
        if ((this.datas.title !== '' || this.datas.title !== null) && (this.datas.url !== '' || this.datas.url !== null) && (this.datas.description !== '' || this.datas.description !== null)) {
          this.noticeIdSearch(this.datas.title)
          this.datas.publisher = this.$store.state.user.name
          const banner = this.datas
          bannerCreate({ ...banner }).then(res => {
            if (res.status === 200) {
              this.$notification.success({
                message: '成功',
                description: '新增成功'
              })
            } else {
              this.$notification.error({
                message: '失败',
                description: '新增失败，请联系管理员'
              })
            }
          })
        }
      }
    },
    deleteAll: function () {
      if (this.state === 1) {
        this.datas = []
      }
      if (this.state === 2) {
        this.datas = []
        this.datas = this.$store.state.data.banner.bannerEdit
      }
    },
    getData: function () {
      this.datas = this.$store.state.data.banner.bannerEdit
      this.state = this.$store.state.data.banner.state
    },
    async handleAvataruploaded (url) {
      this.photoLoad = true
      if (url) {
        this.datas.url = url
        console.log('这个URL就是' + url)
        this.$notification.success({
          message: '成功',
          description: '上传成功'
        })
      }
      this.photoLoad = false
    },
    noticeIdSearch: function (titles) {
      if (this.state === 1 && this.datas.title) {
        announceSearchGet({
          title: titles
        }).then(res => {
          console.log('查询公告成功')
          console.log(res)
          // this.datas.roleId = res.data
        })
      }
    }
  },
  name: 'NewCreate'
}
</script>

<style scoped>

</style>

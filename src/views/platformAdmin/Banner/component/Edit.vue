<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-spin :spinning="pageLoading">
        <a-form-model layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :model="datas[0]" >
          <a-row :gutter="48" style="display: flex;justify-content: center;align-items: center">
            <a-col :span="12" >
              <a-form-model-item v-if="state === 1" label="对应公告" has-feedback :validate-status="getInputShow" help="匹配到多个公告或公告不存在">
                <a-input v-model="datas.title" :placeholder="placeholder" @change="noticeIdSearch"></a-input>
              </a-form-model-item>
              <a-form-model-item v-if="state === 2" label="对应公告" >
                <a-input v-model="datas.title" :placeholder="placeholder" @change="noticeIdSearch"></a-input>
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
                <a-button v-if="state === 2" type="primary" @click="editSure" :loading="loadings" style="margin-right: 20px">
                  保存
                </a-button>
                <a-button v-if="state === 1" type="primary" @click="newCreates" :loading="loadings" style="margin-right: 20px">
                  新建
                </a-button>
                <a-button type="danger" ghost style="margin-left: 20px;" @click="deleteAll">
                  重置
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
    </a-card>
    <image-cropper v-model="getPhoto" @success="handleAvataruploaded"></image-cropper>
  </div>
</template>

<script>
import { PageGoBackTop, ImageCropper } from '@/components'
import { bannerChange, bannerCreate, listSearch } from '@/api/announce'

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
      getInputShow: 'error',
      pageLoading: false,
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
      if (this.noticeIds && this.state === 1) {
        this.getPhoto = true
      } else {
        this.$message.info('未查询到相应公告，请检查您的公告标题')
      }
      if (this.state === 2) {
        this.getPhoto = true
      }
    },
    newCreates: function () {
      const banner = this.datas
      this.pageLoading = true
      bannerCreate({ ...banner, noticeId: this.noticeIds }).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '新建成功'
          })
          this.goBack()
        }
        this.pageLoading = false
      })
    },
    editSure: function () {
      if (this.datas.title !== '' && this.datas.url !== '' && this.state === 2) {
        this.pageLoading = true
        const banner = this.datas
        console.log(banner)
        bannerChange({ ...banner }).then(res => {
          if (res.status === 200) {
            console.log(res)
            this.$emit('onGoBack')
          }
          this.pageLoading = false
        })
      } else {
        this.$notification.error({
          message: '失败',
          description: '信息不全'
        })
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
        console.log('URL:' + url)
        this.$notification.success({
          message: '成功',
          description: '上传成功'
        })
      }
      this.photoLoad = false
    },
    noticeIdSearch: function (titles) {
      if (this.state === 1 && this.datas.title) {
        // const search = this.datas
        listSearch({
          title: this.datas.title
        }).then(res => {
          if (res.data.data[0] && !(res.data.data[1]) && (this.datas.title === res.data.data[0].title)) {
            this.noticeIds = res.data.data[0].id
            this.getInputShow = 'success'
          } else {
            this.getInputShow = 'error'
            this.noticeIds = ''
          }
        })
      }
    }
  },
  name: 'NewCreate'
}
</script>

<style scoped>

</style>

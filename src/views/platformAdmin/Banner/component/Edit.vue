<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-spin :spinning="pageLoading">
        <a-form-model layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :model="datas[0]" >
          <a-row :gutter="48" style="display: flex;justify-content: center;align-items: center">
            <a-col :span="12" >
              <a-form-model-item label="对应公告">
                <a-select
                  show-search
                  :show-arrow="false"
                  placeholder="请输入公告标题关键词"
                  v-model="datas.title"
                  @search="noticeIdSearch"
                  @select="chooseSelect"
                  :defaultOpen="false"
                  :open="openSelect"
                  @blur="openSelect = false">
                  <a-select-option v-for="(item, key) in dataListScource" :key="key" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="Banner 图片" >
                <a-upload
                  name="photo"
                  :multiple="true"
                  :action="uploadUrl"
                  :headers="headers"
                  @change="handleImageChange"
                >
                  <a-button><a-icon type="arrow-up" />上传图片</a-button>
                </a-upload>
                <br>
                <div style="margin-top:15px">
                  <img class="image-preview" v-if="datas.url" :src="datas.url" />
                </div>
              </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
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
  </div>
</template>

<script>
import { PageGoBackTop } from '@/components'
import { bannerChange, bannerCreate, listSearch } from '@/api/announce'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  mounted () {
    this.getData()
  },
  computed: {
    headers () {
      const token = storage.get(ACCESS_TOKEN)
      return {
        Authorization: `Bearer ${token}`
      }
    },
    uploadUrl () {
      return process.env.VUE_APP_API_BASE_URL + '/admin/photo'
    }
  },
  data () {
    return {
      name: '返回',
      announce: {},
      loadings: false,
      state: 1,
      dataListScource: [],
      pageLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      placeholder: '请输入',
      datas: {
        url: ''
      },
      noticeId: '',
      openSelect: false
    }
  },
  components: {
    PageGoBackTop
  },
  methods: {
    goBack: function () {
      this.$emit('onGoBack')
    },
    newCreates: function () {
      const banner = this.datas
      this.pageLoading = true
      bannerCreate({ ...banner, noticeId: this.noticeId }).then(res => {
        this.$notification.success({
          message: '成功',
          description: '新建成功'
        })
        this.goBack()
      }).finally(() => {
        this.pageLoading = false
      })
    },
    editSure: function () {
      if (this.datas.title !== '' && this.datas.url !== '' && this.state === 2) {
        this.pageLoading = true
        const banner = this.datas
        bannerChange({ ...banner }).then(() => {
          this.$emit('onGoBack')
        }).finally(() => {
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
        this.datas = {}
      }
      if (this.state === 2) {
        this.datas = {}
        this.datas = this.$store.state.data.banner.bannerEdit
      }
    },
    getData: function () {
      this.state = this.$store.state.data.banner.state
      if (this.state === 2) {
        this.datas = this.$store.state.data.banner.bannerEdit
      }
    },
    handleImageChange (res) {
      if (!res.file.response) return

      console.log(res.file.response.data)
      this.datas.url = res.file.response.data
      console.log(this.datas.url)
    },
    // async handleAvataruploaded (url) {
    //   this.photoLoad = true
    //   if (url) {
    //     this.datas.url = url
    //     console.log('URL:' + url)
    //     this.$notification.success({
    //       message: '成功',
    //       description: '上传成功'
    //     })
    //   }
    //   this.photoLoad = false
    // },
    noticeIdSearch: function (titles) {
      if (titles) {
        listSearch({
          title: titles
        }).then(res => {
          this.dataListScource = []
          for (var i = 0; i < res.data.totalCount; i++) {
            this.dataListScource[i] = res.data.data[i].title
          }
          if (this.dataListScource) {
            this.openSelect = true
          }
        })
      }
    },
    chooseSelect: function (titles) {
      this.datas.title = titles
      listSearch({
        title: titles
      }).then(res => {
        this.noticeId = res.data.data[0].id
        console.log(this.noticeId)
      }).catch(res => {
        console.log(res)
      })
    }
  },
  name: 'NewCreate'
}
</script>

<style scoped>
.image-preview {
  max-width: 100%;
}
</style>

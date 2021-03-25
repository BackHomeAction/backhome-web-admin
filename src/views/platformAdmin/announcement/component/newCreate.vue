<template>
  <div>
    <a-card :bordered="false" >
      <a-spin :spinning="loadings">
        <div class="table-page-search-wrapper">
          <page-go-back-top @back="goBack" ><a><a-icon type="left" />返回</a></page-go-back-top>
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :span="24">
                <a-form-item label="标题:">
                  <a-input v-model="announce.title" :placeholder="placeholder"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48" style="z-index: 20;position:relative">
              <a-col :span="6" >
                <a-form-item label="是否展示?" >
                  <a-select v-model="announce.display" placeholder="请选择" >
                    <a-select-option :value="1">展示</a-select-option>
                    <a-select-option :value="2">不展示</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="发布对象" >
                  <a-select v-model="announce.roleId" placeholder="请选择" >
                    <a-select-option :value="1">家属</a-select-option>
                    <a-select-option :value="2">志愿者</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="z-index:1;position: relative" :gutter="48" >
              <a-col :span="24">
                <div id="demo" style="height: 100%;width: 100%;"></div>
              </a-col>
            </a-row>
            <a-row style="margin-top: 10px;">
              <a-col>
                <div class="table-operator">
                  <a-button v-if="state === 1" type="primary" @click="editOut">
                    发布
                  </a-button>
                </div>
                <div class="table-operator">
                  <a-button v-if="state === 2" type="primary" @click="takeOut">
                    保存
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-spin>
    </a-card>
    <image-cropper v-model="showPhoto" @success="handleAvataruploaded" />
  </div>
</template>

<script>
import { PageGoBackTop, ImageCropper } from '@/components'
import { announceCreate, announceEdit } from '@/api/announce'
import WangEditor from 'wangeditor'
import { axios } from '@/utils/request'
export default {
  mounted () {
    this.getDatas()
    const editor = new WangEditor('#demo')
    editor.config.onchange = (newHtml) => {
      this.announce.content = newHtml
      console.log(this.announce.content)
    }
    editor.config.onchangeTimeout = 200
    if (this.state === 2) {
      editor.txt.html(this.announce.content)
    }
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      const file = resultFiles
      const param = new FormData() // 创建form对象
      param.name = file.name// 通过append向form对象添加数据
      // param.append('chunk','0');//添加form表单中其他数据
      // console.log(param.get('tweetPic')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      } // 添加请求头
      axios.post('https://fwwb2020-app-volunteer.tgucsdn.com/admin/photo', param, config)
        .then(response => {
          console.log(response)
        })
    }
    editor.create()
  },
  data () {
    return {
      name: '返回',
      editor: null,
      editorData: '',
      imageUrl: '',
      showPhoto: false,
      announce: [{
        title: '',
        roleId: '',
        content: ''
      }],
      contents: '',
      state: '',
      loadings: false,
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      placeholder: '请输入'
    }
  },
  components: {
    PageGoBackTop, ImageCropper
  },
  methods: {
    getPhoto: function () {
      console.log(1)
    },
    editOut: function () {
      this.loadings = true
      const notice = this.announce
      announceCreate({
        ...notice
      }).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '创建成功'
          })
        }
        this.loadings = false
        this.goBack()
      }).catch(res => {
        console.log(res)
        this.loadings = false
      })
    },
    getNewOffers: function (text) {
      console.log(text)
      this.announce.content = text
    },
    goBack: function () {
      console.log('111')
      this.$emit('onGoBack')
    },
    takeOut: function () {
      this.loadings = true
      const notice = this.announce
      console.log(this.announce)
      announceEdit({
        ...notice
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '保存成功'
          })
          this.goBack()
        }
        this.loadings = false
      }).catch(res => {
        this.loadings = false
      })
    },
    handleAvataruploaded (url) {
      this.imageUrl = url
    },
    getDatas: function () {
      this.announce = this.$store.state.data.announce.announceEdit
      this.state = this.$store.state.data.announce.state
      console.log(this.state)
      console.log(this.announce)
    }
  },
  name: 'NewCreate'
}
</script>

<style scoped>

</style>

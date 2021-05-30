<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-form-model layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :model="datas[0]">
        <a-row :gutter="48" style="display: flex;justify-content: center;align-items: center">
          <a-col :span="15" >
            <a-spin :spinning="loadings">
              <a-form-model-item label="备忘标题" required>
                <a-input v-model="datas.title" :placeholder="placeholder" ></a-input>
              </a-form-model-item>
              <a-form-model-item label="备忘内容" required>
                <a-textarea
                  v-model="datas.content"
                  placeholder="Controlled autosize"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-model-item>
              <a-form-model-item label="备忘照片">
                <a-button @click="() => {showAvatarUploader = true}" ><a-icon type="arrow-up"/>上传图片</a-button>
              </a-form-model-item>
              <div style="margin-bottom: 8px;margin-top: -5px;display: flex;flex:0;">
                <div style="margin-left: 2px;margin-right: 2px" v-for="(src, index) in img" :rowKey="index" :key="index">
                  <a-avatar v-viewer :src="src" :size="150" shape="square" ></a-avatar>
                </div>
              </div>
              <a-form-model-item :wrapper-col="{ span: 14, offset: 5 }">
                <a-button v-if="$store.state.data.memoryControl" @click="changeMemory" type="primary" style="margin-right: 20px">
                  保存
                </a-button>
                <a-button v-if="!$store.state.data.memoryControl" @click="createMem" type="primary" style="margin-right: 20px">
                  新建
                </a-button>
                <a-button @click="toFirst" type="danger" ghost style="margin-left: 20px;" >
                  重置
                </a-button>
              </a-form-model-item>
            </a-spin>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <image-cropper v-model="showAvatarUploader" @success="handleAvataruploaded" />
  </div>
</template>

<script>
import { PageGoBackTop, ImageCropper } from '@/components'
import { addMemory, changeMemory } from '@/api/memory'
export default {
  mounted () {
    if (this.$store.state.data.memoryControl === 0) {
      this.datas = {}
    }
    if (this.$store.state.data.memoryControl === 1) {
      this.datas = { ...this.$store.state.data.memoryData }
      this.saves = { ...this.datas }
      if (this.datas.isGlobal === 2) { this.idshow = true }
      if (this.datas.imgUrl) {
        for (var c = 0; c < JSON.parse(this.datas.imgUrl).length; c++) {
          this.img[c] = JSON.parse(this.datas.imgUrl)[c]
        }
      }
    }
  },
  name: 'Edit',
  data () {
    return {
      datas: {},
      img: [],
      saves: {},
      loadings: false,
      placeholder: '请输入',
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      showAvatarUploader: false
    }
  },
  components: {
    PageGoBackTop, ImageCropper
  },
  methods: {
    createMem () {
      this.loadings = true
      const data = {}
      data.title = this.datas.title
      data.isGlobal = '1'
      data.content = this.datas.content
      data.imgUrl = JSON.stringify(this.img)
      addMemory({ ...data }).then(res => {
        this.loadings = false
        if (res.status === 200) {
          this.$notification.success({
            message: '创建成功',
            description: '即将返回列表'
          })
          this.goBack()
        }
      })
    },
    changeMemory () {
      this.loadings = true
      const data = {}
      data.title = this.datas.title
      data.content = this.datas.content
      data.id = this.datas.id
      if (data.isGlobal === 2) {
        data.caseId = parseInt(this.datas.caseId)
      }
      data.imgUrl = JSON.stringify(this.img)
      changeMemory({ ...data }).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '保存成功',
            description: '即将返回列表'
          })
        }
        this.loadings = false
        this.goBack()
      })
    },
    goBack: function () {
      this.$emit('onList')
    },
    getChanges (e) {
      if (e === 2) {
        this.idshow = true
      } else {
        this.idshow = false
      }
    },
    handleAvataruploaded (e) {
      this.img.push(e)
    },
    toFirst () {
      if (this.$store.state.data.memoryControl === 0) {
        this.datas = []
      }
      if (this.$store.state.data.memoryControl === 1) {
        this.datas = []
        this.datas = { ...this.$store.state.data.memoryData }
        if (this.datas.isGlobal === 2) {
          this.idshow = true
        }
        if (this.datas.isGlobal === 1) {
          this.idshow = false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>

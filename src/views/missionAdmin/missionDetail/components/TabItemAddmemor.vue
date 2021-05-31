<template>
  <div>
    <div>
      <a-form-model layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :model="datas[0]">
        <a-row :gutter="48" style="display: flex;justify-content: center;align-items: center">
          <a-col :span="15" >
            <a-form-model-item label="标题" required>
              <a-input v-model="datas.title" :placeholder="placeholder" ></a-input>
            </a-form-model-item>
            <a-form-model-item label="内容" required>
              <a-textarea
                v-model="datas.content"
                placeholder="请输入"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
            <a-form-model-item label="照片">
              <a-button @click="() => {showAvatarUploader = true}" ><a-icon type="arrow-up"/>上传图片</a-button>
            </a-form-model-item>
            <div style="margin-bottom: 8px;margin-top: -5px;display: flex;flex:0;">
              <div style="margin-left: 2px;margin-right: 2px" v-for="(src, index) in img" :rowKey="index" :key="index">
                <a-avatar v-viewer :src="src" :size="150" shape="square" ></a-avatar>
              </div>
            </div>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 5 }">
              <a-button v-if="0" type="primary" style="margin-right: 20px">
                保存
              </a-button>
              <a-button @click="createMem" type="primary" style="margin-right: 20px">
                新建
              </a-button>
              <a-button @click="toFirst" type="danger" ghost style="margin-left: 20px;" >
                重置
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <image-cropper v-model="showAvatarUploader" @success="handleAvataruploaded" />
  </div>
</template>

<script>
import { ImageCropper } from '@/components'
import { addMemory } from '@/api/memory'
export default {
  components: {
    ImageCropper
  },
  name: 'TabItemAddmemor',
  data () {
    return {
      datas: [],
      placeholder: '请输入',
      img: [],
      showAvatarUploader: false,
      loadings: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 }
    }
  },
  methods: {
    createMem () {
      const data = {}
      data.title = this.datas.title
      data.content = this.datas.content
      data.imgUrl = JSON.stringify(this.img)
      data.isGlobal = '2'
      data.caseId = this.$store.state.data.caseId
      console.log(this.datas)
      console.log(data)
      addMemory({ ...data }).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '创建成功',
            description: '新案件备忘录创建成功'
          })
          this.datas = []
          this.$emit('addMemo')
          this.$emit('ok')
        }
      })
    },
    handleAvataruploaded (e) {
      this.img.push(e)
    },
    toFirst () {
      this.datas = []
      this.img = []
    }
  }
}
</script>

<style scoped>

</style>

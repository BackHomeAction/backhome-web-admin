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
                <a-form-item label="是否展示" >
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
                <rich-text-editor v-model="announce.content" />
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
  </div>
</template>

<script>
import { PageGoBackTop, RichTextEditor } from '@/components'
import { announceCreate, announceEdit } from '@/api/announce'

export default {
  mounted () {
    this.getDatas()
  },
  data () {
    return {
      name: '返回',
      editor: null,
      editorData: '',
      imageUrl: '',
      announce: {
        title: '',
        roleId: '',
        content: ''
      },
      contents: '',
      state: '',
      loadings: false,
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      placeholder: '请输入'
    }
  },
  components: {
    PageGoBackTop, RichTextEditor
  },
  methods: {
    getPhoto: function () {
      console.log(1)
    },
    editOut: function () {
      this.loadings = true
      const notice = Object.assign(this.announce, {})
      announceCreate({
        ...notice
      }).then(() => {
        this.$notification.success({
          message: '成功',
          description: '创建成功'
        })
        this.goBack()
      }).finally(() => {
        this.loadings = false
      })
    },
    goBack: function () {
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
      }).finally(() => {
        this.loadings = false
      })
    },
    getDatas: function () {
      this.announce = this.$store.state.data.announce.announceEdit
      this.state = this.$store.state.data.announce.state
    }
  },
  name: 'NewCreate'
}
</script>

<style scoped>

</style>

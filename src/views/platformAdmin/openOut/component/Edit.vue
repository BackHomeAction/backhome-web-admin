<template>
  <div>
    <a-card :bordered="false">
      <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px"><a-icon type="left" />返回</a></page-go-back-top>
      <a-spin :spinning="pageLoading">
        <a-form-model layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :model="datas[0]">
          <a-row :gutter="48" style="display: flex;justify-content: center;align-items: center">
            <a-col :span="15" >
              <a-form-model-item label="应用名称" required>
                <a-input v-model="datas.name" :placeholder="placeholder" ></a-input>
              </a-form-model-item>
              <a-form-model-item label="APP ID" required>
                <a-input v-model="datas.appId" :placeholder="placeholder"></a-input>
              </a-form-model-item>
              <a-form-model-item label="Access Key" required v-if="state === 2">
                <span>{{ datas.accessKey }} <div v-if="keyState === false">按下按钮来获取新的Key!</div> <a @click="copyFun(datas.accessKey)"><a-icon v-if="keyState" type="copy" /></a>{{ ' ' + ' ' }}<a-button @click="keyHeadUse">重生成</a-button></span>
              </a-form-model-item>
              <a-form-model-item label="Access Key" required v-if="state === 1">
                <span><div>{{ datas.accessKey }}</div>{{ ' ' + ' ' }}<a @click="copyFun(datas.accessKey)"><a-icon v-if="keyState" type="copy" /></a></span>
              </a-form-model-item>
              <a-form-model-item label="备注" >
                <a-input v-model="datas.comment" :placeholder="placeholder"></a-input>
              </a-form-model-item>
              <a-form-model-item label=" ">
                <a-button v-if="state === 2" @click="saveThree" type="primary" style="margin-right: 20px">
                  保存
                </a-button>
                <a-button v-if="state === 1" @click="createThree" type="primary" style="margin-right: 20px">
                  新建
                </a-button>
                <a-button type="danger" @click="deleteAll" ghost style="margin-left: 20px;" >
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
import { threeChange, threeNew } from '@/api/announce'
export default {
  beforeMount () {
    this.getKey(48)
  },
  mounted () {
    this.state = this.$store.state.data.openOut.state
    if (this.state === 2) {
      this.datas = this.$store.state.data.openOut.openEdit
      this.keyState = false
    }
    if (this.datas === 1) {
      this.keyState = true
      this.getKeyHead()
    }
  },
  name: 'Edit',
  data () {
    return {
      app: {},
      pageLoading: false,
      datas: [],
      editKey: false,
      keyState: true,
      state: '',
      keyPro: '',
      placeholder: '请输入',
      labelCol: { span: 5 },
      wrapperCol: { span: 14 }
    }
  },
  components: {
    PageGoBackTop
  },
  methods: {
    goBack: function () {
      this.$emit('onGoBack')
    },
    deleteAll: function () {
      if (this.state === 1) {
        this.datas = []
      }
      if (this.state === 2) {
        this.datas = []
        this.datas = this.$store.state.data.openOut.openEdit
      }
    },
    getKey: function (e) {
      e = e || 32
      var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var a = t.length
      var n = ''
      for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
      this.datas.accessKey = ''
      this.keyPro = n
      this.datas.accessKey = this.keyPro
      this.editKey = false
    },
    copyFun: function (text) {
      var oInput = document.createElement('input')
      oInput.value = text
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('Copy')
      if (text) {
        this.$message.info('复制成功')
      } else {
        this.$message.error('请先生成Key')
      }
    },
    saveThree: function () {
      if (this.state === 2 && this.datas.name !== '' && this.datas.appId !== '' && this.datas.accessKey !== '') {
        this.pageLoading = true
        const client = this.datas
        threeChange({
          ...client
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.$notification.success({
              message: '成功',
              description: '修改成功'
            })
            this.goBack()
          }
          this.pageLoading = false
        }).catch(res => {
          this.pageLoading = false
        })
      } else {
        this.$message.info('请检查输入项正确性')
      }
    },
    createThree: function () {
      if (this.state === 1 && this.datas.name !== '' && this.datas.appId !== '' && this.datas.accessKey !== '') {
        const client = this.datas
        threeNew({
          ...client
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.$notification.success({
              message: '成功',
              description: '创建成功'
            })
            this.goBack()
          }
          this.pageLoading = false
        }).catch(res => {
          this.pageLoading = false
        })
      }
    },
    getKeyHead: function () {
      if (this.state === 1) {
        this.getKey(48)
      }
    },
    editKeyHeader: function () {
      this.editKey = true
      if (this.state === 2 && this.editKey === true) {
        this.getKey(48)
      }
    },
    keyHeadUse: function () {
      this.keyState = true
      this.getKey(48)
      this.deleteAll()
    }
  }
}
</script>

<style scoped>

</style>

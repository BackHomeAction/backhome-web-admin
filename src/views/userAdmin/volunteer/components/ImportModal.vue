<template>
  <a-modal
    title="批量导入"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-upload-dragger
      name="file"
      accept=".xlsx"
      :fileList="fileList"
      :action="uploadUrl"
      :headers="uploadHeaders"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        请点击选择或拖动文件到此处
      </p>
      <p class="ant-upload-hint">
        支持拓展名：.xlsx
      </p>
    </a-upload-dragger>
    <div style="text-align: center; margin-top: 10px">
      <a href="https://home-action.oss-cn-shanghai.aliyuncs.com/admin/%E5%BF%97%E6%84%BF%E8%80%85%E4%BF%A1%E6%81%AF%E6%A8%A1%E6%9D%BF%20.xlsx" target="_blank">点击下载模板</a>
    </div>
  </a-modal>
</template>

<script>
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'VolunteerUserAdminImport',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    uploadUrl () {
      return process.env.VUE_APP_API_BASE_URL + '/admin/volunteer/excel'
    },
    uploadHeaders () {
      const token = storage.get(ACCESS_TOKEN)
      return {
        Authorization: `Bearer ${token}`
      }
    }
  },
  data () {
    return {
      confirmLoading: false,
      fileList: []
    }
  },
  methods: {
    handleOk () {
      this.$emit('close')
    },
    handleCancel () {
      this.$emit('close')
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success('导入志愿者列表成功')
        this.$emit('success')
        this.fileList = []
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

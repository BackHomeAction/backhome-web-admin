<template>
  <my-upload
    field="photo"
    @crop-upload-success="cropUploadSuccess"
    @crop-upload-fail="cropUploadFail"
    v-model="show"
    :width="200"
    :height="200"
    :url="url"
    :headers="headers"
    img-format="png"
  />
</template>

<script>
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import myUpload from 'vue-image-crop-upload'

export default {
  components: { myUpload },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    headers () {
      const token = storage.get(ACCESS_TOKEN)
      return {
        Authorization: `Bearer ${token}`
      }
    },
    url () {
      const baseUrl = process.env.VUE_APP_API_BASE_URL
      return `${baseUrl}/admin/photo`
    }
  },
  data () {
    return {
      show: this.value
    }
  },
  watch: {
    show (val) {
      if (val !== this.value) {
        this.$emit('change', val)
      }
    },
    value (val) {
      if (val !== this.show) {
        this.show = val
      }
    }
  },
  methods: {
    cropUploadSuccess (jsonData) {
      // console.log('-------- upload success --------')
      // console.log(jsonData)
      // console.log('field: ' + field)
      this.$emit('success', jsonData.data)
    },
    cropUploadFail (status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>

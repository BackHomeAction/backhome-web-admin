<template>
  <div>
    <div v-if="value.length===3 && !isEdit">{{ `${value[0]} ${value[1]} ${value[2]}` }} <a @click="isEdit = true">修改</a></div>
    <a-cascader
      v-if="!value.length || isEdit"
      :options="options"
      :load-data="loadData"
      placeholder="请选择"
      change-on-select
      @change="onChange"
    />
  </div>
</template>

<script>
import jsonp from 'jsonp'
const key = process.env.VUE_APP_TENCENT_MAP_KEY

const specialProvince = ['北京市', '天津市', '上海市', '重庆市', '台湾省', '香港特别行政区', '澳门特别行政区']

function getRegion (id) {
  return new Promise((resolve, reject) => {
    jsonp(`https://apis.map.qq.com/ws/district/v1/getchildren?key=${key}&output=jsonp&callback=callback${id ? `&id=${id}` : ''}`,
      { name: 'callback' },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
  })
}

export default {
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      isEdit: false,
      options: []
    }
  },
  mounted () {
    this.initData()
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  methods: {
    onChange (value) {
      // console.log(value)
      this.isEdit = true
      this.$emit('input', value)
    },
    async initData () {
      try {
        const res = await getRegion()
        this.options = []
        res.result[0].map(ele => {
          this.options.push({
            id: ele.id,
            value: ele.fullname,
            label: ele.fullname,
            isLeaf: false
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]

      // 直辖市、港澳台特殊处理
      // eslint-disable-next-line eqeqeq
      if (selectedOptions.length === 1 && specialProvince.find(name => name == targetOption.value)) {
        targetOption.children = []
        targetOption.children.push({
          id: targetOption.id,
          value: targetOption.value,
          label: targetOption.value,
          isLeaf: false
        })
        this.options = [...this.options]
        return
      }

      targetOption.loading = true
      const res = await getRegion(targetOption.id)
      targetOption.children = []
      res.result[0].map(ele => {
        targetOption.children.push({
          id: ele.id,
          value: ele.fullname,
          label: ele.fullname,
          isLeaf: selectedOptions.length === 2
        })
      })
      targetOption.loading = false
      this.options = [...this.options]
    }
  }
}
</script>

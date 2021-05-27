<template>
  <div style="background-color: lightgray; padding: 20px;">
    <a-row :gutter="16">
      <a-col :span="6" v-for="(text, index) in datas" :key="index" rowKey="rowKey" >
        <a-card :title="text.title" :bordered="false">
          <a slot="extra" href="#" @click="modelshow(text)">more</a>
          <p>{{ text.content }}</p>
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      v-model="shows"
      title="备忘详情"
      @ok="() => (shows = false)"
    >
      <a-descriptions
        layout="vertical"
        bordered
        :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
      >
        <a-descriptions-item label="标题">
          {{ cardShow.title }}
        </a-descriptions-item>
        <a-descriptions-item label="发布人" :span="2">
          {{ cardShow.name }}
        </a-descriptions-item>
        <a-descriptions-item label="控制域">
          {{ cardShow.isGlobal===1 ? '全局备忘' : '案件备忘:'+$store.state.data.caseId }}
        </a-descriptions-item>
        <a-descriptions-item label="内容" :span="12">
          {{ cardShow.content }}
        </a-descriptions-item>
        <a-descriptions-item label="图片" :span="12">
          <a-avatar
            v-for="(src, index) in cardShow.imgUrl"
            :key="index"
            rowKey="rowKey"
            v-viewer
            :src="src"
            :size="150"
            shape="square" ></a-avatar>
        </a-descriptions-item>
        <a-avatar></a-avatar>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { getMemory } from '@/api/memory'
export default {
  mounted () {
    this.init()
  },
  name: 'TabltemMemory',
  data () {
    return {
      datas: [],
      shows: false,
      cardShow: {},
      img: []
    }
  },
  methods: {
    modelshow (text) {
      this.shows = true
      this.cardShow = text
      console.log(text, '123123123')
      this.cardShow.imgUrl = JSON.parse(this.cardShow.imgUrl)
    },
    init () {
      console.log(this.$store.state.data.caseId)
      getMemory({ caseId: this.$store.state.data.caseId }).then(res => {
        this.datas = res.data
        console.log(this.datas)
      }).catch(err => {
        console.log(err)
      })
      if (this.datas) {
        console.log(this.datas)
        // for (var c = 0; c < JSON.parse(this.datas.imgUrl).length; c++) {
        //   this.img[c] = JSON.parse(this.datas.imgUrl)[c]
        // }
        // console.log(this.img)
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <a-spin :spinning="loadings">
    <div style="background-color: #ffffff; padding: 20px;">
      <a-row :gutter="16">
        <a-col :span="6" v-for="(text, index) in datas" :key="index" rowKey="rowKey" >
          <a-card :title="text.title" :bordered="true" :hoverable="true" @click="modelshow(text)">
            <a slot="extra" href="#" @click="modelshow(text)">点击查看更多</a>
            <p style=" width: 270px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ text.content }}</p>
          </a-card>
        </a-col>
        <a-col :span="6" :style=" datas.length>=4 ? 'margin-top: 20px' : '' ">
          <a-card :bordered="true" :hoverable="true" @click="plusNew" >
            <div style="width:100%;height: 93px;display: flex;justify-content: center;align-items: center">
              <a-icon type="plus" />新增案件备忘
            </div>
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
              v-for="(src, index) in img"
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
      <a-modal
        v-model="addShow"
        title="新增案件备忘"
        width="800px"
        centered
        @ok="() => (addShow = false)">
        <tab-item-addmemor @ok="() => (addShow = false)" @addMemo="getNew" />
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
import { getMemory } from '@/api/memory'
import TabItemAddmemor from '@/views/missionAdmin/missionDetail/components/TabItemAddmemor'
export default {
  components: {
    TabItemAddmemor
  },
  mounted () {
    this.loadings = true
    this.init()
  },
  name: 'TabltemMemory',
  data () {
    return {
      loadings: false,
      addShow: false,
      datas: [],
      shows: false,
      cardShow: {},
      img: []
    }
  },
  methods: {
    getNew () {
      this.init()
    },
    plusNew () {
      this.addShow = true
    },
    modelshow (text) {
      this.shows = true
      this.cardShow = text
      this.img = JSON.parse(this.cardShow.imgUrl)
    },
    init () {
      getMemory({ caseId: this.$store.state.data.caseId }).then(res => {
        this.datas = res.data
        this.loadings = false
      }).catch(err => {
        this.loadings = false
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>

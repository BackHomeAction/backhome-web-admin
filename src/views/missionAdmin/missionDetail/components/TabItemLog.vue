<template>
  <a-spin class="timeline" :spinning="isLoading">
    <a-timeline mode="alternate">
      <a-timeline-item v-for="item in timeline" :key="item.id" :color="getPointColor(item)" >
        <span v-if="item.actionId === 1">{{ item.name }} 发布了案件</span>
        <span v-if="item.actionId === 2">案件已完成</span>
        <span v-if="item.actionId === 3">案件已取消</span>
        <span v-if="item.actionId === 4">案件已归档</span>
        <span v-if="item.actionId === 5">{{ item.name }} 加入了案件</span>
        <span v-if="item.actionId === 6">{{ item.name }} 退出了案件</span>
        <span v-if="item.actionId === 7">{{ item.name }} 上传了人脸信息</span>
        <br>
        <span style="font-size: 75%">{{ item.time | moment }}</span>
      </a-timeline-item>
    </a-timeline>
  </a-spin>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMissionTimeline } from '@/api/mission'

export default {
  computed: {
    ...mapGetters(['currentMissionInfo'])
  },
  data () {
    return {
      isLoading: true,
      timeline: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      try {
        const res = await getMissionTimeline({ caseId: this.currentMissionInfo.id })
        this.timeline = res.data
        this.isLoading = false
      } catch (e) {
        console.log(e)
      }
    },
    getPointColor (item) {
      switch (item.actionId) {
      case 1:
        return '#fa8c16'
      case 2:
        return 'green'
      case 3:
        return 'red'
      default:
        return 'blue'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.timeline {
  padding-top: 20px;
}
</style>y

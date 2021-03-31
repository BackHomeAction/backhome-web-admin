<template>
  <div class="body">
    <a-card :bordered="false">
      <a-spin :spinning="isLoadingInfo">
        <basic-info />
      </a-spin>
    </a-card>

    <a-card :bordered="false" style="margin-top: 24px">
      <a-spin :spinning="isLoadingInfo">
        <a-tabs default-active-key="map" >
          <a-tab-pane key="map" tab="实时地图">
            Content of Tab Pane 1
          </a-tab-pane>
          <a-tab-pane key="chat" tab="在线沟通">
            Content of Tab Pane 2
          </a-tab-pane>
          <a-tab-pane key="info" tab="案件信息">
            Content of Tab Pane 3
          </a-tab-pane>
          <a-tab-pane key="face" tab="人脸识别记录">
            Content of Tab Pane 4
          </a-tab-pane>
          <a-tab-pane key="volunteers" tab="志愿者列表">
            Content of Tab Pane 5
          </a-tab-pane>
          <a-tab-pane key="log" tab="案件日志">
            Content of Tab Pane 6
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BasicInfo from './components/BasicInfo.vue'

export default {
  name: 'MissionDetail',
  components: { BasicInfo },
  computed: {
    ...mapGetters(['currentMission', 'currentMissionInfo'])
  },
  data () {
    return {
      caseId: null,
      isLoadingInfo: true
    }
  },
  mounted () {
    const query = this.$route.query
    this.caseId = parseInt(query.id, 10)
    this.init()
  },
  unmounted () {
    this.$store.dispatch('clearCurrentMission')
  },
  methods: {
    async init () {
      this.getMissionInfo()
    },
    async getMissionInfo () {
      this.isLoadingInfo = true
      await this.$store.dispatch('initCurrentMission', { id: this.caseId })
      this.isLoadingInfo = false
      console.log(this.currentMission)
    }
  }
}
</script>

<template>
  <div class="body">
    <a-card :bordered="false">
      <a-spin :spinning="isLoadingInfo">
        <basic-info />
      </a-spin>
    </a-card>

    <a-card :bordered="false" style="margin-top: 24px">
      <a-spin :spinning="isLoadingInfo">
        <div v-if="currentMission && currentMissionInfo">
          <a-tabs default-active-key="map" >
            <a-tab-pane key="map" tab="实时地图">
              <tab-item-map ref="item-map" />
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
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BasicInfo from './components/BasicInfo.vue'
import TabItemMap from './components/TabItemMap.vue'
import Ws from '@/services/websocket'

const SocketStateTypes = {
  NEW_MISSION: 10,
  MISSION_INFO_CHANGED: 11,
  VOLUNTEER_LOCATION_CHANGED: 12,
  VOLUNTEER_OFFLINE: 13,
  MISSION_TIMEOUT: 14,
  VOLUNTEER_JOIN_MISSION: 15,
  VOLUNTEER_QUIT_MISSION: 16,
  FACE_PASS: 17,
  MISSION_COMPLETED: 18,
  MISSION_CANCELED: 19
}

export default {
  name: 'MissionDetail',
  components: { BasicInfo, TabItemMap },
  computed: {
    ...mapGetters(['currentMission', 'currentMissionInfo'])
  },
  data () {
    return {
      caseId: null,
      isLoadingInfo: true,
      ws: Ws.getInstance()
    }
  },
  mounted () {
    const query = this.$route.query
    this.caseId = parseInt(query.id, 10)
    this.init()
  },
  unmounted () {
    this.$store.dispatch('clearCurrentMission')
    this.closeWebSocket()
  },
  methods: {
    async init () {
      this.getMissionInfo()
      this.initWebSocket()
    },
    async getMissionInfo () {
      this.isLoadingInfo = true
      await this.$store.dispatch('initCurrentMission', { id: this.caseId })
      this.isLoadingInfo = false
      console.log(this.currentMission)
    },
    initWebSocket () {
      this.ws.connect()
      this.ws.subscribe(`/case/${this.caseId}`, this.newCaseInfoCallback)
    },
    closeWebSocket () {
      this.ws.disconnect()
    },
    async newCaseInfoCallback (res) {
      const data = JSON.parse(res.body)
      if (data.status === SocketStateTypes.MISSION_INFO_CHANGED) {
        await this.$store.dispatch('initCurrentMission', {
          id: this.caseId
        })
        this.$notification.warning('提示', '案件信息发生变化，请您留意！')
      } else if (data.status === SocketStateTypes.VOLUNTEER_LOCATION_CHANGED) {
        this.$store.commit('UPDATE_MISSION_VOLUNTEER_LOCATION', data.data)
        this.$refs['item-map'].updateVolunteerPlaces()
      } else if (data.status === SocketStateTypes.VOLUNTEER_OFFLINE) {
        this.$store.commit('UPDATE_MISSION_VOLUNTEER_OFFLINE', data.data)
        this.$refs['item-map'].updateVolunteerPlaces()
      } else if (
        data.status === SocketStateTypes.VOLUNTEER_JOIN_MISSION ||
        data.status === SocketStateTypes.VOLUNTEER_QUIT_MISSION
      ) {
        await this.$store.dispatch('getCurrentMissionMembers', {
          id: this.caseId
        })
      }
    }
  }
}
</script>

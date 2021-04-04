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
          <a-tabs default-active-key="map" @change="handleTabChange">
            <a-tab-pane key="map" tab="实时地图">
              <tab-item-map ref="map" force-render />
            </a-tab-pane>
            <a-tab-pane key="chat" tab="在线沟通" v-if="currentMissionInfo.state === 1 || currentMissionInfo.state === 3">
              <tab-item-chat ref="chat" force-render/>
            </a-tab-pane>
            <a-tab-pane key="info" tab="案件信息">
              <tab-item-info />
            </a-tab-pane>
            <a-tab-pane key="face" tab="人脸识别记录">
              <tab-item-face-record />
            </a-tab-pane>
            <a-tab-pane key="volunteers" tab="志愿者列表">
              <tab-item-volunteer-list />
            </a-tab-pane>
            <a-tab-pane key="log" tab="案件日志">
              <tab-item-log />
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
import TabItemFaceRecord from './components/TabItemFaceRecord.vue'
import TabItemLog from './components/TabItemLog.vue'
import TabItemVolunteerList from './components/TabItemVolunteerList.vue'
import TabItemInfo from './components/TabItemInfo.vue'
import TabItemChat from './components/TabItemChat'
import Ws from '@/services/websocket'
import IM from '@/services/im'
import { joinIMGroup, leaveIMGroup } from '@/api/im'

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
  components: { BasicInfo, TabItemMap, TabItemFaceRecord, TabItemLog, TabItemVolunteerList, TabItemInfo, TabItemChat },
  computed: {
    ...mapGetters(['currentMission', 'currentMissionInfo'])
  },
  data () {
    return {
      caseId: null,
      isLoadingInfo: true,
      ws: Ws.getInstance(),
      im: IM.getInstance()
    }
  },
  mounted () {
    const query = this.$route.query
    this.caseId = parseInt(query.id, 10)
    this.init()
  },
  beforeDestroy () {
    if (this.currentMissionInfo.state === 1 || this.currentMissionInfo.state === 3) {
      leaveIMGroup({ caseId: this.caseId })
    }
    this.closeWebSocket()
    this.$store.dispatch('clearCurrentMission')
  },
  methods: {
    async init () {
      await this.getMissionInfo()
      this.initWebSocket()
      this.initIM()
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
        this.$refs.map.updateVolunteerPlaces()
      } else if (data.status === SocketStateTypes.VOLUNTEER_OFFLINE) {
        this.$store.commit('UPDATE_MISSION_VOLUNTEER_OFFLINE', data.data)
        this.$refs.map.updateVolunteerPlaces()
      } else if (
        data.status === SocketStateTypes.VOLUNTEER_JOIN_MISSION ||
        data.status === SocketStateTypes.VOLUNTEER_QUIT_MISSION
      ) {
        await this.$store.dispatch('getCurrentMissionMembers', {
          id: this.caseId
        })
      }
    },
    async initIM () {
      // 已结束的案件不允许聊天
      if (this.currentMissionInfo.state === 2 || this.currentMissionInfo.state === 4) return

      try {
        await joinIMGroup({ caseId: this.caseId })
        this.im.checkoutGroup(this.caseId)
      } catch (e) {
        console.log(e)
      }
    },
    handleTabChange (name) {
      if (name === 'chat') {
        if (!this.$refs.chat) return
        this.$refs.chat.scrollToBottom()
      }
    }
  }
}
</script>

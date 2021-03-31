<template>
  <a-page-header
    :title="currentMissionInfo && currentMissionInfo.oldMan && currentMissionInfo.oldMan.name || ''"
    @back="$router.back()"
  >
    <template slot="subTitle">
      <mission-state-badge :mission="currentMissionInfo" />
    </template>
    <template slot="extra">
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleCloseMission">
            关闭任务
          </a-menu-item>
        </a-menu>
        <a-button> 操作 <a-icon type="down" /> </a-button>
      </a-dropdown>
    </template>
    <a-descriptions size="small" :column="3" v-if="currentMissionInfo">
      <a-descriptions-item label="性别">
        {{ currentMissionInfo.oldMan.sex === 1 ? '男' : '女' }}
      </a-descriptions-item>
      <a-descriptions-item label="走失区域">
        {{ `${currentMissionInfo.province} ${currentMissionInfo.city} ${currentMissionInfo.district} ` }}
      </a-descriptions-item>
      <a-descriptions-item label="走失地点">
        {{ currentMissionInfo.place }}
      </a-descriptions-item>
      <a-descriptions-item label="走失时间">
        {{ currentMissionInfo.lostTime | moment }}
      </a-descriptions-item>
      <a-descriptions-item label="报案时间">
        {{ currentMissionInfo.startTime | moment }}
      </a-descriptions-item>
      <a-descriptions-item label="家属联系方式">
        {{ currentMissionInfo.oldMan.phone || '暂无' }}
      </a-descriptions-item>
    </a-descriptions>
  </a-page-header>
</template>

<script>
import { mapGetters } from 'vuex'
import { MissionStateBadge } from '@/components'

export default {
  components: { MissionStateBadge },
  computed: {
    ...mapGetters(['currentMission', 'currentMissionInfo'])
  },
  methods: {
    async handleCloseMission () {
      this.$confirm({
        title: '是否确认关闭该任务',
        content: '关闭后将无法重新开启！',
        okType: 'danger',
        onOk: () => {
        }
      })
    }
  }
}
</script>

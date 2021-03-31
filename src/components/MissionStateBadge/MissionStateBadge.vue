<template>
  <span v-if="mission && mission.state">
    <a-badge v-if="mission.state === 1 && getHoursFromTime(mission.startTime) <= 24" color="red" text="紧急" />
    <a-badge v-if="mission.state === 1 && getHoursFromTime(mission.startTime) > 24 && getHoursFromTime(mission.startTime) <= 48" color="orange" text="优先" />
    <a-badge v-if="mission.state === 1 && getHoursFromTime(mission.startTime) > 48" color="blue" text="正常" />
    <a-badge v-if="mission.state === 2" color="green" text="已完成" />
    <a-badge v-if="mission.state === 3" color="purple" text="已归档" />
    <a-badge v-if="mission.state === 4" status="default" text="已取消" />
  </span>
</template>

<script>
import dayjs from '@/utils/dayjs'

export default {
  props: {
    mission: {
      type: Object,
      default: null
    }
  },
  methods: {
    getHoursFromTime (time) {
      return dayjs().diff(time, 'hour')
    }
  }
}
</script>

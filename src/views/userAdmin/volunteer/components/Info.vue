<template>
  <div>
    <a-card :bordered="false">
      <a-spin :spinning="isLoadingInfo">
        <a-page-header
          :title="record.name"
          @back="$emit('onGoBack')"
        >
          <template slot="extra">
            <a-button @click="handleEdit(record)">
              编辑
            </a-button>
          </template>
          <a-descriptions size="small" :column="3" v-if="volunteerData">
            <a-descriptions-item label="性别">
              {{ volunteerData.sex === 1 ? '男' : '女' }}
            </a-descriptions-item>
            <a-descriptions-item label="手机号">
              {{ volunteerData.volunteer.phone }}
            </a-descriptions-item>
            <a-descriptions-item label="常居地">
              {{ `${volunteerData.province} ${volunteerData.city} ${volunteerData.district}` }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时间">
              {{ volunteerData.registerTime }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时长">
              {{ volunteerData.registerTime | registerTimeFromNowFilter }}
            </a-descriptions-item>
            <a-descriptions-item label="身份证号">
              {{ volunteerData.idcard }}
            </a-descriptions-item>
            <a-descriptions-item label="月在线率">
              {{ `${(volunteerOnlineDaysNumber/30*100).toFixed(2)}%` }}
            </a-descriptions-item>
            <a-descriptions-item label="案件完成率">
              {{ volunteerTotalTasksNumber ? `${(volunteerFinishTasksNumber/volunteerTotalTasksNumber*100).toFixed(2)}%` : '0.00%' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-page-header>
      </a-spin>
    </a-card>

    <a-card :bordered="false" style="margin-top: 24px;">
      <a-page-header
        title="历史任务"
        backIcon="false"
      >
        <template slot="extra">
          <a-radio-group v-model="taskStatus" @change="handleTaskStatusChange">
            <a-radio-button value="1">
              全部
            </a-radio-button>
            <a-radio-button value="2">
              进行中
            </a-radio-button>
            <a-radio-button value="3">
              已归档
            </a-radio-button>
            <a-radio-button value="4">
              已完成
            </a-radio-button>
            <a-radio-button value="5">
              已取消
            </a-radio-button>
          </a-radio-group>
        </template>
      </a-page-header>
    </a-card>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { getVolunteerByID, getVolunteerOnlineDaysNumber, getVolunteerFinishTasksNumber, getVolunteerTotalTasksNumber } from '@/api/userAdmin'

export default {
  name: 'VolunteerUserAdminInfo',
  props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
  filters: {
    registerTimeFromNowFilter (val) {
      return dayjs(val).fromNow(true)
    }
  },
  data () {
    return {
      isLoadingInfo: false,
      isLoadingTasks: false,
      taskStatus: '1',
      volunteerData: null,
      volunteerOnlineDaysNumber: 0,
      volunteerFinishTasksNumber: 0,
      volunteerTotalTasksNumber: 0
    }
  },
  methods: {
    handleEdit (record) {
      this.$emit('onEdit', record)
    },
    handleTaskStatusChange (e) {
      this.taskStatus = e.target.value
      // TODO: fetch list
    },
    async initVolunteerOnlineDaysNumber () {
      const volunteerId = this.record.volunteer.id
      const { data } = await getVolunteerOnlineDaysNumber({ volunteerId })
      this.volunteerOnlineDaysNumber = data
    },
    async initVolunteerFinishTasksNumber () {
      const volunteerId = this.record.volunteer.id
      const { data } = await getVolunteerFinishTasksNumber({ volunteerId })
      this.volunteerFinishTasksNumber = data
    },
    async initVolunteerTotalTasksNumber () {
      const volunteerId = this.record.volunteer.id
      const { data } = await getVolunteerTotalTasksNumber({ volunteerId })
      this.volunteerTotalTasksNumber = data
    },
    async initVolunteerInfo () {
      const { id } = this.record
      const { data } = await getVolunteerByID({ id })
      this.volunteerData = data
    },
    async init () {
      this.isLoadingInfo = true
      try {
        await Promise.all([
          this.initVolunteerOnlineDaysNumber(),
          this.initVolunteerFinishTasksNumber(),
          this.initVolunteerTotalTasksNumber(),
          this.initVolunteerInfo()
        ])
      } catch (e) {
        console.log(e)
        this.$emit('onGoBack')
      }
      this.isLoadingInfo = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.record && this.record.id) {
        this.init()
      }
    })
  }
}
</script>

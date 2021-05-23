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
            <a-radio-button :value="0">
              全部
            </a-radio-button>
            <a-radio-button :value="1">
              进行中
            </a-radio-button>
            <a-radio-button :value="2">
              已完成
            </a-radio-button>
            <a-radio-button :value="3">
              已归档
            </a-radio-button>
            <a-radio-button :value="4">
              已取消
            </a-radio-button>
          </a-radio-group>
        </template>
      </a-page-header>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
      >
        <span slot="id" slot-scope="text, row">
          <template>
            <a @click="handleViewTask(row)">{{ `#${text}` }}</a>
          </template>
        </span>
        <span slot="state" slot-scope="text, row">
          <a-badge v-if="text === 1 && getHoursFromTime(row.startTime) <= 24" color="red" text="紧急" />
          <a-badge v-if="text === 1 && getHoursFromTime(row.startTime) > 24 && getHoursFromTime(row.startTime) <= 48" color="orange" text="优先" />
          <a-badge v-if="text === 1 && getHoursFromTime(row.startTime) > 48" color="blue" text="正常" />
          <a-badge v-if="text === 2" color="green" text="已完成" />
          <a-badge v-if="text === 3" color="blue" text="已归档" />
          <a-badge v-if="text === 4" status="default" color="gray" text="已取消" />
        </span>
        <span slot="action" slot-scope="text, row">
          <template>
            <a @click="handleViewTask(row)" v-if="record.volunteer">查看</a>
          </template>
        </span>
        <span slot="startTime" slot-scope="text">
          <template>
            {{ text | dayjs }}
          </template>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { getVolunteerByID, getVolunteerOnlineDaysNumber, getVolunteerFinishTasksNumber, getVolunteerTotalTasksNumber, getVolunteerTasks } from '@/api/volunteerAdmin'
import { STable } from '@/components'

export default {
  name: 'VolunteerUserAdminInfo',
  components: { STable },
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
      taskStatus: 0,
      volunteerData: null,
      volunteerOnlineDaysNumber: 0,
      volunteerFinishTasksNumber: 0,
      volunteerTotalTasksNumber: 0,
      // 表头
      columns: [
        {
          title: '任务 ID',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '走失地点',
          dataIndex: 'place'
        },
        {
          title: '创建时间',
          dataIndex: 'startTime',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getVolunteerTasks({
          ...parameter,
          volunteerId: this.record.volunteer.id,
          state: this.taskStatus
        })
          .then(res => {
            return res.data
          })
      }
    }
  },
  methods: {
    handleEdit (record) {
      this.$emit('onEdit', record)
    },
    handleTaskStatusChange (e) {
      this.taskStatus = e.target.value
      this.$refs.table.refresh()
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
    },
    handleViewTask (item) {
      this.$router.push({ path: '/missionAdmin/missionDetail', query: { id: item.id } })
    },
    getHoursFromTime (time) {
      return dayjs().diff(time, 'hour')
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

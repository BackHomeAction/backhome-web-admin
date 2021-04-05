<template>
  <div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      class="table"
    >
      <span slot="imgUrl" slot-scope="url" v-viewer>
        <img class="table__image" :src="url" />
      </span>
      <span slot="result" slot-scope="result">
        {{ `${(result*100).toFixed(2)}%` }}
      </span>
      <span slot="state" slot-scope="text, record">
        <a-badge :status="record.state | statusTypeFilter" :text="record.state | statusFilter" />
      </span>
      <span slot="volunteerId" slot-scope="text, record">
        <a v-if="record.volunteer && record.volunteer.volunteerInformation">{{ record.volunteer.volunteerInformation.name }}</a>
        <span v-else>/</span>
      </span>
      <span slot="time" slot-scope="text">
        {{ text | moment }}
      </span>
      <span slot="action" slot-scope="text, record" v-if="record.state === 2">
        <template>
          <a @click="handleConfirm(record)">确认是</a>
          <a-divider type="vertical" v-if="record.state !== 3" />
          <a @click="handleRefuse(record)" v-if="record.state !== 3">确认否</a>
        </template>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { cleanObject } from '@/utils/util'
import { getFaceRecognizationList, checkFaceRecognizationResult } from '@/api/face'
import { mapGetters } from 'vuex'

const statusMap = {
  1: {
    status: 'default',
    text: '未匹配'
  },
  2: {
    status: 'processing',
    text: '待确认'
  },
  3: {
    status: 'error',
    text: '确认否'
  },
  4: {
    status: 'success',
    text: '确认是'
  }
}

export default {
  components: {
    STable
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  computed: {
    ...mapGetters(['currentMissionInfo'])
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '图片',
          dataIndex: 'imgUrl',
          scopedSlots: { customRender: 'imgUrl' }
        },
        {
          title: '匹配率',
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        },

        {
          title: '上传者',
          dataIndex: 'volunteerId',
          scopedSlots: { customRender: 'volunteerId' }
        },
        {
          title: '上传时间',
          dataIndex: 'time',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 数据加载方法
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        const query = cleanObject(Object.assign(parameter, {
          oldManId: this.currentMissionInfo.oldMan.id
        }))
        return getFaceRecognizationList(query)
          .then(res => {
            return res.data
          })
      }
    }
  },
  methods: {
    async changeFaceState (faceId, state) {
      try {
        await checkFaceRecognizationResult({
          faceId,
          state
        })
        this.$message.success('确认成功')
        this.$refs.table.refresh(true)
      } catch (e) {
        console.log(e)
      }
    },
    handleConfirm (record) {
      this.$confirm({
        title: '是否确认该人脸信息？',
        onOk: () => {
          return this.changeFaceState(record.id, 4)
        }
      })
    },
    handleRefuse (record) {
      this.$confirm({
        title: '是否拒绝该人脸信息？',
        onOk: () => {
          return this.changeFaceState(record.id, 3)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table {
  &__image {
    width: 120px;
    height: 80px;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>

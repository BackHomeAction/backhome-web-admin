<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="志愿者 ID">
                <a-input v-model="queryParam.id" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

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
        <span slot="oldManId" slot-scope="text, record">
          <a v-if="record.oldManId">{{ record.oldMan.name }}</a>
          <span v-else>/</span>
        </span>
        <span slot="volunteerId" slot-scope="text, record">
          <a v-if="record.volunteer && record.volunteer.volunteerInformation">{{ record.volunteer.volunteerInformation.name }}</a>
          <span v-else>/</span>
        </span>
        <span slot="time" slot-scope="text">
          {{ text | moment }}
        </span>
        <span slot="action" slot-scope="text, record" v-if="record.state === 1 || record.state === 2">
          <template>
            <a @click="handleConfirm(record)">确认是</a>
            <a-divider type="vertical" v-if="record.state !== 3" />
            <a @click="handleRefuse(record)" v-if="record.state !== 3">确认否</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { cleanObject } from '@/utils/util'
import { getFaceRecognizationList, checkFaceRecognizationResult } from '@/api/face'

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
  data () {
    return {
      // 查询参数
      queryParam: {},
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
          title: '对应老人',
          dataIndex: 'oldManId',
          scopedSlots: { customRender: 'oldManId' }
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
        const query = cleanObject(Object.assign(parameter, this.queryParam))
        // 特殊处理地区选择器
        if (query.region) {
          query.province = query.region[0]
          query.city = query.region[1]
          query.district = query.region[2]
          delete query.region
        }
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

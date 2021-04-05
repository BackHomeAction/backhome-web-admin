<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="任务 ID">
                <a-input v-model="queryParam.id" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="任务状态">
                <a-select v-model="queryParam.state" placeholder="请选择" default-value="0">
                  <a-select-option value="1">进行中</a-select-option>
                  <a-select-option value="2">已完成</a-select-option>
                  <a-select-option value="3">已归档</a-select-option>
                  <a-select-option value="4">已取消</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="老人姓名">
                  <a-input v-model="queryParam.name" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="16" :sm="24">
                <a-form-item label="案发区域">
                  <region-selector v-model="queryParam.region" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="案发地点">
                  <a-input v-model="queryParam.place" placeholder="请输入"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
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
      >
        <span slot="location" slot-scope="text, record">
          {{ record.province && record.city && record.district ? `${record.province} ${record.city} ${record.district}` : '' }}
        </span>
        <span slot="state" slot-scope="text, row">
          <mission-state-badge :mission="row" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleView(record)">进入</a>
          </template>
        <!-- <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable, RegionSelector, MissionStateBadge } from '@/components'
import { getMissionList } from '@/api/mission'
import { cleanObject } from '@/utils/util'

export default {
  components: {
    STable,
    RegionSelector,
    MissionStateBadge
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '任务 ID',
          dataIndex: 'id'
        },
        {
          title: '老人姓名',
          dataIndex: 'oldMan.name'
        },
        {
          title: '案发区域',
          scopedSlots: { customRender: 'location' }
        },
        {
          title: '案发地点',
          dataIndex: 'place'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '发布时间',
          dataIndex: 'startTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
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
        return getMissionList(query)
          .then(res => {
            return res.data
          })
      }
    }
  },
  created () {
  },
  methods: {
    handleView (record) {
      this.$emit('onView', record)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

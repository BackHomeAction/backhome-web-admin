<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户 ID">
              <a-input v-model="queryParam.id" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.name" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.state" placeholder="请选择" default-value="0">
                  <a-select-option value="0">待注册</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">已停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.phone" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-form-item label="地区">
                <region-selector v-model="queryParam.region" />
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

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit()">新建</a-button>
      <a-button type="default" @click="handleEdit()" v-role="['superAdmin', 'admin']">批量导入</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="sex" slot-scope="text">
        {{ text ? (text === 1 ? '男' : '女') : '' }}
      </span>
      <span slot="location" slot-scope="text, record">
        {{ record.province && record.city && record.district ? `${record.province} ${record.city} ${record.district}` : '' }}
      </span>
      <span slot="state" slot-scope="text, record">
        <a-badge v-if="record.volunteer" :status="record.volunteer.state | statusTypeFilter" :text="record.volunteer.state | statusFilter" />
        <a-badge v-else status="default" text="待注册" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" v-if="record.volunteer" />
          <a @click="handleView(record)" v-if="record.volunteer">查看</a>
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
</template>

<script>
// import dayjs from '@/utils/dayjs'
import { STable, RegionSelector } from '@/components'
import { getVolunteerList } from '@/api/volunteerAdmin'
import { cleanObject } from '@/utils/util'

const statusMap = {
  1: {
    status: 'success',
    text: '正常'
  },
  2: {
    status: 'error',
    text: '已停用'
  }
}

export default {
  name: 'VolunteerUserAdminList',
  components: {
    STable,
    RegionSelector
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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户 ID',
          dataIndex: 'id'
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '位置',
          scopedSlots: { customRender: 'location' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '注册时间',
          dataIndex: 'registerTime'
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
        return getVolunteerList(query)
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
    handleEdit (record) {
      this.$emit('onEdit', record)
    },
    handleOk () {

    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    resetSearchForm () {
      this.queryParam = {
      }
    }
  }
}
</script>

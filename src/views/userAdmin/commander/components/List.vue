<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户ID">
                <a-input v-model="search.id" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="search.name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="16" v-if="advanced">
              <a-form-item label="状态">
                <a-select v-model="search.state" placeholder="请选择" default-value="0">
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">已停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="16" v-if="advanced">
              <a-form-item label="身份">
                <a-select v-model="search.identity" placeholder="请选择" default-value="0">
                  <a-select-option value="0">系统管理员</a-select-option>
                  <a-select-option value="1">总指战员</a-select-option>
                  <a-select-option value="2">区域指战员</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24" v-if="search.identity==2">
              <a-form-item label="地区">
                <region-selector v-model="search.region" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="advanced">
              <a-form-item label="手机号">
                <a-input v-model="search.number" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="advanced">
              <a-form-item label="地区">
                <a-input v-model="search.inplace" placeholder="请输入"/>
                <region-selector></region-selector>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="searchFamily()">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => search = {}">重置</a-button>
                <a @click="changeShow()" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div>
        <a-table :columns="columns" :data-source="datas">
          <span slot="state" slot-scope="text">
            <a-badge :status="text?'success':'default'" :text="text?'正常':'已停用'"></a-badge>
          </span>
          <span slot="action" >
            <template>
              <a @click="editPage()">编辑</a>
              <a-divider type="vertical" />
              <a @click="watchPage()" >查看</a>
            </template>
          </span>
        </a-table>
      </div>
    </a-card>

  </div>
</template>

<script>
import RegionSelector from '@/components'
export default {
  components: {
    RegionSelector
  },
  name: 'Search',
  data () {
    return {
      columns: [
        {
          title: '用户 ID',
          dataIndex: 'id',
          width: '180px'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '100px'
        },
        {
          title: '身份',
          dataIndex: 'identity',
          scopedSlots: { customRender: 'identity' },
          width: '150px'
        },
        {
          title: '指战区域',
          dataIndex: 'address',
          scopedSlots: { customRender: 'location' },
          width: '200px'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          width: '100px'
        },
        {
          title: '注册时间',
          dataIndex: 'registerTime',
          width: '100px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: [
        {
          key: '1',
          id: '1',
          name: '赵襄',
          identity: '系统管理员',
          address: '全国',
          action: '',
          registerTime: '2021-01-24 21:32:37',
          state: '1'

        }
      ],
      search: {},
      advanced: false
    }
  },
  methods: {
    changeShow: function () {
      this.advanced = !this.advanced
    },
    searchFamily: function () {
      console.log(this.search)
    },
    editPage: function () {
      this.$emit('onEdit')
    },
    watchPage: function () {
      this.$emit('onWatch')
    }
  }
}
</script>

<style scoped>

</style>

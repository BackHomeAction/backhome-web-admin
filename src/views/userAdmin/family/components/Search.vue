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
                  <a-select-option value="0">待注册</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">已停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="advanced">
              <a-form-item label="手机号">
                <a-input v-model="search.number" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="advanced">
              <a-form-item label="地区">
                <region-selector v-model="datas.at"></region-selector>
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
        <a-spin :spinning="loadingPage">
          <a-table :columns="columns" :data-source="datas">
            <span slot="sex" slot-scope="text"> {{ text ? (text === 1 ? '男' : '女') : '' }}</span>
            <span slot="state" slot-scope="text">
              <a-badge :status="text?'success':'default'" :text="text?'正常':'已停用'"></a-badge>
            </span>
            <span slot="location" slot-scope="text">
              {{ ((text.province)!==null)?(text.province + ' ' + text.city + ' ' + text.district):'' }}
            </span>
            <span slot="action" >
              <template>
                <a @click="editPage()">编辑</a>
                <a-divider type="vertical" />
                <a @click="watchPage()" >查看</a>
              </template>
            </span>
          </a-table>
        </a-spin>
      </div>
    </a-card>

  </div>
</template>

<script>
import RegionSelector from '@/components/RegionSelector/RegionSelector'
import { getFamilyData } from '@/api/familyData'
export default {
  mounted () {
    getFamilyData().then(res => {
      console.log(res)
      this.datas = res.data.data
      this.loadingPage = false
    })
  },
  name: 'Search',
  components: {
    RegionSelector, getFamilyData
  },
  data () {
    return {
      loadingPage: true,
      columns: [
        {
          title: '用户 ID',
          dataIndex: 'id',
          width: '180px'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '120px'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' },
          width: '150px'
        },
        {
          title: '位置',
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
          width: '150px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: [],
      search: {},
      advanced: false
    }
  },
  methods: {
    changeShow: function () {
      this.advanced = !this.advanced
    },
    searchFamily: function () {
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

<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="48" >
          <a-form layout="inline">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="search.id" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="发布对象">
                <a-select v-model="search.obj" placeholder="请选择" >
                  <a-select-option :value="1">家属</a-select-option>
                  <a-select-option :value="2">志愿者</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col style="display: flex;align-items: center">
              <a-button type="primary" @click="searchs">查询</a-button>
              <a-button type="default" style="margin-left: 30px" @click="deleteAll">重置</a-button>
            </a-col>
          </a-form>
        </a-row>
        <a-row :gutter="48" style="margin-top: 1%">
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="getCreate">新建</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48" style="margin-top: 30px;">
          <a-spin :spinning="loading">
            <a-table :pagination="pagination" rowKey="id" :columns="columns" :data-source="dataOflist">
              <div slot-scope="text" slot="roleId">
                {{ (text === 1)?'志愿者':'老人' }}
              </div>
              <div slot="action">
                <span>
                  <a>查看</a>
                  <a-divider type="vertical" />
                  <a>编辑</a>
                </span>
              </div>
            </a-table>
          </a-spin>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
import { announSearch } from '@/api/announce'
export default {
  mounted () {
    this.pagination.pageSize = 10
    this.pagination.total = 80
    announSearch().then(res => {
      this.dataOflist = res.data.data
      this.$store.state.data.announce.announceAll = res.data.data
    })
  },
  name: 'List',
  placeIn: '请输入',
  data () {
    return {
      pagination: {},
      search: {},
      loading: false,
      placeIn: '请输入',
      columns: [
        {
          title: '公告ID',
          dataIndex: 'id'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '发布对象',
          dataIndex: 'roleId',
          scopedSlots: { customRender: 'roleId' }
        },
        {
          title: '发布人',
          dataIndex: 'publisher'
        },
        {
          title: '发布时间',
          dataIndex: 'time'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataOflist: [],
      column: [
        {
          title: '公告ID',
          dataIndex: 'id'
        },
        {
          title: '缩略图',
          dataIndex: 'image'
        }
      ]
    }
  },
  methods: {
    getCreate: function () {
      console.log('准备跳转')
      this.$emit('create')
    },
    searchs: function () {
      console.log(this.search)
    },
    deleteAll: function () {
      this.search = {}
    }
  }

}
</script>

<style scoped>

</style>

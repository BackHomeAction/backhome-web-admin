<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="48" >
          <a-form layout="inline">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="search.title" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="发布对象">
                <a-select v-model="search.roleId" placeholder="请选择" >
                  <a-select-option :value="2">志愿者</a-select-option>
                  <a-select-option :value="1">家属</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-button type="primary" @click="searchs">查询</a-button>
            <a-button type="default" @click="deleteAll" style="margin-left: 8px" >重置</a-button>
          </a-form>
        </a-row>
        <a-row :gutter="48" >
          <a-col :md="8" :sm="24">
            <div class="table-operator">
              <a-button type="primary" @click="getNewShow"><a-icon type="plus" />新建</a-button>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-spin :spinning="loading">
            <a-table style="padding: 1%;padding-top: 0px" :pagination="pagination" rowKey="id" :columns="columns" :data-source="dataOflist">
              <div slot-scope="text" slot="roleId">
                {{ (text === 2)?'志愿者':'家属' }}
              </div>
              <div slot="action" slot-scope="text">
                <span>
                  <a @click="getEdits(text)" >编辑</a>
                  <a-divider type="vertical" />
                  <a @click="chooseAnnouceId(text.id)">删除</a>
                </span>
              </div>
            </a-table>
          </a-spin>
        </a-row>
      </div>
    </a-card>
    <a-modal :visible="shows" title="删除提醒" @ok="deleteAnnounce" @cancel="shows = false;loading = false">
      <p>您确定要删除ID为{{ '' + ' ' + chooseId + ' ' +'' }}的公告么?</p>
    </a-modal>
  </div>
</template>

<script>
import { announSearch, listSearch, announDelete } from '@/api/announce'
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
      shows: false,
      chooseId: '',
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
      this.$emit('create')
    },
    getEdits: function (text) {
      this.$store.state.data.announce.announceEdit = text
      this.$store.state.data.announce.state = 2
      this.$emit('create')
    },
    getNewShow: function () {
      this.$store.state.data.announce.announceEdit = []
      this.$store.state.data.announce.state = 1
      this.$emit('create')
    },
    searchs: function () {
      if (this.search) {
        this.loading = true
        const search = this.search
        console.log(search)
        listSearch({ ...search }).then(res => {
          console.log(res)
          this.dataOflist = []
          this.dataOflist = res.data.data
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      }
    },
    deleteAll: function () {
      this.search = {}
      this.dataOflist = this.$store.state.data.announce.announceAll
    },
    deleteAnnounce: function () {
      announDelete({
        id: this.chooseId
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '删除成功'
          })
          this.shows = false
          this.loading = false
        }
      }).catch(res => {
        this.pageLoading = false
      })
    },
    chooseAnnouceId: function (num) {
      console.log(num)
      this.chooseId = num
      this.loading = true
      this.shows = true
    }
  }
}
</script>

<style scoped>

</style>

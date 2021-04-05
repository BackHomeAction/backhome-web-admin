<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="应用名称">
                <a-input v-model="search.name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-button type="primary" @click="openSearch">查询</a-button>
            <a-button type="default" @click="deleteSearch" style="margin-left: 8px">重置</a-button>
          </a-row>
          <div class="table-operator">
            <a-button type="primary" @click="createThree"><a-icon type="plus" />新建</a-button>
          </div>
          <a-row :gutter="48" >
            <a-spin :spinning="pageLoading">
              <a-table rowKey="id" :pagination="pagination" style="padding: 0 24px" :columns="columns" :data-source="datas">
                <div slot="action" slot-scope="text">
                  <a @click="editThree(text)">编辑</a>
                  <a-divider type="vertical" />
                  <a @click="showModal(text.id)">删除</a>
                </div>
              </a-table>
            </a-spin>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-modal :visible="shows" title="删除提醒" @ok="deleteThree" @cancel="shows = false;pageLoading = false">
      <p>您确定要删除ID为{{ '' + ' ' + chooseId + ' ' +'' }}的开放平台应用么?</p>
    </a-modal>
  </div>
</template>

<script>
import { threeDelete, threeSearch } from '@/api/announce'

export default {
  mounted () {
    this.pagination.pageSize = 10
    this.getData()
  },
  name: 'List',
  data () {
    return {
      search: {},
      pageLoading: false,
      pagination: {},
      chooseId: '',
      shows: false,
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '应用名',
          dataIndex: 'name'
        },
        {
          title: 'APP-ID',
          dataIndex: 'appId'
        },
        {
          title: '创建时间',
          dataIndex: 'registerTime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: []
    }
  },
  methods: {
    goEdit: function () {
      this.$emit('onCreate')
    },
    createThree: function () {
      this.$store.state.data.openOut.state = 1
      this.$store.state.data.openOut.openEdit = []
      console.log(this.$store.state.data.openOut.openEdit)
      this.goEdit()
    },
    deleteSearch: function () {
      this.search = {}
      this.datas = []
      this.datas = this.$store.state.data.openOut.openAll
    },
    openSearch: function () {
      this.pageLoading = true
      if (this.search) {
        threeSearch({
          name: this.search.name
        }).then(res => {
          console.log(res)
          this.datas = []
          this.datas = res.data.data
          this.pageLoading = false
        }).catch(res => {
          this.pageLoading = false
        })
      } else {
        this.$message.info('请输入查询的应用名称')
      }
    },
    showModal: function (id) {
      this.chooseId = id
      this.shows = true
      this.pageLoading = true
    },
    deleteThree: function () {
      if (this.chooseId) {
        threeDelete({
          clientId: this.chooseId
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.$notification.success({
              message: '成功',
              description: '删除成功'
            })
            this.shows = false
            this.pageLoading = false
            this.datas = []
            this.getData()
          }
          this.pageLoading = false
        }).catch(res => {
          this.pageLoading = false
        })
      }
    },
    getData: function () {
      this.pageLoading = true
      threeSearch().then(res => {
        this.datas = res.data.data
        console.log(this.datas)
        this.$store.state.data.openOut.openAll = res.data.data
        this.pageLoading = false
      }).catch(res => {
        this.pageLoading = false
      })
    },
    editThree: function (text) {
      this.$store.state.data.openOut.openEdit = text
      this.$store.state.data.openOut.state = 2
      console.log(this.$store.state.data.openOut.state)
      this.goEdit()
    }
  }
}
</script>

<style scoped>

</style>

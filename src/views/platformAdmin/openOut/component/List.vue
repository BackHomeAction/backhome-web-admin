<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="应用名称:" >
                <a-input v-model="search.name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col>
              <a-button type="primary" @click="openSearch">查询</a-button>
              <a-button type="default" @click="deleteSearch" style="margin-left:1%">重置</a-button>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :span="6">
              <a-button type="primary" @click="goEdit"><a-icon type="plus" />新建</a-button>
            </a-col>
          </a-row>
          <a-row :gutter="48" style="margin-top: 15px">
            <a-col>
              <a-spin :spinning="pageLoading">
                <a-table :columns="columns">
                  <div slot="action" slot-scope="text">
                    <a @click="editThree(text)">编辑</a>
                    <a-divider type="vertical" />
                    <a @click="showModal(text.id)">删除</a>
                  </div>
                </a-table>
              </a-spin>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-modal :visible="shows" title="删除提醒" @ok="deleteThree" @cancel="shows = false;pageLoading = false">
      <p>您确定要删除ID为{{ '' + ' ' + chooseId + ' ' +'' }}的BannerID么?</p>
    </a-modal>
  </div>
</template>

<script>
import { threeDelete, threeSearch } from '@/api/announce'

export default {
  mounted () {
    this.getData()
  },
  name: 'List',
  data () {
    return {
      search: {},
      pageLoading: false,
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
      this.goEdit()
    },
    deleteSearch: function () {
      this.search = {}
      this.datas = []
      this.datas = this.$store.state.data.openOut.openAll
    },
    openSearch: function () {
      if (this.search) {
        this.pageLoading = true
        threeSearch({
          name: this.search.name
        }).then(res => {
          console. log(res)
          this.datas = []
          this.datas = res.data.data
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
            this.datas = []
            this.getData()
          } else {
            this.$notification.error({
              message: '失败',
              description: '删除失败，请联系管理员'
            })
          }
          this.pageLoading = false
        })
      }
    },
    getData: function () {
      threeSearch().then(res => {
        console.log(res)
        this.datas = res.data.data
        this.$store.state.data.openOut.openAll = res.data.data
      })
    },
    editThree: function (text) {
      this.$store.state.data.openOut.openEdit = text
      this.$store.state.data.openOut.state = 2
      this.goEdit()
    }
  }
}
</script>

<style scoped>

</style>

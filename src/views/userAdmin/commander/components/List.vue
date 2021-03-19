<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户ID">
                <a-input @change="changeData" v-model="search.id" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="searchFamily()">查询</a-button>
              <a-button @click="getAll" style="margin-left:5%">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row>
        <a-col>
          <a-button type="primary" style="margin-bottom: 10px" @click="createPages" ><a-icon type="plus"/>新建</a-button>
        </a-col>
      </a-row>
      <div>
        <a-spin :spinning="loadingPage">
          <a-table :pagination="WatchPage" :columns="columns" rowKey="id" :data-source="datas">
            <span slot="state" slot-scope="text">
              <a-badge :status="text?'success':'default'" :text="text?'正常':'已停用'"></a-badge>
            </span>
            <div slot-scope="text" slot="location">
              <span>{{ text.province ? (text.province+ ' ' +text.city+ ' ' +text.district) : ' ' }}</span>
            </div>
            <div slot-scope="text" slot="identity">
              <span>{{ (text=== 3) ? '区域指战员' : ((text=== 5)?'总指战员':'系统指战员') }}</span>
            </div>
            <span slot="sex" slot-scope="sex">{{ (sex=== 1 )?'男':'女' }}</span>
            <span slot="action" slot-scope="list">
              <template>
                <a @click="editPage(list)">编辑</a>
                <a-divider type="vertical" />
                <a @click="watchPage(list)" >查看</a>
              </template>
            </span>
          </a-table>
        </a-spin>
      </div>
    </a-card>

  </div>
</template>

<script>
import { RegionSelector } from '@/components'
import { adminByid, adminList } from '@/api/admin'
// import { mapState } from 'vuex'
export default {
  mounted () {
    this.all = this.dataGetFun()
    this.$store.state.roleId = this.$store.state.user.info.roleId
  },
  components: {
    RegionSelector, adminByid, adminList
  },
  name: 'Search',
  data () {
    return {
      roleId: null,
      loadingPage: true,
      WatchPage: {},
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
          title: '性别',
          dataIndex: 'sex',
          width: '80px',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '身份',
          dataIndex: 'roleId',
          scopedSlots: { customRender: 'identity' },
          width: '100px'
        },
        {
          title: '指战区域',
          scopedSlots: { customRender: 'location' },
          width: '150px'
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
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: [],
      search: {
        id: ''
      },
      all: [],
      advanced: false,
      showOrigin: false
    }
  },
  methods: {
    dataGetFun: function () {
      adminList().then(res => {
        this.datas = []
        this.loadingPage = true
        console.log(res.data.data)
        console.log(res.data.data.length)
        this.$store.state.commanderList.List = res.data.data
        this.datas = this.$store.state.commanderList.List
        this.loadingPage = false
        this.WatchPage.total = res.data.data.length
        this.WatchPage.pageSize = 10
        return res.data.data
      })
    },
    changeData: function () {
      if (this.search.id === null || this.search.id === '') {
        this.getAll()
      }
    },
    changeShow: function () {
      this.advanced = !this.advanced
    },
    searchFamily: function () {
      if (!(this.search.id === null)) {
        adminByid({
          id: parseInt(this.search.id) }).then(res => {
          this.datas = []
          this.datas[0] = res.data
          this.WatchPage.total = res.data.data.length
          this.WatchPage.pageSize = 10
        })
      }
    },
    getAll: function () {
      this.dataGetFun()
    },
    editPage: function (data) {
      this.$store.state.commander.editUser = data
      this.$emit('onEdit')
    },
    watchPage: function (data) {
      this.$store.state.commander.watchUser = data
      this.$emit('onWatch')
    },
    createPages: function () {
      this.$emit('onCreate')
    },
    identifyChange: function (value) {
      if (value === '2') {
        this.showOrigin = true
      } else {
        this.showOrigin = false
      }
    }
  }
}
</script>

<style scoped>

</style>

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
              <a-button style="margin-left: 8px" @click="getAll">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div>
        <a-spin :spinning="loadingPage">
          <a-table :pagination="WatchPage" :columns="columns" :data-source="datas" rowKey="id">
            <span slot="sex" slot-scope="text"> {{ text ? (text === 1 ? '男' : '女') : '' }}</span>
            <span slot="state" slot-scope="text">
              <a-badge :status="text?'success':'default'" :text="text?'正常':'已停用'"></a-badge>
            </span>
            <span slot="location" slot-scope="text">
              {{ ((text.province)!==null)?(text.province + ' ' + text.city + ' ' + text.district):'' }}
            </span>
            <span slot="action" slot-scope="text">
              <template>
                <a @click="editPage(text)">编辑</a>
                <a-divider type="vertical" />
                <a @click="watchPage(text)" >查看</a>
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
import { getFamilyData, getFamilyByid } from '@/api/familyData'
export default {
  mounted () {
    getFamilyData().then(res => {
      console.log(res)
      this.$store.state.familyList = res.data.data
      this.datas = this.$store.state.familyList
      this.WatchPage.total = res.data.totalCount
      this.WatchPage.pageSize = 10
      this.loadingPage = false
    })
  },
  name: 'Search',
  components: {
    RegionSelector, getFamilyData, getFamilyByid
  },
  data: function () {
    return {
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
          width: '120px'
        },
        {
          title: '位置',
          scopedSlots: { customRender: 'location' },
          width: '230px'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          width: '130px'
        },
        {
          title: '注册时间',
          dataIndex: 'registerTime',
          width: '150px'
        },
        {
          title: '操作',
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
      getFamilyByid({
        familyId: this.search.id
      }).then(res => {
        console.log(res)
        this.datas = []
        this.datas[0] = res.data
      })
    },
    getAll: function () {
      this.datas = []
      this.datas = this.$store.state.familyList
    },
    editPage: function (edit) {
      this.$store.state.familyData.editUser = edit
      this.$emit('onEdit')
    },
    watchPage: function (watch) {
      this.$store.state.familyData.watchUser = watch
      this.$emit('onWatch')
    },
    changeData: function () {
      if (this.search.id === null || this.search.id === '') {
        this.getAll()
      }
    }
  }
}
</script>

<style scoped>

</style>

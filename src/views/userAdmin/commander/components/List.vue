<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户 ID">
                <a-input v-model="search.id" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="search.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select v-model="search.state" placeholder="请选择" default-value="0">
                    <a-select-option value="1">正常</a-select-option>
                    <a-select-option value="2">已停用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号">
                  <a-input v-model="search.phone" placeholder="请输入"/>
                </a-form-item>
              </a-col>
              <a-col :md="16" :sm="24">
                <a-form-item label="地区">
                  <region-selector v-model="search.region" />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="searchFamily">查询</a-button>
                <a-button style="margin-left: 8px" @click="getAll">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
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
              <span>{{ (text === 3) ? '区域指战员' : ((text=== 5)?'总指战员':'系统指战员') }}</span>
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
import { adminList } from '@/api/admin'
export default {
  mounted () {
    this.all = this.dataGetFun()
    this.$store.state.data.roleId = this.$store.state.user.info.roleId
  },
  components: {
    RegionSelector, adminList
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
          dataIndex: 'id'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '160px'
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
          width: '120px'
        },
        {
          title: '指战区域',
          scopedSlots: { customRender: 'location' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          width: '100px'
        },
        {
          title: '注册时间',
          dataIndex: 'registerTime'
        },
        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: [],
      search: {},
      all: [],
      advanced: false,
      showOrigin: false
    }
  },
  methods: {
    dataGetFun: function () {
      this.loadingPage = true
      adminList().then(res => {
        this.datas = []
        this.$store.state.data.commanderList.List = res.data.data
        this.datas = this.$store.state.data.commanderList.List
        this.loadingPage = false
        this.WatchPage.total = res.data.data.length
        this.WatchPage.pageSize = 10
        return res.data.data
      }).catch(res => {
        this.loadingPage = false
      })
    },
    changeShow: function () {
      this.advanced = !this.advanced
    },
    searchFamily: function () {
      this.loadingPage = true
      if (this.search) {
        const search = this.search
        if (this.search.region) {
          this.search.province = this.search.region[0]
          this.search.district = this.search.region[1]
          this.search.city = this.search.region[2]
          delete search.region
        } else {
          delete search.region
          console.log(search)
          adminList({ ...search }).then(res => {
            console.log(res)
            this.datas = []
            this.datas = res.data.data
            if (!res.data.data) {
              this.datas = []
            }
            this.loadingPage = false
          }).catch(res => {
            this.loadingPage = false
          })
        }
      } else {
        this.getAll()
        this.loadingPage = false
      }
    },
    getAll: function () {
      this.dataGetFun()
    },
    editPage: function (data) {
      this.$store.state.data.commander.editUser = data
      this.$emit('onEdit')
    },
    watchPage: function (data) {
      this.$store.state.data.commander.watchUser = data
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
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style scoped>

</style>

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
              <a-form-item label="备忘范围">
                <a-select v-model="search.area" placeholder="请选择" >
                  <a-select-option :value="2">案件级</a-select-option>
                  <a-select-option :value="1">全局级</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-button type="primary" @click="searchit()">查询</a-button>
            <a-button type="default" @click="getFirst()" style="margin-left: 8px" >重置</a-button>
          </a-form>
        </a-row>
        <a-row :gutter="48" >
          <a-col :md="8" :sm="24">
            <div class="table-operator">
              <a-button type="primary" @click="getCreate()"><a-icon type="plus" />新建</a-button>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-spin :spinning="loadingTable">
            <a-table style="padding: 0 24px" rowKey="id" :columns="columns" :data-source="datas">
              <span slot="area" slot-scope="text">{{ text === 1? '全局级' : '案件级' }}</span>
              <span slot-scope="text" slot="caseid">{{ text ? text : 'ALL' }}</span>
              <div slot="action" slot-scope="text">
                <a @click="Edit(text)">编辑</a>
                <a-divider type="vertical" />
                <a @click="showstable(text)">删除</a>
              </div>
            </a-table>
          </a-spin>
        </a-row>
      </div>
    </a-card>
    <a-modal @ok="deletes(chooseId)" @cancel="() => { shows = false }" :visible="shows" title="删除提醒" >
      <p>您确定要删除ID为{{ '' + ' ' + chooseId + ' ' +'' }}的公告么?</p>
    </a-modal>
  </div>
</template>

<script>
import { deleMemory, getMemory } from '@/api/memory'
export default {
  mounted () {
    this.init()
  },
  name: 'List',
  placeIn: '请输入',
  data () {
    return {
      loadingTable: false,
      shows: false,
      firstData: [],
      search: {},
      datas: [],
      chooseId: '',
      loading: false,
      placeIn: '请输入',
      columns: [
        {
          title: '备忘录ID',
          dataIndex: 'id',
          width: '150px'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '备忘域',
          dataIndex: 'isGlobal',
          scopedSlots: { customRender: 'area' }
        },
        {
          title: '案件编号',
          dataIndex: 'caseId',
          scopedSlots: { customRender: 'caseid' }
        },
        {
          title: '发布人',
          dataIndex: 'name'
        },
        {
          title: '发布时间',
          dataIndex: 'createAt'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    init () {
      this.loadingTable = true
      getMemory().then(res => {
        this.loadingTable = false
        console.log(res)
        this.firstData = res.data
        this.datas = res.data
      })
    },
    searchit () {
      this.loadingTable = true
      if (this.search.title || this.search.area) {
        const search = {}
        search.isGlobal = this.search.area
        search.title = this.search.title
        if (!search.isGlobal) {
          delete search.isGlobal
        }
        if (!search.title) {
          delete search.title
        }
        console.log(search)
        getMemory({ ...search }).then(res => {
          this.loadingTable = false
          if (res.data) {
            this.datas = []
            this.datas = res.data
          } else {
            this.datas = []
          }
        }).finally(res => {
          this.loadingTable = false
          console.log(res)
        })
      } else {
        this.loadingTable = false
        this.$message.error('请输入搜索项', 10)
      }
    },
    getCreate () {
      this.$store.state.data.memoryControl = 0
      this.$store.state.data.memoryData = {}
      this.$emit('onEdit')
    },
    getFirst () {
      this.loadingTable = true
      this.search = {}

      setTimeout(() => { this.loadingTable = false; this.datas = this.firstData }, 500)
    },
    Edit (text) {
      this.$store.state.data.memoryControl = 1
      this.$store.state.data.memoryData = text
      this.$emit('onEdit')
    },
    showstable (text) {
      this.chooseId = text.id
      this.shows = true
    },
    deletes (text) {
      this.loadingTable = true
      deleMemory({ id: text }).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '备忘录删除成功'
          })
        }
        this.loadingTable = false
        this.shows = false
        this.init()
      }).finally(res => {
        this.loadingTable = false
        this.shows = false
        this.init()
      })
    }
  }
}
</script>

<style scoped>

</style>

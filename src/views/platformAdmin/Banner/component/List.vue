<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="48" >
          <a-form layout="inline">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户 ID">
                <a-input v-model="search.id" placeholder="请输入"/>
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
            <a-button type="primary">新建</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48" style="margin-top: 30px;">
          <a-table :pagination="pagination" rowKey="id" :columns="columns" :data-source="dataOflist">
            <div slot="action">
              <span>
                <a>查看</a>
                <a-divider type="vertical" />
                <a>编辑</a>
              </span>
            </div>
          </a-table>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  mounted () {
    this.pagination.pageSize = 10
    this.pagination.total = 80
  },
  name: 'List',
  placeIn: '请输入',
  data () {
    return {
      pagination: {},
      search: {},
      placeIn: '请输入',
      columns: [
        {
          title: 'BannerID',
          dataIndex: 'id'
        },
        {
          title: 'Banner图片',
          dataIndex: 'image'
        },
        {
          title: '对应公告',
          dataIndex: 'startObj'
        },
        {
          title: '发布人',
          dataIndex: 'startPelop'
        },
        {
          title: '发布时间',
          dataIndex: 'startTime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataOflist: [
        {
          id: '2',
          image: 'sadads',
          startTime: '2021-3-9',
          startPelop: '赵肖云',
          startObj: '老人'
        }
      ],
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
      this.$emit('toEdit')
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

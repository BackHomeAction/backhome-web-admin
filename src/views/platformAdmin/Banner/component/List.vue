<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="48" >
          <a-form layout="inline">
            <a-col :md="8" :sm="24">
              <a-form-item label="对应公告标题">
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
          <a-spin :spinning="loading">
            <a-table :pagination="pagination" rowKey="id" :columns="columns" :data-source="dataOflist">
              <div slot-scope="url" slot="urls">
                <a-avatar shape="square" :size="120" :src="url" />
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
import { bannerSearch } from '@/api/announce'
export default {
  mounted () {
    this.pagination.pageSize = 10
    this.pagination.total = 80
    bannerSearch().then(res => {
      console.log(res)
      this.dataOflist = res.data.data
      this.$store.state.data.banner.bannerAll = res.data.data
      this.dataList()
    })
  },
  name: 'List',
  placeIn: '请输入',
  data () {
    return {
      pagination: {},
      loading: false,
      search: {},
      placeIn: '请输入',
      columns: [
        {
          title: 'BannerID',
          dataIndex: 'noticeId'
        },
        {
          title: 'Banner图片',
          dataIndex: 'url',
          scopedSlots: { customRender: 'urls' }
        },
        {
          title: '对应公告',
          dataIndex: 'title'
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
      console.log('准备跳转')
      this.$emit('toEdit')
    },
    searchs: function () {
      console.log(this.search)
    },
    deleteAll: function () {
      this.search = {}
    },
    dataList: function () {
      // this.dataOflist.url = JSON.parse(this.dataOflist.url)
    }
  }

}
</script>

<style scoped>

</style>

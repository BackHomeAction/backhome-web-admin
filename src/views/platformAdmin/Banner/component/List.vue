<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="48" >
          <a-form layout="inline">
            <a-col :md="8" :sm="24">
              <a-form-item label="对应公告标题">
                <a-input v-model="search.title" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-button type="primary" @click="searchs">查询</a-button>
            <a-button type="default" @click="deleteAll" style="margin-left: 8px" >重置</a-button>
          </a-form>
        </a-row>
        <a-row :gutter="48" >
          <a-col :md="8" :sm="24">
            <div class="table-operator">
              <a-button type="primary" @click="getEditOrNew" ><a-icon type="plus" />新建</a-button>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-spin :spinning="loading">
            <a-table style="padding: 0 24px" :pagination="pagination" rowKey="id" :columns="columns" :data-source="dataOflist">
              <div slot-scope="url" slot="urls" v-viewer>
                <img class="table__image" :src="url" />
              </div>
              <div slot="action" slot-scope="text" >
                <span>
                  <a @click="editBanner(text)">编辑</a>
                  <a-divider type="vertical" />
                  <a @click="showModal(text.id)">删除</a>
                </span>
              </div>
            </a-table>
          </a-spin>
        </a-row>
      </div>
    </a-card>
    <a-modal :visible="shows" title="删除提醒" @ok="deleteBanner" @cancel="stopShow">
      <p>您确定要删除ID为{{ '' + ' ' + chooseId + ' ' +'' }}的BannerID么?</p>
    </a-modal>
  </div>
</template>

<script>
import { bannerSearch, bannerDelete, bannerUserSearch } from '@/api/announce'
export default {
  mounted () {
    this.pagination.pageSize = 10
    this.loading = true
    this.getdata()
  },
  name: 'List',
  placeIn: '请输入',
  data () {
    return {
      pagination: {},
      loading: false,
      search: {},
      shows: false,
      placeIn: '请输入',
      chooseId: null,
      columns: [
        {
          title: 'BannerID',
          dataIndex: 'id',
          width: '120px'
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
    getEditOrNew: function () {
      this.$store.state.data.banner.bannerEdit = {}
      this.$store.state.data.banner.state = 1
      this.$emit('toEdit')
    },
    searchs: function () {
      if (this.search) {
        this.loading = true
        const search = this.search
        console.log('准备查询')
        bannerUserSearch({ ...search }).then(res => {
          this.dataOflist = []
          this.dataOflist = res.data.data
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      } else {
        this.$message.info('请检查搜索输入项')
      }
      // this.loading = false
    },
    deleteAll: function () {
      this.search = {}
      this.dataOflist = []
      this.dataOflist = this.$store.state.data.banner.bannerAll
    },
    dataList: function () {},
    editBanner: function (text) {
      console.log(text)
      this.$store.state.data.banner.bannerEdit = text
      this.$store.state.data.banner.state = 2
      this.$emit('toEdit')
    },
    deleteBanner: function () {
      console.log(this.chooseId)
      bannerDelete({
        id: this.chooseId
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$notification.success({
            message: '成功',
            description: '删除成功'
          })
          this.dataOflist = []
          this.getdata()
        }
        this.loading = false
      }).catch(res => {
        this.loading = false
      })
    },
    showModal: function (id) {
      this.chooseId = id
      this.loading = true
      this.shows = true
    },
    getdata: function () {
      bannerSearch().then(res => {
        console.log(res)
        this.dataOflist = res.data.data
        this.$store.state.data.banner.bannerAll = res.data.data
        this.pagination.pageSize = 10
        this.loading = false
      }).catch(res => {
        this.loading = false
      })
    },
    stopShow: function () {
      this.shows = false
      this.loading = false
    }
  }

}
</script>

<style lang="less" scoped>
.table {
  &__image {
    width: 120px;
    height: 80px;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>

<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="应用名称:" >
                <a-input v-model="search.name"></a-input>
              </a-form-item>
            </a-col>
            <a-col>
              <a-button type="primary" >查询</a-button>
              <a-button type="default" style="margin-left:1%">重置</a-button>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :span="6">
              <a-button type="primary"><a-icon type="plus" />新建</a-button>
            </a-col>
          </a-row>
          <a-row :gutter="48" style="margin-top: 15px">
            <a-col>
              <a-table :columns="columns">
                <div slot="action">
                  <a>编辑</a>
                  <a>删除</a>
                </div>
              </a-table>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      search: {},
      columns: [
        {
          title: '#',
          dataIndex: 'num'
        },
        {
          title: '应用名',
          dataIndex: 'name'
        },
        {
          title: 'APP-ID',
          dataIndex: 'id'
        },
        {
          title: '创建时间',
          dataIndex: 'startTime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: [
        {
          num: '2',
          name: '阿里云支持',
          id: '15',
          startTime: '2021-03-09'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>

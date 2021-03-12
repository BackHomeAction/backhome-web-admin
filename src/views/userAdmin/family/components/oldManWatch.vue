<template>
  <div>
    <a-card :bordered="false">

      <a-row :gutter="48" type="flex" justify="center">
        <a-col :span="22">
          <!--    <page-go-back-top @click="$emit('onGoBack')" ><a><a-icon type="left" /></a>&nbsp;&nbsp;</page-go-back-top> <a-page-header :title="name"></a-page-header>-->
          <a-page-header style="margin-left: -22px" :title="name" @back="$emit('onGoBack')" />
        </a-col>
        <a-col :span="2" style="display: flex;align-items: center"><a-button @click="oldManEdit" type="default">编辑</a-button></a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col >
          <a-descriptions size="small" :column="3" >
            <a-descriptions-item label="性别">
              {{ source[0] }}
            </a-descriptions-item>
            <a-descriptions-item label="身份证号">
              {{ source[1] }}
            </a-descriptions-item>
            <a-descriptions-item label="出生日期">
              {{ source[2] }}
            </a-descriptions-item>
            <a-descriptions-item label="常居地">
              {{ source[3] }}
            </a-descriptions-item>
            <a-descriptions-item label="详细地址">
              {{ source[4] }}
            </a-descriptions-item>
            <a-descriptions-item label="常去地点">
              {{ source[5] }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
      <a-row :gutter="48" type="flex" >
        <a-col>
          <a-avatar shape="square" :size="120" icon="user"></a-avatar>
        </a-col>
        <a-col>
          <a-avatar shape="square" :size="120" icon="user"></a-avatar>
        </a-col>
        <a-col>
          <a-avatar shape="square" :size="120" icon="user"></a-avatar>
        </a-col>
        <a-col>
          <a-avatar shape="square" :size="120" icon="user"></a-avatar>
        </a-col>
        <a-col>
          <a-avatar shape="square" :size="120" icon="user"></a-avatar>
        </a-col>

      </a-row>
    </a-card>
    <a-spin :spinning="orLoading">
      <a-card :bordered="false" style="margin-top: 24px;">
        <a-row :gutter="48" style="display: flex;align-items: center">
          <a-col :span="16">
            <a-page-header title="管辖任务"></a-page-header>
          </a-col>
          <a-col :span="18" style="display: flex;align-items: center">
            <a-radio-group v-model="chooseWatch" @change="changeChoose">
              <a-radio-button :value="0">
                全部
              </a-radio-button>
              <a-radio-button :value="1">
                进行中
              </a-radio-button>
              <a-radio-button :value="2">
                已完成
              </a-radio-button>
              <a-radio-button :value="3">
                已归档
              </a-radio-button>
              <a-radio-button :value="4">
                已取消
              </a-radio-button>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row :bordered="false">
          <a-table size="default" rowKey="id" :columns="columns" :data-source="datas">
            <span slot="id" slot-scope="text"><a @click="missionTo(text)" >{{ text }}</a></span>
            <div slot="state" slot-scope="text">
              <a-badge :status="text?(( text!==1 )?((text===2)?'processing':'default'):'success'):'error'" :text="text?(( text!==1 )?((text===2)?'进行中':'已取消'):'已完成'):'已超时'"> </a-badge>
            </div>
            <span slot="use" slot-scope="text"><a @click="missionTo(text)" >查看</a></span>
          </a-table>
        </a-row>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-duplicates
import PageGoBackTop from '@/components'
// eslint-disable-next-line import/no-duplicates
import STable from '@/components'
export default {
  data () {
    return {
      name: '赵肖云',
      source: ['男', '123123123455623', '2021-01-03', '天津市 天津市 西青区', '天津市 天津市 西青区', '天津工业大学'],
      chooseWatch: 0,
      orLoading: false,
      datas: [
        {
          id: '#114645',
          state: 0,
          address: '天津工业大学软件园食堂',
          time: '2011-12-24 23:12:00'
        },
        {
          id: '#114645',
          state: 1,
          address: '天津工业大学软件园食堂',
          time: '2011-12-24 23:12:00'
        },
        {
          id: '#114645',
          state: 2,
          address: '天津工业大学软件园食堂',
          time: '2011-12-24 23:12:00'
        },
        {
          id: '#114645',
          state: 3,
          address: '天津工业大学软件园食堂',
          time: '2011-12-24 23:12:00'
        }
      ],
      columns: [
        {
          title: '任务ID',
          width: '160px',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          width: '250px'
        },
        {
          title: '走失地点',
          dataIndex: 'address',
          scopedSlots: { customRender: 'identity' },
          width: '500px'
        },
        {
          title: '创建时间',
          dataIndex: 'time',
          scopedSlots: { customRender: 'time' },
          width: '400px'
        },
        {
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'use' },
          width: '100px'
        }
      ]
    }
  },
  components: {
    PageGoBackTop, STable
  },
  name: 'Watch',
  methods: {
    changeChoose: function () {
      console.log(this.chooseWatch)
    },
    oldManEdit: function () {
      this.$emit('oldEdit')
    }
  }
}
</script>

<style scoped>

</style>

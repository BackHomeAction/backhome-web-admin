<template>
  <div>
    <a-card :bordered="false">

      <a-row :gutter="48" type="flex" justify="center">
        <a-col :span="22">
          <!--    <page-go-back-top @click="$emit('onGoBack')" ><a><a-icon type="left" /></a>&nbsp;&nbsp;</page-go-back-top> <a-page-header :title="name"></a-page-header>-->
          <a-page-header style="margin-left: -22px" :title="source.name" @back="$emit('onGoBack')" />
        </a-col>
        <a-col :span="2" style="display: flex;align-items: center"><a-button @click="handleToEdit" type="default">编辑</a-button></a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col >
          <a-descriptions size="small" :column="3" >
            <a-descriptions-item label="账号">
              {{ source.userName }}
            </a-descriptions-item>
            <a-descriptions-item label="身份">
              {{ (source.roleId=== 3) ? '总指战员' : ((source.roleId=== 5)?'区域指战员':'系统指战员') }}
            </a-descriptions-item>
            <a-descriptions-item label="指战区域">
              {{ source.province ? (source.province + ' ' + source.district + ' ' + source.city ) : '暂无' }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时间">
              {{ source.registerTime }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时长">
              {{ `${getInTime}` }}
            </a-descriptions-item>
          </a-descriptions>
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
          <a-table size="default" :columns="columns" :data-source="datas">
            <span slot="ids" slot-scope="text"><a @click="missionTo(text)" >{{ text }}</a></span>
            <div slot="state" slot-scope="text">
              <a-badge :status="text?(( text!==1 )?((text===2)?'processing':'default'):'success'):'error'" :text="text?(( text!==1 )?((text===2)?'进行中':'已取消'):'已完成'):'已超时'"> </a-badge>
            </div>
            <span slot="use" slot-scope="text"><a @click="missionTo(text.id)" >查看</a></span>
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
import dayjs from 'dayjs'
import { missionList } from '@/api/missionList'
export default {
  mounted () {
    this.source = this.$store.state.commander.watchUser
    // this.getTime()
    // this.missionGet(this.source.id)
    //  这个是指战员的关联案件到时候再说
  },
  data () {
    return {
      source: [],
      chooseWatch: 0,
      orLoading: false,
      getInTime: null,
      familyNum: {},
      datas: [
        {
          id: '#114643',
          state: 0,
          address: '天津工业大学软件园食堂',
          time: '2011-12-24 23:12:00'
        },
        {
          id: '#114644',
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
          id: '#114646',
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
          scopedSlots: { customRender: 'ids' }
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
          scopedSlots: { customRender: 'use' },
          width: '100px'
        }
      ]
    }
  },
  components: {
    PageGoBackTop, STable, dayjs, missionList
  },
  name: 'Watch',
  methods: {
    changeChoose: function () {
      console.log(this.chooseWatch)
    },
    handleToEdit: function () {
      this.$emit('onEdit')
    },
    getTime: function () {
      const time = this.source.registerTime
      if (!time) {
        this.$notification.open({
          message: '无信息',
          description:
            '请检查指战员信息或联系系统管理员',
          onClick: () => {
            console.log('Notification Clicked!')
          }
        })
      }
      this.getInTime = dayjs(time).fromNow(true)
      console.log(this.getInTime)
    }
  },
  missionGet: function () {
  }
}

</script>

<style scoped>

</style>

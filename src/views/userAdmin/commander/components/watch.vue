<template>
  <div>
    <a-card :bordered="false">
      <a-row :gutter="48" type="flex" justify="center">
        <a-col :span="22">
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
              {{ source.registerTime | registerTimeFromNowFilter }}
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
          <a-table :pagination="WatchPage" rowKey="id" size="default" :columns="columns" :data-source="datas">
            <span slot="ids" slot-scope="text"><a @click="missionTo(text)" >{{ text }}</a></span>
            <div slot="state" slot-scope="text">
              <a-badge :status="(text !== 1)?(( text!==2 )?((text===3)?'error':'default'):'success'):'processing'" :text="(text !== 1)?(( text!==2 )?((text===3)?'已超时':'已取消'):'已完成'):'进行中'"> </a-badge>
            </div>
            <span slot="use" slot-scope="text"><a @click="missionTo(text.id)" >查看</a></span>
          </a-table>
        </a-row>
      </a-card>
    </a-spin>
    <a-modal v-model="visible" title="权限警告" @ok="handleOk" >
      <p>系统管理员不得更改超级管理员信息!!!</p>
    </a-modal>
  </div>
</template>

<script>
import { PageGoBackTop } from '@/components'
import dayjs from 'dayjs'
import { adminCase } from '@/api/admin'
export default {
  mounted () {
    this.source = this.$store.state.data.commander.watchUser
    this.missionGet(this.source.id)
  },
  filters: {
    registerTimeFromNowFilter (val) {
      return dayjs(val).fromNow(true)
    }
  },
  data () {
    return {
      visible: false,
      source: [],
      WatchPage: {},
      chooseWatch: 0,
      orLoading: false,
      getInTime: null,
      familyNum: {},
      datas: [],
      All: [],
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
    PageGoBackTop, dayjs, adminCase
  },
  name: 'Watch',
  methods: {
    changeChoose: function (e) {
      this.datas = []
      adminCase({
        id: this.source.id,
        state: e.target.value
      }).then(res => {
        this.datas = res.data.data
        if (res.data.totalCount) {
          this.WatchPage.total = res.data.totalCount
          this.WatchPage.pageSize = 10
        }
      })
    },
    handleToEdit: function () {
      if ((this.$store.state.data.roleId === 4) && (this.source.roleId === 3)) {
        this.showModal()
      }
      this.$store.state.data.commander.editUser = this.source
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
    },
    missionGet: function (e) {
      adminCase({
        id: this.source.id
      }).then(res => {
        console.log('案件')
        this.datas = res.data.data
        if (res.data.data.length) {
          this.WatchPage.total = res.data.totalCount
          this.WatchPage.pageSize = 10
        }
      })
    },
    missionTo: function (text) {
      var id = text
      this.$router.push({ path: '/missionAdmin/missionList/', query: { id: id } })
    },
    handleOk: function () {
      this.visible = false
      this.$emit('onGoBack')
    },
    showModal () {
      this.visible = true
    }
  }
}

</script>

<style scoped>

</style>

<template>
  <div>
    <a-card :bordered="false">
      <a-row :gutter="48" type="flex" justify="center">
        <a-col :span="22">
          <a-page-header style="margin-left: -22px" :title="this.source.name" @back="$emit('onGoBack')" />
        </a-col>
        <a-col :span="2" style="display: flex;align-items: center"><a-button @click="handleToEdit" type="default">编辑</a-button></a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col >
          <a-descriptions size="small" :column="3" >
            <a-descriptions-item label="性别">
              {{ (source.sex===1)?'男':'女' }}
            </a-descriptions-item>
            <a-descriptions-item label="手机号">
              {{ source.phone }}
            </a-descriptions-item>
            <a-descriptions-item label="长居地">
              {{ source.province?( source.province+ ' ' +source.city+ ' ' +source.district ): '' }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时间">
              {{ source.registerTime }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时长">
              {{ source.registerTime | registerTimeFromNowFilter }}
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-badge :status="(source.state===1)?'success':'default'" :text="(source.state===1)?'正常':'停用'" > </a-badge>
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-card>
    <a-spin :spinning="oldManloading">
      <a-card :bordered="false" style="margin-top: 30px">
        <a-page-header title="老人信息"></a-page-header>
        <a-table :pagination="oldPage" rowKey="id" size="default" :columns="oldMancol" :data-source="oldData" >
          <span slot="sex" slot-scope="text">{{ (text===1)?'男':'女' }}</span>
          <span slot="use" slot-scope="text"><a @click="oldManinf(text)">查看</a></span>
        </a-table>
      </a-card>
    </a-spin>
    <a-spin :spinning="orLoading">
      <a-card :bordered="false" style="margin-top: 24px;">
        <a-row :gutter="48" style="display: flex;align-items: center">
          <a-col :span="16">
            <a-page-header title="关联任务"></a-page-header>
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
          <a-table :pagination="missionPage" rowKey="id" size="default" :columns="columns" :data-source="datas">
            <span slot="id" slot-scope="text"><a @click="missionTo(text)" >{{ '#'+ text }}</a></span>
            <div slot="state" slot-scope="text">
              <a-badge :status="(text!==1)?(( text!==2 )?((text===3)?'error':'default'):'success'):'processing'" :text="(text!==1)?(( text!==2 )?((text===3)?'已归档':'已取消'):'已完成'):'进行中'"> </a-badge>
            </div>
            <div slot-scope="text" slot="where" >
              <span>{{ text.city ? (text.city + ' ' + text.district + ' ' + text.address): '' }}</span>
            </div>
            <span slot="use" slot-scope="text"><a @click="missionTo(text.id)" >查看</a></span>
          </a-table>
        </a-row>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { PageGoBackTop, STable } from '@/components'
import { familyMission, oldManinf } from '@/api/familyData'
import dayjs from '@/utils/dayjs'
export default {
  mounted () {
    this.source = this.$store.state.data.familyData.watchUser
    // console.log('家属信息')
    // console.log(this.source)
    this.oldManGet(this.source.id)
    this.missionListGet(this.source.id)
  },
  filters: {
    registerTimeFromNowFilter (val) {
      return dayjs(val).fromNow(true)
    }
  },
  data () {
    return {
      oldManloading: false,
      source: [],
      chooseWatch: 0,
      oldPage: {},
      missionPage: {},
      orLoading: false,
      datas: [],
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
          scopedSlots: { customRender: 'where' },
          width: '500px'
        },
        {
          title: '创建时间',
          dataIndex: 'startTime',
          scopedSlots: { customRender: 'time' },
          width: '400px'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'use' },
          width: '100px'
        }
      ],
      oldData: [],
      oldMancol: [
        {
          title: '姓名',
          width: '160px',
          dataIndex: 'name'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' },
          width: '250px'
        },
        {
          title: '出生日期 ',
          dataIndex: 'birthDate',
          width: '500px'
        },
        {
          title: '居住地区',
          dataIndex: 'province',
          width: '400px'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
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
    PageGoBackTop, STable, oldManinf
  },
  name: 'Watch',
  methods: {
    missionTo: function (id) {
      this.$router.push({ path: '/missionAdmin/missionList/', query: { id: id } })
    },
    handleToEdit: function () {
      this.$emit('onEdit')
    },
    oldManinf: function (text) {
      this.$store.state.data.oldManData.oldmanWatch = text
      // console.log(text)
      // console.log('传递之前')
      this.$emit('oldView')
    },
    oldManGet: function (id) {
      oldManinf({ familyId: id }).then(res => {
        this.oldData = res.data
        this.oldPage.total = res.data.length
        this.oldPage.pageSize = 5
      })
    },
    missionListGet: function (id) {
      familyMission({ familyId: id }).then(res => {
        console.log('案件在这里')
        console.log(res)
        this.datas = res.data.data
        this.missionPage.total = res.data.pageSize
        this.missionPage.pageSize = 5
      })
    },
    changeChoose: function (e) {
      familyMission({
        familyId: this.source.id,
        state: e.target.value
      }).then(res => {
        this.datas = []
        this.datas = res.data.data
        this.missionPage.total = res.data.pageSize
        this.missionPage.pageSize = 5
      })
    }
  }
}
</script>

<style scoped>

</style>

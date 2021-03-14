<template>
  <div>
    <a-card :bordered="false">

      <a-row :gutter="48" type="flex" justify="center">
        <a-col :span="22">
          <a-page-header style="margin-left: -22px" :title="name" @back="$emit('onGoBack')" />
        </a-col>
        <a-col :span="2" style="display: flex;align-items: center"><a-button @click="handleToEdit" type="default">编辑</a-button></a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col >
          <a-descriptions size="small" :column="3" >
            <a-descriptions-item label="账号">
              {{ source[0] }}
            </a-descriptions-item>
            <a-descriptions-item label="身份">
              {{ source[1] }}
            </a-descriptions-item>
            <a-descriptions-item label="指战区域">
              {{ source[2] }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时间">
              {{ source[3] }}
            </a-descriptions-item>
            <a-descriptions-item label="加入时长">
              {{ source[4] }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-card>
    <a-spin :spinning="oldManloading">
      <a-card :bordered="false" style="margin-top: 30px">
        <a-page-header title="老人信息"></a-page-header>
        <a-table size="default" :columns="oldMancol" :data-source="oldData" >
          <span slot="sex" slot-scope="text">{{ text?'男':'女' }}</span>
          <span slot="use" slot-scope="text"><a @click="oldManinf(text)">查看</a></span>
        </a-table>
      </a-card>
    </a-spin>
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
import { oldmanDatas } from '@/api/familyData'
// eslint-disable-next-line import/no-duplicates
import STable from '@/components'
export default {
  mounted () {
    console.log('准备接入')
    oldmanDatas('1').then(res => {
      console.log(res)
    })
  },
  data () {
    return {
      oldManloading: false,
      name: '赵肖云',
      source: ['1234567890', '总指战员', '天津市 天津市 西青区', '2021-01-24 21:32:37', '1个月'],
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
      ],
      oldData: [
        {
          name: '老李',
          sex: 0,
          birth: '2021-3-12',
          address: '天津市 天津市西青区',
          time: '2014-12-24 23:12:00'
        },
        {
          name: '老王',
          sex: 1,
          birth: '2021-3-12',
          address: '天津市 天津市西青区',
          time: '2014-12-28 23:12:00'
        },
        {
          name: '老八',
          sex: 0,
          birth: '2021-4-12',
          address: '天津市 天津市西青区',
          time: '2014-12-24 23:12:00'
        }
      ],
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
          dataIndex: 'birth',
          width: '500px'
        },
        {
          title: '居住地区',
          dataIndex: 'address',
          width: '400px'
        },
        {
          title: '创建时间',
          dataIndex: 'time',
          width: '400px'
        },
        {
          title: '操作',
          dataIndex: 'name',
          scopedSlots: { customRender: 'use' },
          width: '100px'
        }
      ]
    }
  },
  components: {
    PageGoBackTop, STable, oldmanDatas
  },
  name: 'Watch',
  methods: {
    changeChoose: function () {
      console.log(this.chooseWatch)
    },
    missionTo: function (id) {
      this.$router.push({ path: '/missionAdmin/missionList/', query: { id: id } })
    },
    handleToEdit: function () {
      this.$emit('onEdit')
    },
    oldManinf: function () {
      this.$emit('oldView')
    }
  }
}
</script>

<style scoped>

</style>

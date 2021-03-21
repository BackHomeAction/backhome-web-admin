<template>
  <div>
    <a-card :bordered="false">
      <a-row :gutter="48" type="flex" justify="center">
        <a-col :span="22">
          <!--    <page-go-back-top @click="$emit('onGoBack')" ><a><a-icon type="left" /></a>&nbsp;&nbsp;</page-go-back-top> <a-page-header :title="name"></a-page-header>-->
          <a-page-header style="margin-left: -22px" :title="source.name" @back="$emit('onGoBack')" />
        </a-col>
        <a-col :span="2" style="display: flex;align-items: center"><a-button @click="oldManEdit()" type="default">编辑</a-button></a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col >
          <a-descriptions size="small" :column="3" >
            <a-descriptions-item label="性别">
              {{ source.sex===1?'男':'女' }}
            </a-descriptions-item>
            <a-descriptions-item label="身份证号">
              {{ source.idcard }}
            </a-descriptions-item>
            <a-descriptions-item label="出生日期">
              {{ source.birthDate }}
            </a-descriptions-item>
            <a-descriptions-item label="常居地">
              {{ source.province?( source.province+ ' ' +source.city+ ' ' +source.district ): '暂无' }}
            </a-descriptions-item>
            <a-descriptions-item label="常去地点">
              <div>
                <span v-for="(item,id) in this.offerPlace" :key="id">{{ item.name + ',' }}</span>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
      <a-row :gutter="48" type="flex" >
        <a-col v-if="this.source.identificationPhoto">
          <a-avatar :src="this.source.identificationPhoto" :size="150" shape="square" ></a-avatar>
        </a-col>
        <a-col v-for="(item,id) in lifephotos" :key="id">
          <a-avatar :src="item" shape="square" :size="150"></a-avatar>
        </a-col>
      </a-row>
    </a-card>
    <a-spin :spinning="orLoading">
      <a-card :bordered="false" style="margin-top: 24px;">
        <a-row :gutter="48" style="display: flex;align-items: center">
          <a-col :span="16">
            <a-page-header title="关联案件"></a-page-header>
          </a-col>
          <a-col :span="18" style="display: flex;align-items: center">
            <a-radio-group v-model="chooseWatch" @change="changeChoose">
              <a-radio-button :value="0">
                全部
              </a-radio-button>
              <a-radio-button :value="1">
                已完成
              </a-radio-button>
              <a-radio-button :value="2">
                进行中
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
            <span slot="id" slot-scope="text"><a @click="missionTo(text.id)" >{{ '#' + text.id }}</a></span>
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
import { STable, PageGoBackTop } from '@/components'
import { adminCase } from '@/api/admin'
import { OldManCase } from '@/api/familyData'
export default {
  mounted () {
    this.source = this.$store.state.data.oldManData.oldmanWatch
    this.caseOfold()
    this.lifephotos = JSON.parse(this.source.lifePhoto)
    this.offerPlace = JSON.parse(this.source.offerPlace)
    this.orLoading = false
  },
  data () {
    return {
      source: [],
      chooseWatch: 0,
      orLoading: true,
      lifephotos: [],
      WatchPage: {},
      offerPlace: null,
      showPhoto: true,
      datas: [],
      columns: [
        {
          title: '任务ID',
          width: '160px',
          dataIndex: 'id'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          width: '250px'
        },
        {
          title: '走失地点',
          dataIndex: 'place',
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
      ]
    }
  },
  components: {
    PageGoBackTop, STable
  },
  name: 'Watch',
  methods: {
    changeChoose: function () {
      this.orLoading = true
      if (this.chooseWatch === 0) {
        // this.datas = []
        this.datas = this.$store.state.data.oldManCase
        this.orLoading = false
      } else {
        adminCase({
          oldManId: this.source.id,
          state: this.chooseWatch
        }).then(res => {
          this.datas = res.data.data
          console.log(res)
          this.WatchPage.pageSize = 10
          this.orLoading = false
        })
      }
    },
    oldManEdit: function () {
      this.$store.state.data.oldManData.oldmanEdit = this.source
      this.$emit('oldEdit')
    },
    photoBefore: function () {
      if (this.source.lifePhoto === null) {
        console.log('图片组空')
      } else {
        var life = JSON.parse(this.source.lifePhoto)
        console.log(life)
      }
      if (this.source.identificationPhoto === null) {
        console.log('图片组空')
      } else {
        var identi = JSON.parse(this.source.identificationPhoto)
        console.log(identi)
      }
    },
    caseOfold: function () {
      this.orLoading = true
      const id = this.source.id
      OldManCase({ oldManId: id }).then(res => {
        this.datas = res.data.data
        this.$store.state.data.oldManCase = res.data.data
        this.WatchPage.total = res.data.totalCount
        this.WatchPage.pageSize = 10
        this.orLoading = false
      })
    },
    missionTo: function (id) {
      this.$router.push({ path: '/missionAdmin/missionList/', query: { id } })
    }
  }
}
</script>

<style scoped>

</style>

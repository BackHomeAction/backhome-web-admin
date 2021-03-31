<template>
  <div>
    <v-chart
      :forceFit="true"
      height="350"
      :data="datas"
      :padding="padding"
      :scale="scale">
      <v-tooltip :onChange="takeDown" />
      <v-axis :dataKey="axis1Opts.dataKey" :line="axis1Opts.line" :tickLine="axis1Opts.tickLine" :grid="axis1Opts.grid" />
      <v-axis :dataKey="axis2Opts.dataKey" :line="axis2Opts.line" :tickLine="axis2Opts.tickLine" :grid="axis2Opts.grid" />
      <v-legend dataKey="user" marker="circle" :offset="30" />
      <v-coord type="polar" radius="0.8" />
      <v-line position="item*score" color="user" :size="2" />
      <v-point position="item*score" color="user" :size="4" shape="circle" />
    </v-chart>
  </div>
</template>

<script>
import { adminTeam, adminUser } from '@/api/admin'
import Viser from 'viser-vue'
const axis1Opts = {
  dataKey: 'item',
  line: null,
  tickLine: null,
  grid: {
    lineStyle: {
      lineDash: null
    },
    hideFirstLine: false
  }
}
const axis2Opts = {
  dataKey: 'score',
  line: null,
  tickLine: null,
  grid: {
    type: 'polygon',
    lineStyle: {
      lineDash: null
    }
  }
}
const DataSet = require('@antv/data-set')
export default {
  mounted () {
    this.getTeam()
    const dv = new DataSet.View().source(this.dataSource)
    dv.transform({
      type: 'fold',
      fields: ['全国', '全省', '全区'],
      key: 'user',
      value: 'score'
    })
    this.digest = dv
    this.digest.transforms[0].fields = ['全国', '全省']
    this.datas = this.digest.rows
  },
  name: 'Charts',
  data () {
    return {
      datas: null,
      dataSource: [
        { item: '结案率', '全国': 70, '全省': 46, '全区': 33 },
        { item: '活跃度', '全国': 45, '全省': 34, '全区': 46 },
        { item: '注册数', '全国': 62, '全省': 58, '全区': 73 },
        { item: '结案数', '全国': 58, '全省': 46, '全区': 61 },
        { item: '结案时间', '全国': 41, '全省': 12, '全区': 28 }
      ],
      axis2Opts,
      axis1Opts,
      digest: null,
      region: [],
      padding: [10, 10, 10, 10],
      scale: [{
        dataKey: 'score',
        min: 20,
        max: 80
      }],
      userData: [],
      takeDown: (ev, chart) => {
        console.log(ev.items)
      }
    }
  },
  components: {
    Viser
  },
  methods: {
    getTeam: function () {
      adminUser().then(res => {
        this.userData = res.data
        if (this.userData.roleId === 5 || this.userData.roleId === 4) {
          adminTeam({
            province: res.data.province,
            district: res.data.district,
            city: res.data.city
          }).then(res => {
            console.log(res)
          })
        }
        if (this.userData.roleId === 3) {
          adminTeam({
            province: this.userData.province,
            district: this.userData.district,
            city: this.userData.city
          }).then(res => {
            console.log(res)
          })
        }
      })
    },
    getMouseMove: function (ev, chart) {
      console.log(ev)
      console.log(chart)
    }
  }
}
</script>

<style scoped>

</style>

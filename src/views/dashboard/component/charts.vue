<template>
  <div>
    <v-chart
      :forceFit="true"
      height="350"
      :data="datas"
      :padding="padding"
      :scale="scale">
      <v-tooltip />
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
    const dv = new DataSet.View().source(this.dataSource)
    dv.transform({
      type: 'fold',
      fields: ['全国', '全省', '全区'],
      key: 'user',
      value: 'score'
    })
    this.datas = dv.rows
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
      padding: [30, 30, 30, 30],
      scale: [{
        dataKey: 'score',
        min: 20,
        max: 80
      }]
    }
  },
  components: {
    Viser
  }
}
</script>

<style scoped>

</style>

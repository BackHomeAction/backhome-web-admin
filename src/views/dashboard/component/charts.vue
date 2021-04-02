<template>
  <div>
    <v-chart
      :forceFit="true"
      height="350"
      :data="datas"
      :padding="padding"
      :scale="scale">
      <v-axis :dataKey="axis1Opts.dataKey" :line="axis1Opts.line" :tickLine="axis1Opts.tickLine" :grid="axis1Opts.grid" />
      <v-axis :dataKey="axis2Opts.dataKey" :line="axis2Opts.line" :tickLine="axis2Opts.tickLine" :grid="axis2Opts.grid" />
      <v-legend dataKey="user" marker="circle" :offset="30" />
      <v-coord type="polar" radius="0.8" />
      <v-line position="item*score" color="user" :size="2" />
      <v-point position="item*score" color="user" :size="4" shape="circle" />
      <v-tooltip :onChange="takeDown"/>
    </v-chart>
    <div class="chartpoint">
      <div style="width: 100px">
        <div class="center" ><span><a-badge color="blue" text="全国" /></span></div>
        <div class="center" ><div>{{ (tipone ? tipone : ' - - ') + (twotype ? twotype : '' ) + (onetype ? onetype : '') }}</div></div>
      </div>
      <a-divider type="vertical" style="height: 70px" v-if="showOther" />
      <div style="width: 100px" v-if="showOther">
        <div class="center" ><span><a-badge color="yellow" text="全省" /></span></div>
        <div class="center" ><div>{{ (tiptwo ? tiptwo : ' - - ') + (twotype ? twotype : '') }}</div></div>
      </div>
      <a-divider type="vertical" style="height: 70px" v-if="showOther" />
      <div style="width: 100px" v-if="showOther" >
        <div class="center" ><span><a-badge color="green" text="全区" /></span></div>
        <div class="center" ><div>{{ (tipthree ? tipthree : ' - - ') + (twotype ? twotype : '') }}</div></div>
      </div>
    </div>
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

export default {
  beforeMount () {
    this.getTeam()
    console.log(this.$store.state.data.users)
  },
  mounted () {
  },
  name: 'Charts',
  data () {
    return {
      datas: null,
      axis2Opts,
      axis1Opts,
      dataSource: null,
      digest: null,
      showOther: false,
      region: [],
      tipone: 0,
      tiptwo: 0,
      tipthree: 0,
      onetype: '',
      twotype: '',
      padding: [10, 10, 10, 10],
      scale: [{
        dataKey: 'score',
        min: 0,
        max: 25
      }],
      userData: [],
      takeDown: (ev, chart) => {
        this.$store.state.data.ev = ev
        this.flash()
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
        this.$store.state.data.users = res.data
        if (this.userData.roleId === 5 || this.userData.roleId === 4) {
          this.showOther = false
          adminTeam({}).then(res => {
            this.$store.state.data.dataSource = res.data
            console.log(this.$store.state.data.dataSource)
            this.dataSource = [
              { item: '结案率', '全国': Math.ceil(this.$store.state.data.dataSource.country.finishCaseRate * 100) },
              { item: '活跃度', '全国': this.$store.state.data.dataSource.country.liveNess },
              { item: '注册数', '全国': this.$store.state.data.dataSource.country.registerNum },
              { item: '结案数', '全国': this.$store.state.data.dataSource.country.finishCaseNum },
              { item: '结案时间', '全国': (this.$store.state.data.dataSource.country.finishCaseTime / 24).toFixed(2) }
            ]
            console.log(this.dataSource)
            const DataSet = require('@antv/data-set')
            const dv = new DataSet.View().source(this.dataSource)
            this.digest = dv
            this.digest.transform({
              type: 'fold',
              fields: ['全国', '全省', '全区'],
              key: 'user',
              value: 'score'
            })
            this.datas = this.digest.rows
          })
        }
        if (this.userData.roleId === 3) {
          this.showOther = true
          console.log(res.data.city)
          adminTeam({
            province: res.data.province,
            district: res.data.city,
            city: res.data.district
          }).then(res => {
            this.$store.state.data.dataSource = res.data
            this.dataSource = [
              {
                item: '结案率',
                '全国': Math.ceil(this.$store.state.data.dataSource.country.finishCaseRate * 100),
                '全省': Math.ceil(this.$store.state.data.dataSource.province.finishCaseRate * 100),
                '全区': Math.ceil(this.$store.state.data.dataSource.district.finishCaseRate * 100)
              },
              {
                item: '活跃度',
                '全国': this.$store.state.data.dataSource.country.liveNess,
                '全省': this.$store.state.data.dataSource.province.liveNess,
                '全区': this.$store.state.data.dataSource.district.liveNess
              },
              {
                item: '注册数',
                '全国': this.$store.state.data.dataSource.country.registerNum,
                '全省': this.$store.state.data.dataSource.province.registerNum,
                '全区': this.$store.state.data.dataSource.district.registerNum
              },
              {
                item: '结案数',
                '全国': this.$store.state.data.dataSource.country.finishCaseNum,
                '全省': this.$store.state.data.dataSource.province.finishCaseNum,
                '全区': this.$store.state.data.dataSource.district.finishCaseNum
              },
              {
                item: '结案时间',
                '全国': (this.$store.state.data.dataSource.country.finishCaseTime / 24).toFixed(2),
                '全省': (this.$store.state.data.dataSource.province.finishCaseTime / 24).toFixed(2),
                '全区': (this.$store.state.data.dataSource.district.finishCaseTime / 24).toFixed(2)
              }
            ]
            console.log(this.dataSource)
            const DataSet = require('@antv/data-set')
            const dv = new DataSet.View().source(this.dataSource)
            this.digest = dv
            this.digest.transform({
              type: 'fold',
              fields: ['全国', '全省', '全区'],
              key: 'user',
              value: 'score'
            })
            this.datas = this.digest.rows
          })
        }
      })
    },
    flash: function () {
      const ev = this.$store.state.data.ev
      if (ev.items.length === 1) {
        this.tipone = ev.items[0].value
        this.$store.state.data.titles = ev.items[0].title
        if (ev.items[0].title === '结案数' || ev.items[0].title === '注册数') {
          this.onetype = '个'
        }
        if (ev.items[0].title === '结案时间') {
          this.onetype = '天'
        }
        if (ev.items[0].title === '活跃度') {
          this.onetype = ' 人次'
        }
        if (ev.items[0].title === '结案率') {
          this.onetype = '/%'
          this.tipone = ev.items[0].value
        }
      } else {
        this.$store.state.data.titles = null
        this.$store.state.data.titles = ev.items[0].title
        this.tipone = ev.items[0].value
        this.tiptwo = ev.items[1].value
        this.tipthree = ev.items[2].value
        if (ev.items[0].title === '结案数' || ev.items[0].title === '注册数') {
          this.twotype = '个'
        }
        if (ev.items[0].title === '结案率') {
          this.twotype = '/%'
          this.tipone = ev.items[0].value
          this.tiptwo = ev.items[1].value
          this.tipthree = ev.items[2].value
        }
        if (ev.items[0].title === '结案时间') {
          this.twotype = '天'
        }
        if (ev.items[0].title === '活跃度') {
          this.twotype = ' 人次'
        }
        this.onetype = ''
      }
    }
  }
}
</script>

<style scoped>
.chartpoint{
  height: 100px;
  margin-top: 5px;
  color: rgba(16, 16, 16, 100);
  font-size: 24px;
  font-family: SourceHanSansSC-regular;
  display: flex;
  justify-content: space-evenly;
}
.center{
  width: 100%;display: flex;justify-content: center;align-items: center;
}
</style>

<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="users.avatarUrl"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ name }}!
          </div>
          <div v-if="users">{{ (users.roleId === 3) ? '区域指战员' +'  '+'|' + '  ' + (users.province+ '-' +users.city+ '-' +users.district) : ((users.roleId=== 5)?'总指战员':'系统指战员') }}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="区域内开启案件" :value="lengths[1]" :suffix="'/'+lengths[0]" />
        </div>
        <div class="stat-item">
          <a-statistic title="区域内志愿者" :value="inAirVol" :suffix="'/'+allVols" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col
          :xl="16"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
          style="margin-bottom: 24px">
          <a-card
            v-if="missionShow"
            :loading="loading1"
            class="project-list"
            style="margin-bottom: 24px;justify-content: space-between"
            :bordered="false"
            title="进行中的任务"
            :body-style="{ padding: 0 }">
            <a slot="extra" @click="toMission" >全部任务</a>
            <a-card-grid style="width:33.3%;" :key="index+1" v-for="(item,index) in warningList">
              <div>
                <div style="width: 100%;">
                  <a-avatar
                    src="https://home-action.oss-cn-shanghai.aliyuncs.com/admin/2/bcb349c7-8508-4c86-9e59-9dd212ca01c8.png"
                    :size="30"
                    style="margin-right: 3%"></a-avatar>
                  {{ '  ' + '  ' +item.district+ '走失老人' }}
                  <div style="margin-top: 5%">
                    {{ '于' +item.startTime }}
                  </div>
                  <div style="margin-top: 5%;overflow: hidden;text-overflow:ellipsis; white-space: nowrap;width: 170px">
                    {{ '走失于' + item.place }}
                  </div>
                  <div class="project-item" @click="toMission(item.id)">
                    <a><span style="color: red">紧急</span></a>
                    <a><span class="datetime" style="color:#ff0000" >{{ timewatch(item.lostTime) }}</span></a>
                  </div>
                </div>
              </div>
            </a-card-grid>

            <a-card-grid style="width:33.3%;" :key="(index+1)*(-1)" v-for="(item,index) in redList">
              <div>
                <div style="width: 100%;">
                  <a-avatar
                    src="https://home-action.oss-cn-shanghai.aliyuncs.com/admin/2/e3dd47eb-2b0e-4c9f-979b-e775aa4678fa.png"
                    :size="30"
                    style="margin-right: 3%"></a-avatar>
                  {{ '  ' + '  ' +item.district+ '走失老人' }}
                  <div style="margin-top: 5%">
                    {{ '于' +item.startTime }}
                  </div>
                  <div style="margin-top: 5%;overflow: hidden;text-overflow:ellipsis; white-space: nowrap;width: 170px">
                    {{ '走失于' + item.place }}
                  </div>
                  <div class="project-item" @click="toMission(item.id)">
                    <a><span style="color: #1AFA29">优先</span></a>
                    <span class="datetime" style="color: #1AFA29" >{{ timewatch(item.lostTime) }}</span>
                  </div>
                </div>
              </div>
            </a-card-grid>
            <a-card-grid style="width:33.3%;" :key="(index+1)*(10)" v-for="(item,index) in commonList">
              <div>
                <div style="width: 100%;">
                  <a-avatar src="https://home-action.oss-cn-shanghai.aliyuncs.com/admin/2/5fa5d77f-d8ae-434f-9f82-c2f5ade35141.png" :size="30" style="margin-right: 3%"></a-avatar>
                  {{ '  ' + '  ' +item.district+ '走失老人' }}
                  <div style="margin-top: 5%">
                    {{ '于' +item.startTime }}
                  </div>
                  <div style="margin-top: 5%;overflow: hidden;text-overflow:ellipsis; white-space: nowrap;width: 170px">
                    {{ '走失于' + item.place }}
                  </div>
                  <div class="project-item" @click="toMission(item.id)">
                    <a>一般</a>
                    <a><span class="datetime" style="color: black" >{{ timewatch(item.lostTime) }}</span></a>
                  </div>
                </div>
              </div>
            </a-card-grid>
          </a-card>
          <a-card :loading="loading2" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in dymicList">
                <a-list-item-meta :description="timewatch(item.time)">
                  <a-avatar slot="avatar" :src="item.avatarUrl"/>
                  <div slot="title" style="font-size: 12px" >
                    <span style="font-weight: bold"> {{ item.name + '  ' }}</span><span>{{ (item.actionId === 1 ? '发布案件' : (item.actionId === 2 ?'完成案件':(item.actionId === 3 ?'取消案件':(item.actionId === 4 ? '案件已归档':(item.actionId === 5 ? '志愿者加入案件':(item.actionId === 6 ? '志愿者退出案件':(item.actionId === 7 ? '志愿者匹配人脸成功':'无操作')))))))+ ' ' + ' ' }}</span><span><a @click="toMission(item.caseId)">{{ '#' + item.caseId }}</a></span>
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="团队指数" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <charts/>
            <div class="chartpoint">
              <div style="width: 100px;display: flex;justify-content: center;align-items: center;flex-wrap: wrap">
                <span><a-badge color="blue" text="全国" /></span>
                <div>49.5h</div>
              </div>
              <a-divider type="vertical" style="height: 70px" />
              <div style="width: 100px;display: flex;justify-content: center;align-items: center;flex-wrap: wrap">
                <span><a-badge color="yellow" text="全省" /></span>
                <div>49.5h</div>
              </div>
              <a-divider type="vertical" style="height: 70px" />
              <div style="width: 100px;display: flex;justify-content: center;align-items: center;flex-wrap: wrap">
                <span><a-badge color="green" text="全国" /></span>
                <div>49.5h</div>
              </div>
            </div>
          </a-card>
          <a-card :loading="loading3" title="今日活跃志愿者" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in volnteerFire" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatarUrl"/>
                    <span class="member"><div class="textMore">{{ item.nickName }}</div></span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { adminUser, adminDymic } from '@/api/admin'
import { getMissionListAll } from '@/api/mission'
import { getVolunteerList, VolunteerFire } from '@/api/volunteerAdmin'
import dayjs from '@/utils/dayjs'
import charts from '@/views/dashboard/component/charts'

export default {
  mounted () {
    adminUser().then(res => {
      this.$store.state.data.users = res.data
      this.users = this.$store.state.data.users
      this.$store.state.data.ids = this.users.district
      this.$store.state.data.citys = this.users.citys
      this.getAllData(res.data.district, res.data.citys)
    })
    this.getDymic()
  },
  name: 'Workplace',
  components: {
    PageHeaderWrapper, dayjs, charts
  },
  filters: {
    timeget: function (val) {
      return dayjs(val).fromNow(true)
    }
  },
  data () {
    return {
      padding: [20, 20, 20, 20],
      timeFix: timeFix(),
      loading1: true,
      loading2: true,
      loading3: true,
      ids: '',
      citys: '',
      users: [],
      allVols: '',
      missionLists: [],
      missionShow: false,
      volnteerFire: [],
      inAirVol: '',
      warningList: [],
      commonList: [],
      redList: [],
      dymicList: [],
      lengths: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      name: (state) => state.user.name,
      welcome: (state) => state.user.welcome
    })
  },
  methods: {
    getDymic: function () {
      adminDymic().then(res => {
        this.dymicList = res.data.data.slice(0, 7)
      }).finally(() => {
        this.loading2 = false
      })
    },
    getHour: function (time) {
      return dayjs().diff(time, 'hour')
    },
    getUser: function () {

    },
    getAllData: function (district, city) {
<<<<<<< HEAD
      if (this.users.roleId !== 3) {
        district = null
      }
      getMissionListAll({ district: district }).then(res => {
        console.log(res)
        if (res.data.length) {
          this.missionShow = true
=======
      getMissionListAll({ district: district }).then(res => {
        if (res.data.length === 0) {
          this.missionShow = false
>>>>>>> master
        }
        this.missionNum(res)
        this.missionLists = res.data
        this.missionLists = this.missionLists.slice(0, 7)
        if (res.data.length >= 6) {
          this.missionLists = res.data.slice(0, 6)
        }
        var a = 0
        var b = 0
        var c = 0
        for (var i = 0; i < this.missionLists.length; i++) {
          var lostTime = dayjs().diff(this.missionLists[i].lostTime, 'hour')
          if (lostTime < 24) {
            this.warningList[a] = this.missionLists[i]
            a++
          }
          if (lostTime >= 24 && lostTime < 48) {
            this.redList[b] = this.missionLists[i]
            b++
          }
          if (lostTime >= 48) {
            this.commonList[c] = this.missionLists[i]
            c++
          }
        }
        this.loading1 = false
      })
      VolunteerFire({}).then(res => {
        this.volnteerFire = res.data
        this.loading3 = false
      })
      getVolunteerList({ city: city }).then(res => {
        this.$store.state.data.allVolss = res.data.totalCount
        this.allVols = this.$store.state.data.allVolss
      })
      VolunteerFire({ city: city }).then(res => {
        this.inAirVol = res.data.length
      })
    },
    timewatch: function (val) {
      return dayjs(val).fromNow(true)
    },
    toMission: function (text) {
      if (text) {
        this.$router.push({ path: '/missionAdmin/missionList/', query: { id: text } })
      } else {
        this.$router.push({ path: '/missionAdmin/missionList/' })
      }
    },
    getHoursFromTime: function (time) {
      return dayjs().diff(time, 'hour')
    },
    missionNum: function (datas) {
      this.lengths[0] = datas.data.length
      this.lengths[1] = 0
      for (var t = 0; t < datas.data.length; t++) {
        if (datas.data[t].state !== 4) {
          this.lengths[1]++
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./Workplace.less";

  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }
 .textMore{
   overflow: hidden;
   text-overflow:ellipsis; white-space: nowrap;
 }
  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }
  .chartpoint{
    height: 100px;
    margin-top: 15px;
    color: rgba(16, 16, 16, 100);
    font-size: 24px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

</style>

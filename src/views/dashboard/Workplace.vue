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
          <div v-if="users">{{ (users.roleId === 3) ? '区域指战员' +'  '+'|' + '  ' + (users.province+ '-' +users.district+ '-' +users.city) : ((users.roleId=== 5)?'总指战员':'系统指战员') }}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item" v-if="lengths && lengths[0]">
          <a-statistic :title="users.roleId === 3 ? '区域内开启案件' : '开启案件'" :value="lengths[1]" :suffix="'/ '+lengths[0]" />
        </div>
        <div class="stat-item" v-if="allVols">
          <a-statistic :title="users.roleId === 3 ? '区域内在线志愿者' : '在线志愿者'" :value="inAirVol" :suffix="'/ '+allVols" />
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
            <a slot="extra" @click="toMission()" >全部任务</a>
            <a-card-grid style="width:33.3%;" :key="index+1" v-for="(item,index) in warningList">
              <div>
                <div style="width: 100%;">
                  <div class="mission-title" @click="toMission(item.id)">
                    <div class="icon-wrapper" style="background-color: #c63f47">
                      <a-icon theme="filled" style="font-size: 12px; color: #ffffff;" type="file-text" />
                    </div>
                    <span class="mission-title-text" style="color: #c63f47;">{{ '  ' + '  ' +item.district+ '走失老人' }}</span>
                  </div>
                  <div class="mission-lost-time">
                    {{ '于' +item.startTime }}
                  </div>
                  <div class="mission-lost-place">
                    {{ '走失于' + item.place }}
                  </div>
                  <div class="project-item">
                    <div style="color: #c63f47">紧急</div>
                    <div class="datetime" style="color:#c1c1c1" >{{ timewatch(item.lostTime) }}</div>
                  </div>
                </div>
              </div>
            </a-card-grid>

            <a-card-grid style="width:33.3%;" :key="(index+1)*(-1)" v-for="(item,index) in redList">
              <div>
                <div style="width: 100%;">
                  <div class="mission-title" @click="toMission(item.id)">
                    <div class="icon-wrapper" style="background-color: #008891">
                      <a-icon theme="filled" style="font-size: 12px; color: #ffffff;" type="file-text" />
                    </div>
                    <span class="mission-title-text" style="color: #008891;">{{ '  ' + '  ' +item.district+ '走失老人' }}</span>
                  </div>
                  <div class="mission-lost-time">
                    {{ '于' +item.startTime }}
                  </div>
                  <div class="mission-lost-place">
                    {{ '走失于' + item.place }}
                  </div>
                  <div class="project-item">
                    <div style="color: #008891">优先</div>
                    <div class="datetime" style="color: #c1c1c1" >{{ timewatch(item.lostTime) }}</div>
                  </div>
                </div>
              </div>
            </a-card-grid>
            <a-card-grid style="width:33.3%;" :key="(index+1)*(10)" v-for="(item,index) in commonList">
              <div>
                <div style="width: 100%;">
                  <div class="mission-title" @click="toMission(item.id)">
                    <div class="icon-wrapper" style="background-color: #e6e6e6">
                      <a-icon theme="filled" style="font-size: 12px; color: #595959;" type="file-text" />
                    </div>
                    <span class="mission-title-text">{{ '  ' + '  ' +item.district+ '走失老人' }}</span>
                  </div>
                  <div class="mission-lost-time">
                    {{ '于' +item.startTime }}
                  </div>
                  <div class="mission-lost-place">
                    {{ '走失于' + item.place }}
                  </div>
                  <div class="project-item">
                    <div>一般</div>
                    <div class="datetime" style="color: #c1c1c1" >{{ timewatch(item.lostTime) }}</div>
                  </div>
                </div>
              </div>
            </a-card-grid>
          </a-card>
          <a-card :loading="loading2" title="动态" :bordered="false">
            <a-list style="margin: -18px 0">
              <a-list-item :key="index" v-for="(item, index) in dymicList">
                <a-list-item-meta>
                  <span slot="description" style="font-size: 12px">{{ timewatch(item.time) }}</span>
                  <a-avatar slot="avatar" :src="item.avatarUrl"/>
                  <div slot="title" style="font-size: 14px" >
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
import { adminDymic } from '@/api/admin'
import { getMissionListAll } from '@/api/mission'
import { getVolunteerList, VolunteerAll, VolunteerFire, VolunteerNum } from '@/api/volunteerAdmin'
import dayjs from '@/utils/dayjs'
import charts from '@/views/dashboard/component/charts'
import moment from 'moment'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'moment/locale/zh-cn'
export default {
  mounted () {
    moment.locale('zh-cn')
    this.$store.state.data.users = this.$store.getters.userInfo
    this.users = this.$store.getters.userInfo
    this.$store.state.data.ids = this.$store.getters.userInfo.district
    this.$store.state.data.citys = this.$store.getters.userInfo.citys
    this.getAllData(this.$store.getters.userInfo.district, this.$store.getters.userInfo.citys)
    setInterval(() => {
      this.getAllData(this.$store.getters.userInfo.district, this.$store.getters.userInfo.citys)
    }, 5000)
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
      locale: zhCN,
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
      if (this.users.roleId !== 3) {
        district = null
      }
      getMissionListAll({ district: city }).then(res => {
        console.log(res)
        if (res.data.length) {
          this.missionShow = true
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
      })
      VolunteerNum({ city: city }).then(res => {
        this.allVols = res.data
      })
      VolunteerAll().then(res => {
        this.inAirVol = res.data
      })
    },
    timewatch: function (val) {
      return dayjs(val).fromNow()
    },
    toMission: function (text) {
      if (text) {
        this.$router.push({ path: '/missionAdmin/missionDetail/', query: { id: text } })
      } else {
        this.$router.push({ path: '/missionAdmin/missionList/' })
      }
    },
    getHoursFromTime: function (time) {
      return dayjs().diff(time, 'hour')
    },
    missionNum: function (datas) {
      this.lengths[0] = datas.data.length
      this.lengths[1] = datas.data.reduce((total, item) => {
        if (item.state === 1 || item.state === 3) {
          return total + 1
        } else {
          return total
        }
      }, 0)
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
      justify-content: space-between;
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

.mission {
  &-title {
    display: flex;
    align-items: center;
    cursor: pointer;

    .icon-wrapper {
      width: 24px;
      height: 24px;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-text{
      margin-left: 8px;
    }
  }

  &-lost-time {
    color: #999999;
    font-size: 13px;
    margin-top: 8px;
  }

  &-lost-place {
    color: #999999;
    font-size: 13px;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
}
</style>

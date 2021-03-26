<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="users.avatarUrl"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ name }}！
          </div>
          <div>{{ (users.roleId === 3) ? '总指战员' : ((users.roleId=== 5)?'区域指战员':'系统指战员')+'  '+'|' + '  ' + (users.province+ '-' +users.city+ '-' +users.district) }}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="区域内开启案件" :value="823" suffix="/ 4856" />
          <!--          数据未插入-->
        </div>
        <div class="stat-item">
          <a-statistic title="区域内志愿者" :value="inAirVol" :suffix="'/'+allVols" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            :loading="loading1"
            class="project-list"
            style="margin-bottom: 24px;justify-content: space-between"
            :bordered="false"
            title="进行中的任务"
            :body-style="{ padding: 0 }">
            <a slot="extra" @click="toMission" >全部项目</a>
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
                  <div style="margin-top: 5%">
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
                  <div style="margin-top: 5%">
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
                  <div style="margin-top: 5%">
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
              <a-list-item :key="index" v-for="(item, index) in missionLists">
                <a-list-item-meta :description="timewatch(item.startTime)">
                  <a-avatar slot="avatar" :src="item.family.avatarUrl"/>
                  <div slot="title" style="font-size: 12px" >
                    <span style="font-weight: bold"> {{ item.family.name + '  ' }}</span><span>{{ '完成了任务'+ ' ' + ' ' }}</span><span><a @click="toMission(item.id)">{{ '#' + item.id }}</a></span>
                  </div>
                  <div slot="description">{{ item.time }}</div>
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
            <div class="item-group">
              暂时空
            </div>
          </a-card>
          <a-card :loading="loading3" title="今日活跃志愿者" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in volnteerFire" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatarUrl"/>
                    <span class="member">{{ item.nickName }}</span>
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
import { adminUser } from '@/api/admin'
import { getMission } from '@/api/missionList'
import { getVolunteerList, VolunteerFire } from '@/api/volunteerAdmin'
import dayjs from '@/utils/dayjs'
export default {
  mounted () {
    this.getUser()
    this.getAllData()
    VolunteerFire({ city: this.$store.state.data.citys }).then(res => {
      this.inAirVol = res.data.length
    })
  },
  name: 'Workplace',
  components: {
    PageHeaderWrapper, dayjs
  },
  filters: {
    timeget: function (val) {
      return dayjs(val).fromNow(true)
    }
  },
  data () {
    return {
      timeFix: timeFix(),
      loading1: true,
      loading2: true,
      loading3: true,
      ids: '',
      citys: '',
      users: [],
      allVols: '',
      missionLists: [],
      volnteerFire: [],
      inAirVol: '',
      warningList: [],
      commonList: [],
      redList: []
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
    getHour: function (time) {
      return dayjs().diff(time, 'hour')
    },
    getUser: function () {
      adminUser().then(res => {
        this.users = res.data
        this.$store.state.data.ids = res.data.district
        console.log(this.$store.state.data.ids)
        this.$store.state.data.citys = res.data.city
      })
    },
    getAllData: function () {
      // console.log(this.$store.state.data.ids)
      // 案件先不加id，等连上之后再说
      console.log(this.$store.state.data.ids)
      getMission({ district: this.$store.state.data.ids }).then(res => {
        console.log(res)
        this.missionLists = res.data
        this.missionLists = this.missionLists.slice(0, 5)
        if (res.data.length > 6) {
          res.data = res.data.slice(0, 6)
        }
        var a = 0
        var b = 0
        var c = 0
        for (var i = 0; i < res.data.length; i++) {
          var lostTime = dayjs().diff(res.data[i].lostTime, 'hour')
          if (lostTime < 24) {
            this.warningList[a] = res.data[i]
            a++
          }
          if (lostTime >= 24 && lostTime < 48) {
            this.redList[b] = res.data[i]
            b++
          }
          if (lostTime >= 48) {
            this.commonList[c] = res.data[i]
            c++
          }
        }
        this.loading1 = false
        this.loading2 = false
      })
      VolunteerFire({}).then(res => {
        this.volnteerFire = res.data
        this.loading3 = false
      })
      getVolunteerList({ city: this.$store.state.data.citys }).then(res => {
        this.$store.state.data.allVolss = res.data.totalCount
        this.allVols = this.$store.state.data.allVolss
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

</style>

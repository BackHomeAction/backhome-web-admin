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
        </div>
        <div class="stat-item">
          <a-statistic title="区域内志愿者" :value="138" suffix="/ 1625" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            style="margin-bottom: 24px;justify-content: space-between"
            :bordered="false"
            title="进行中的任务"
            :body-style="{ padding: 0 }">
            <a slot="extra">全部项目</a>
            <a-card-grid style="width:33.3%;" :key="index" v-for="(item,index) in missionLists">
              <div style="display: flex;">
                <div style="width: 80%;">
                  <a-avatar icon="user" style="margin-right: 3%"></a-avatar>
                  {{ '  ' + '  ' +users.district+ '走失老人' }}
                  <div style="margin-top: 5%">
                    {{ '于' +item.startTime }}
                  </div>
                  <div style="margin-top: 5%">
                    {{ '走失于' + item.place }}
                  </div>
                  <br>
                  <br>
                  <div>一般</div>
                </div>
                <div style="width: 20%;margin-top: 50%">
                  {{ timewatch(item.lostTime) }}
                </div>
              </div>
            </a-card-grid>
          </a-card>
          <a-card title="动态" :bordered="false">
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
          <a-card
            title="今日活跃志愿者"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }">
            <div style="min-height: 400px;">
              <div>
                2312314124
              </div>
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
import dayjs from '@/utils/dayjs'
export default {
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
      datas: [
        { title: '天玑哥哥捡钢筋' },
        { title: '天玑哥哥捡钢筋' },
        { title: '天玑哥哥捡钢筋' },
        { title: '天玑哥哥捡钢筋' },
        { title: '天玑哥哥捡钢筋' }
      ],
      loading: true,
      users: [{}],
      missionLists: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      name: (state) => state.user.name,
      welcome: (state) => state.user.welcome
    }),
    currentUser () {
      return {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    getAllData: function () {
      adminUser().then(res => {
        this.users = res.data
      })
      getMission({ id: this.users.id }).then(res => {
        this.missionLists = res.data
        console.log(this.missionLists)
      })
    },
    timewatch: function (val) {
      return dayjs(val).fromNow(true)
    },
    toMission: function (text) {
      this.$router.push({ path: '/missionAdmin/missionList/', query: { id: text } })
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

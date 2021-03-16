<template>
  <div>
    <div v-if="showMapChoose" style="display: flex;justify-content: center;align-items: center;position: absolute;width: 100%;height: 100%;z-index: 10000;background-color: rgba(0,0,0,.5)">
      <div style="width: 400px;height: 570px;display: flex;justify-content: center;flex-wrap: wrap">
        <iframe id="mapPage" width="100%" height="100%" frameborder="0" src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&radius=2000&key=75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN&referer=LAB服创">
        </iframe>
        <a-button title="danger" @click="showMap" style="margin-top: 35px">取消选择</a-button>
      </div>
    </div>
    <a-card :bordered="false">
      <a-row :gutter="32" type="flex" align-item="center">
        <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px" ><a-icon type="left" /><span>返回</span></a></page-go-back-top>
      </a-row>
      <a-form-model layout="inline" :label-col="{ span : 0 }" :wrapper-col="{ span : 0 }" >
        <a-row :gutter="32" type="flex" justufy="space-between" >
          <a-col >
            <a-form-model-item>
              <a><a-avatar :size="150" shape="square" ><a-icon type="plus" />上传证件照</a-avatar></a>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <a-form-model-item label="姓名:" style="margin-top: 15px">
              <a-input v-model="oldMan.name" :placeholder="inLineText"></a-input>
            </a-form-model-item>

            <a-form-model-item label="手机号:" style="margin-top: 15px">
              <a-input v-model="oldMan.phone" :placeholder="inLineText"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <a-form-model-item label="身份证号:" style="margin-top: 15px">
              <a-input v-model="oldMan.idcard" :placeholder="inLineText"></a-input>
            </a-form-model-item>

            <a-form-model-item label="性别:" style="margin-top: 15px">
              <a-radio-group v-model="oldMan.sex" :default-value="1" >
                <a-radio :value="0">
                  男
                </a-radio>
                <a-radio :value="1">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <a-form-model-item label="出生日期:" style="margin-top: 15px">
              <a-input v-model="oldMan.birthDate" :placeholder="inLineText"></a-input>
            </a-form-model-item>
            <a-form-model-item label="地区:" style="margin-top: 15px">
              <region-selector v-model="region" ></region-selector>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <!--          位置的问题到时候再说-->
            <a-form-model-item label="家庭住址:" style="margin-top: 15px">
              <a-input v-model="oldMan.address" :placeholder="inLineText" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="32" type="flex" style="margin-top: 15px">
          <a-col :span="24" >
            <a-avatar
              v-for="(item,id) in lifePhoto"
              :src="item"
              :key="id"
              style="margin-right: 20px"
              :size="150"
              shape="square" ></a-avatar>
            <a-button type="dashed" ><a-icon type="plus" />添加生活照</a-button>
          </a-col>
        </a-row>
        <a-row style="margin-top: 30px" >
          <a-table :columns="colmuns" :data-source="datas">
            <div slot="action" slot-scope="text">
              <a @click="deleteElement(text)">删除</a>
            </div>
          </a-table>
        </a-row>
      </a-form-model>
      <a-row :gutter="32" >
        <a-button type="dashed" block style="margin-top: 5px" @click="showMap">
          <a-icon type="plus" />新增常去地点
        </a-button>
      </a-row>
      <a-row :gutter="32" type="flex" justify="center" style="display: flex;align-items: center;margin-top: 15px" >
        <div>
          <a-button type="primary" style="margin-right: 35px;margin-top: 30px">保存</a-button>
          <a-button style="margin-left: 35px;margin-top: 30px;" @click="defaultss">Default</a-button>
        </div>
      </a-row>
    </a-card>

  </div>
</template>
<script src="https://map.qq.com/api/gljs?v=1.exp&key=75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN"></script>
<script>
import { PageGoBackTop, RegionSelector } from '@/components'
export default {
  created () {
    window.addEventListener('message',(events) => {
      console.log(events.data)
      this.newAction.name=events.data.poiname
      this.newAction.address=events.data.poiaddress
      this.newAction.city=events.data.cityname
      this.newAction.latitude=events.data.latlng.lat
      this.newAction.longitude=events.data.latlng.lng
      this.datas.push(this.newAction)
    })
  },
  mounted () {
    this.oldMan = this.$store.state.oldManData.oldmanEdit
    console.log(this.oldMan)
    this.dataList()
  },
  name: 'OldMandEdit',
  data () {
    return {
      showMapChoose: false,
      oldMan: [],
      inLineText: '请输入',
      region: [],
      lifePhoto: [],
      newAction: {
        name: '',
        address: '',
        city: '',
        latitude: null,
        longitude:null
      },
      colmuns: [
        {
          title: '常去地点',
          dataIndex: 'name',
        },
        {
          title: '位置',
          dataIndex: 'address',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: []
    }
  },
  components: {
    PageGoBackTop, RegionSelector
  },
  computed: {
    newAction: function () {
      console.log("变了变了！")
    }
  },
  methods: {
    goBack: function () {
      this.$emit('oldView')
    },
    dataList: function () {
      this.lifePhoto = JSON.parse(this.oldMan.lifePhoto)
      this.datas = JSON.parse(this.oldMan.offerPlace)
      console.log('地址栏')
      console.log(this.datas)
      this.region[0] = this.oldMan.province
      this.region[1] = this.oldMan.district
      this.region[2] = this.oldMan.city
      if (this.oldMan.province === []) {
        this.region = []
      }
    },
    showMap: function () {
      this.showMapChoose = !this.showMapChoose
    },
    deleteElement: function (text) {
      console.log(text)
      var p = 0
      for(var i=0 ;i !== -1;i++){
         if((this.datas[i]) === (text)){
           p = i
           console.log(p)
           i = -2
         }
      }
      this.datas = (this.datas.splice(p,1)).sort()
    },
    defaultss: function () {
      this.datas= []
    }
  }
}
</script>

<style scoped>

</style>

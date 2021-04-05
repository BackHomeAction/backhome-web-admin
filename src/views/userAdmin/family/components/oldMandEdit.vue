<template>
  <div>
    <div v-if="showMapChoose" style="border: 1px solid black;display: flex;justify-content: center;align-items: center;position: absolute;width: 100%;height: 100%;z-index: 10000;background-color: rgba(0,0,0,.5)">
      <div style="width: 70%;height: 80%;display: flex;justify-content: center;flex-wrap: wrap">
        <iframe id="mapPage" width="100%" height="100%" frameborder="0" src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&radius=2000&key=75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN&referer=LAB服创">
        </iframe>
        <a-button block type="danger" @click="showMap" style="margin-top: 35px">取消选择</a-button>
      </div>
    </div>
    <a-card :bordered="false">
      <a-spin :spinning="loadings">
        <a-row :gutter="32" type="flex" align-item="center">
          <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px" ><a-icon type="left" /><span>返回</span></a></page-go-back-top>
        </a-row>
        <a-form-model layout="inline" :label-col="{ span : 0 }" :wrapper-col="{ span : 0 }" >
          <a-row :gutter="32" type="flex" justufy="space-between" >
            <a-col >
              <a-form-model-item>
                <a>
                  <a-avatar v-if="oldMan.identificationPhoto" :size="150" shape="square" :src="oldMan.identificationPhoto" @click="showPhoto(2)"></a-avatar>
                  <a-avatar v-if="!(oldMan.identificationPhoto)" :size="150" shape="square" @click="showPhoto(2)"><a-icon type="plus" />上传证件照</a-avatar>
                </a>
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
              <a-button type="dashed" @click="showPhoto(1)" :loading="isChangingAvatar" ><a-icon type="plus" />添加生活照</a-button>
            </a-col>
          </a-row>
          <a-row style="margin-top: 30px" >
            <a-table :pagination="oldPage" :columns="colmuns" :data-source="datas">
              <div slot="action" slot-scope="text">
                <a @click="deleteWhere(text)">删除</a>
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
            <a-button type="primary" style="margin-right: 35px;margin-top: 30px" @click="makeSureData" >保存</a-button>
            <a-button style="margin-left: 35px;margin-top: 30px;" @click="defaultss">重置</a-button>
          </div>
        </a-row>
      </a-spin>
    </a-card>
    <image-cropper v-model="showAvatarUploader" @success="handleAvataruploaded" />
  </div>
</template>
<script src="https://map.qq.com/api/gljs?v=1.exp&key=75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN"></script>
<script>
import { PageGoBackTop, RegionSelector, ImageCropper } from '@/components'
import { oldManinfChange } from '@/api/familyData'
export default {
 created () {
    //如果想从VUE内部监听DOM外部对象，必须挂在created上
    window.addEventListener('message',(events) => {
      this.addressEdit(events)
    })
   this.oldPage.pageSize = 5
  },
  mounted () {
    this.oldMan = this.$store.state.data.oldManData.oldmanEdit
    this.dataList()
    this.loadings = false
  },
  name: 'OldMandEdit',
  data () {
    return {
      id: null,
      iden : 0,
      oldPage: {},
      loadings: true,
      showMapChoose: false,
      isChangingAvatar: false,
      showAvatarUploader: false,
      oldMan: [],
      inLineText: '请输入',
      region: [],
      lifePhoto: [],
      newAction: {
        name: '',
        address: '',
        city: '',
        latitude: '',
        longitude: ''
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
    PageGoBackTop, RegionSelector, ImageCropper, oldManinfChange
  },
  methods: {
    handleAvataruploaded: function(url) {
      this.isChangingAvatar = true
      if(this.iden==1){
        this.lifePhoto.push(url)
      }
      if(this.iden==2){
        this.oldMan.identificationPhoto = url
      }
      this.isChangingAvatar = false
    },
    goBack: function () {
      this.$emit('oldView')
    },
    dataList: function () {
      this.lifePhoto = JSON.parse(this.oldMan.lifePhoto)
      this.datas = JSON.parse(this.oldMan.offerPlace)
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
    deleteWhere: function (text) {
      for(var i = 0; i!== -1 ;i++){
        if(text.address===this.datas[i].address){
           this.datas.splice(i=i,1)
          i= -2
        }
        this.oldPage.pageSize = 5
      }
    },
    defaultss: function () {
      this.datas= []
    },
    showPhoto(n){
      this.iden = n
      this.showAvatarUploader = true
    },
    getOldmanInf: function () {
      this.loadings = true
        this.oldMan.offerPlace = []
        this.oldMan.province = this.region[0]
        this.oldMan.district = this.region[1]
        this.oldMan.city = this.region[2]
      this.oldMan.lifePhoto = JSON.stringify(this.lifePhoto)
      this.oldMan.offerPlace = JSON.stringify(this.datas)
      var  oldMan = this.oldMan
      oldManinfChange({ ...oldMan  }).then(res => {
        if(res.status===200){
          this.$notification.success({
            message: '成功',
            description: '修改成功'
          })
        }
        this.loadings = false
      }).catch(res => {
        this.loadings = false
      })
    },
    addressEdit: function (e) {
      this.newAction.name=e.data.poiname
      this.newAction.address=e.data.poiaddress
      this.newAction.city=e.data.cityname
      this.newAction.latitude=e.data.latlng.lat
      this.newAction.longitude=e.data.latlng.lng
      this.datas.push(this.newAction)
      this.newAction = {}
      this.oldPage.pageSize = 5
    },
    makeSureData: function () {
      this.loadings = true
      if((this.oldMan.identificationPhoto !=='')&&(this.oldMan.name!=='')&&(this.oldMan.idcard!=='')&&(this.oldMan.address!=='')&&(this.region[0])&&(this.oldMan.birthDate!=='')&&(this.lifePhoto)){
        this.getOldmanInf()
      } else {
        this.$notification.error({
          message: "错误",
          description: '请检查输入遗漏项'
        })
        this.loadings = false
      }
    }
  }
}
</script>

<style scoped>

</style>

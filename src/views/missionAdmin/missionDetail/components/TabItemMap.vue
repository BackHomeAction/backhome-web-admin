<template>
  <div class="map">
    <div id="map-container" ref="map-container" style="position: relative;z-index: 1;"/>
    <a-drawer
      title="标记点设置"
      placement="top"
      :closable="true"
      :visible="showGet"
      :maskClosable="true"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      @close="onClose"
      :drawerStyle="{ overflow: 'hidden' }"
      :height="img[0]?'80%':'60%'"
    >
      <a-form-model layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :model="datas[0]">
        <a-row :gutter="48" style="display: flex;justify-content: center;align-items: center">
          <a-col :span="15" >
            <a-form-model-item label="标题" required>
              <a-input v-model="datas.name" :placeholder="placeholder" ></a-input>
            </a-form-model-item>
            <a-form-model-item label="内容" required>
              <a-textarea
                v-model="datas.description"
                placeholder="Controlled autosize"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
            <a-form-model-item label="备忘照片" required>
              <a-button @click="() => {showAvatarUploader = true}" ><a-icon type="arrow-up"/>上传图片</a-button>
            </a-form-model-item>
            <div style="margin-bottom: 8px;margin-top: -5px;display: flex;flex:0;">
              <div style="margin-left: 2px;margin-right: 2px" v-for="(src, index) in img" :rowKey="index" :key="index">
                <a-avatar v-viewer :src="src" :size="150" shape="square" ></a-avatar>
              </div>
            </div>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 5 }">
              <a-button v-if="control" @click="saves" type="primary" style="margin-right: 20px">
                保存
              </a-button>
              <a-button v-if="!control" @click="newMarket" type="primary" style="margin-right: 20px">
                新建
              </a-button>
              <a-button @click="getFirst" type="danger" ghost style="margin-left: 20px;" >
                重置
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-drawer>
    <image-cropper v-model="showAvatarUploader" @success="handleAvataruploaded" />
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { mapGetters } from 'vuex'
import { getMarkets, addMarkets, updateMarket } from '@/api/market'
import { ImageCropper } from '@/components'
export default {
  components: {
    ImageCropper
  },
  data () {
    return {
      map: null,
      img: [],
      datas: [],
      showAvatarUploader: false,
      showGet: false,
      placeholder: '请输入',
      pointGet: [],
      volteerMark: [],
      volObj: null,
      adminObj: null,
      adminMark: [],
      control: 0,
      textArra: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      markers: {
        circle: null,
        lostPlace: null,
        offenPlaces: null,
        volunteers: null
      },
      styles: [{
        'src': 'https://fwwb2020-common.tgucsdn.com/images/map/lost_place.png',
        'width': 35,
        'height': 35
      }, {
        'src': 'https://fwwb2020-common.tgucsdn.com/images/map/lost_place.png',
        'width': 35,
        'height': 35
      }]
    }
  },
  mounted () {
    this.initMap()
    this.initMarkers()
    this.getMarket()
  },
  computed: {
    ...mapGetters(['currentMission', 'currentMissionInfo', 'onlineMembers'])
  },
  methods: {
    getFirst () {
      this.datas = []
      this.img = []
    },
    newMarket () {
      const data = {}
      data.name = this.datas.name
      data.description = this.datas.description
      data.imgUrl = JSON.stringify(this.img)
      data.caseId = this.$store.state.data.caseId
      data.latitude = this.pointGet[0]
      data.longitude = this.pointGet[1]
      data.type = 2
      addMarkets({ ...data }).then(res => {
        if (res.status === 200) {
          this.noti('添加成功', '新标记点添加成功')
        }
        const num = this.adminMark.length + 1
        // 文本和点标记加组，同时加组
        const arraySon = {
          'id': num,
          'position': new window.TMap.LatLng(this.pointGet[0], this.pointGet[1]),
          'styleId': 'marker'
        }
        const text = {
          name: data.name,
          description: data.description,
          imgUrl: data.imgUrl,
          id: res.data.id
        }
        this.textArra.push(text)
        this.adminMark.push(arraySon)
        this.adminObj = new TMap.MultiMarker({
          map: this.map,
          geometries: this.adminMark,
          styles: {
            'marker': new TMap.MarkerStyle(this.styles[0])
          }
        })
        this.watchMarket()
        this.showGet = false
      })
    },
    watchMarket () {
      this.adminObj.on('dblclick', (e) => {
        this.datas = []
        this.control = 1
        this.datas = this.textArra[e.geometry.id - 1]
        this.img = JSON.parse(this.textArra[e.geometry.id - 1].imgUrl)
      })
    },
    saves () {
      console.log(this.datas)
      const data = {}
      data.name = this.datas.name
      data.description = this.datas.description
      data.imgUrl = JSON.stringify(this.img)
      updateMarket({ id: this.datas.id, ...data }).then(res => {
        if (res.status === 200) {
          this.noti('修改成功', '标记修改成功')
          this.datas = []
          this.showGet = false
        }
      })
    },
    handleAvataruploaded (e) {
      this.img.push(e)
    },
    onClose () {
      this.showGet = false
    },
    getMarket () {
      getMarkets().then(res => {
      }).catch(res => {
      })
    },
    initMap () {
      const info = this.currentMissionInfo
      this.map = new TMap.Map(this.$refs['map-container'], {
        zoom: 12.5,
        center: new TMap.LatLng(info.latitude, info.longitude),
        scaleControl: true
      })
      var that = this
      this.mapEvent()
      // 地图回调监听函数
      this.map.on('dblclick', function (res) {
        that.control = 0
        that.datas = []
        that.pointGet = [res.latLng.lat, res.latLng.lng]
        if (that.pointGet) {
          that.datas = []
          that.showGet = true
          console.log(this.datas)
        }
      })
    },
    mapEvent () {
      this.map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM)
      this.map.setDoubleClickZoom(false)
    },
    initMarkers () {
      this.initCircle()
      this.initPlaceMarkers()
    },
    initCircle () {
      const info = this.currentMissionInfo

      this.markers.circle = new TMap.MultiCircle({
        id: 'layer-circle',
        map: this.map,
        styles: {
          'circle': new TMap.CircleStyle({
            'color': 'rgba(0, 68, 128, 0.1)',
            'showBorder': true,
            'borderColor': '#0099ff',
            'borderWidth': 2
          })
        },
        geometries: [{
          styleId: 'circle',
          center: new TMap.LatLng(info.latitude, info.longitude),
          radius: 5000
        }]
      })
    },
    initPlaceMarkers () {
      const info = this.currentMissionInfo

      this.markers.lostPlace = new TMap.MultiMarker({
        id: 'layer-marker-lostplace',
        map: this.map,
        styles: {
          'lostplace-marker': new TMap.MarkerStyle(this.styles[0])
        },
        geometries: [{
          'id': 'marker-lostplace',
          'styleId': 'lostplace-marker',
          'position': new TMap.LatLng(info.latitude, info.longitude),
          'properties': {
            'title': `${info.place}（走失地点）`
          }
        }]
      })

      const offenPlaces = info.oldMan.offerPlace && JSON.parse(info.oldMan.offerPlace) || []
      this.markers.offenPlaces = new TMap.MultiMarker({
        id: 'layer-marker-offenplace',
        map: this.map,
        styles: {
          'offenplace-marker': new TMap.MarkerStyle(this.styles[0])
        },
        geometries: offenPlaces.map((ele, index) => {
          return {
            'id': `marker-offenplace-${index}`,
            'styleId': 'offenplace-marker',
            'position': new TMap.LatLng(ele.latitude, ele.longitude),
            'properties': {
              'title': `${ele.name}（常去地点）`
            }
          }
        })
      })

      this.markers.volunteers = new TMap.MultiMarker({
        id: 'layer-marker-volunteer',
        map: this.map
      })
      this.updateVolunteerPlaces()
    },
    noti (a, b) {
      this.$notification.success({
        message: a,
        description: b
      })
    },
    updateVolunteerPlaces () {
      const onlineMembers = this.currentMission.onlineTeamMembers

      const onlineMembersStyles = {}
      onlineMembers.map(ele => {
        onlineMembersStyles[`volunteer-marker-${ele.id}`] = new TMap.MarkerStyle({
          'src': `https://fwwb2020-fc-aliyun.tgucsdn.com/volunteer_avatar/get?url=${ele.avatarUrl}`,
          'width': 45,
          'height': 45
        })
      })
      const onlineMembersGeometries = onlineMembers.map(ele => {
        return {
          'id': `volunteer-marker-${ele.id}`,
          'styleId': `volunteer-marker-${ele.id}`,
          'position': new TMap.LatLng(ele.latitude, ele.longitude),
          'properties': {
            'title': `${ele.name}`
          }
        }
      })
      this.markers.volunteers.setStyles(onlineMembersStyles)
      this.markers.volunteers.setGeometries(onlineMembersGeometries)
    }
  }
}
</script>

<style lang="less" scoped>
#map-container {
  height: 600px;
}
</style>

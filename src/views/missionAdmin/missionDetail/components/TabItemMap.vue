<template>
  <div class="map">
    <div id="map-container" ref="map-container" style="position: relative;z-index: 1;" />
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
      :height="img[0]?'88%':'65%'"
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
            <a-form-model-item label="点类型" required>
              <a-select v-model="datas.type" placeholder="请选择" :default-value="datas.type">
                <a-select-option :value="1">集合点</a-select-option>
                <a-select-option :value="2">线索点</a-select-option>
                <a-select-option :value="3">标记点</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="备忘照片">
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
import { getMarkets, addMarkets, updateMarket, getTrack } from '@/api/market'
import { ImageCropper } from '@/components'
import Ws from '@/services/websocket'
export default {
  components: {
    ImageCropper
  },
  data () {
    return {
      map: null,
      ws: Ws.getInstance(),
      img: [],
      datas: [],
      showAvatarUploader: false,
      showGet: false,
      placeholder: '请输入',
      pointGet: [],
      commonMark: [],
      clueMark: [],
      commonObj: null,
      clueObj: null,
      gatherObj: null,
      gatherMark: [],
      gatherTex: [],
      clueTex: [],
      linePeople: [],
      poLine: null,
      commonTex: [],
      control: 0,
      infoWindow: null,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      markers: {
        circle: null,
        lostPlace: null,
        offenPlaces: null,
        volunteers: null
      },
      styles: [{
        'src': 'https://fwwb2020-common.tgucsdn.com/images/map/gather.png',
        'width': 35,
        'height': 35
      }, {
        'src': 'https://fwwb2020-common.tgucsdn.com/images/map/clue.png',
        'width': 35,
        'height': 35
      }, {
        'src': 'https://fwwb2020-common.tgucsdn.com/images/map/mark.png',
        'width': 35,
        'height': 35
      }],
      colorControl: 0,
      lineArray: [],
      polineStyle: [
        { 'color': '#F2BECA',
          'width': 2,
          'borderWidth': 3,
          'borderColor': '#FFD6DF',
          'lineCap': 'round' },
        { 'color': '#85B792',
          'width': 2,
          'borderWidth': 3,
          'borderColor': '#9CCBA6',
          'lineCap': 'round' },
        { 'color': '#4A88A1',
          'width': 2,
          'borderWidth': 3,
          'borderColor': '#64AFC8',
          'lineCap': 'round' },
        { 'color': '#F8DA00',
          'width': 2,
          'borderWidth': 3,
          'borderColor': '#FFEA58',
          'lineCap': 'round' },
        { 'color': '#5C6996',
          'width': 2,
          'borderWidth': 3,
          'borderColor': '#8392C9',
          'lineCap': 'round' },
        { 'color': 'rgba(241,132,93)',
          'width': 2,
          'borderWidth': 3,
          'borderColor': 'rgba(251,167,127)',
          'lineCap': 'round' }],
      lineTex: []
    }
  },
  mounted () {
    this.initMap()
    this.initMarkers()
    this.getMarket()
    this.getLine()
    this.initWs()
  },
  computed: {
    ...mapGetters(['currentMission', 'currentMissionInfo', 'onlineMembers'])
  },
  methods: {
    initWs () {
      this.ws.connect()
      this.ws.subscribe(`/track/${this.$store.state.data.caseId}`, this.gettracks)
    },
    gettracks (gets) {
      console.log(gets)
      console.log('sockets')
    },
    getFirst () {
      this.datas = []
      this.img = []
    },
    getMarket () {
      getMarkets({ caseId: this.$store.state.data.caseId }).then(res => {
        this.firstMark(res.data)
      }).catch(res => {
      })
    },
    firstMark (data) {
      for (let n = 0; n < data.length; n++) {
        const type = data[n].type
        if (type === 1) {
          this.gatherMark.push({
            'id': this.gatherMark.length + 1,
            'position': new window.TMap.LatLng(data[n].latitude, data[n].longitude),
            'styleId': 'market'
          })
          this.gatherTex.push({
            name: data[n].name,
            description: data[n].description,
            imgUrl: data[n].imgUrl,
            id: data[n].id,
            type: data[n].type
          })
        }
        // 线索点
        if (type === 2) {
          this.clueMark.push({
            'id': this.clueMark.length + 1,
            'position': new window.TMap.LatLng(data[n].latitude, data[n].longitude),
            'styleId': 'market'
          })
          this.clueTex.push({
            name: data[n].name,
            description: data[n].description,
            imgUrl: data[n].imgUrl,
            id: data[n].id,
            type: data[n].type
          })
        }
        // 标记点
        if (type === 3) {
          this.commonMark.push({
            'id': this.commonMark.length + 1,
            'position': new window.TMap.LatLng(data[n].latitude, data[n].longitude),
            'styleId': 'market'
          })
          this.commonTex.push({
            name: data[n].name,
            description: data[n].description,
            imgUrl: data[n].imgUrl,
            id: data[n].id,
            type: data[n].type
          })
        }
      }
      this.gatherObj = new TMap.MultiMarker({
        map: this.map,
        styles: {
          'market': new TMap.MarkerStyle(this.styles[0])
        },
        geometries: this.gatherMark
      })
      this.clueObj = new TMap.MultiMarker({
        map: this.map,
        styles: {
          'market': new TMap.MarkerStyle(this.styles[1])
        },
        geometries: this.clueMark
      })
      this.commonObj = new TMap.MultiMarker({
        map: this.map,
        styles: {
          'market': new TMap.MarkerStyle(this.styles[2])
        },
        geometries: this.commonMark
      })
      this.watchMarket()
    },
    newMarket () {
      const data = {}
      data.name = this.datas.name
      data.description = this.datas.description
      data.imgUrl = JSON.stringify(this.img)
      data.caseId = this.$store.state.data.caseId
      data.latitude = this.pointGet[0]
      data.longitude = this.pointGet[1]
      data.type = this.datas.type
      addMarkets({ ...data }).then(res => {
        if (res.status === 200) {
          this.noti('添加成功', '新标记点添加成功')
        }
        this.getMarket()
        this.watchMarket()
        this.showGet = false
      })
    },
    windowWatch (lat, lng) {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      this.$jsonp('https://apis.map.qq.com/ws/place/v1/search', {
        region: this.currentMissionInfo.province,
        boundary: 'nearby(' + lat + ',' + lng + ',5000,1)',
        output: 'jsonp&callback=cb',
        key: '75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN',
        page_size: 1
      }).then(res => {
        this.infoWindow = new TMap.InfoWindow({
          map: this.map,
          position: new TMap.LatLng(lat, lng),
          offset: { x: 0, y: -15 }, // 设置信息窗相对position偏移像素
          content: res.data[0].title
        })
        this.infoWindow.open()
      })
    },
    watchMarket () {
      this.gatherObj.on('click', (e) => { this.windowWatch(e.latLng.lat, e.latLng.lng) })
      this.clueObj.on('click', (e) => { this.windowWatch(e.latLng.lat, e.latLng.lng) })
      this.commonObj.on('click', (e) => { this.windowWatch(e.latLng.lat, e.latLng.lng) })
      this.gatherObj.on('dblclick', (e) => {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
        this.datas = []
        this.img = []
        this.control = 1
        this.datas = this.gatherTex[e.geometry.id - 1]
        this.img = JSON.parse(this.gatherTex[e.geometry.id - 1].imgUrl)
      })
      this.clueObj.on('dblclick', (e) => {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
        this.datas = []
        this.img = []
        this.control = 1
        this.datas = this.clueTex[e.geometry.id - 1]
        this.img = JSON.parse(this.clueTex[e.geometry.id - 1].imgUrl)
      })
      this.commonObj.on('dblclick', (e) => {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
        this.datas = []
        this.img = []
        this.control = 1
        this.datas = this.commonTex[e.geometry.id - 1]
        this.img = JSON.parse(this.commonTex[e.geometry.id - 1].imgUrl)
      })
    },
    saves () {
      this.infoWindow.close()
      const data = {}
      data.name = this.datas.name
      data.description = this.datas.description
      data.imgUrl = JSON.stringify(this.img)
      data.type = this.datas.type
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
    initMap () {
      const info = this.currentMissionInfo
      this.map = new TMap.Map(this.$refs['map-container'], {
        zoom: 12.5,
        center: new TMap.LatLng(info.latitude, info.longitude),
        scaleControl: true
      })
      const that = this
      this.mapEvent()
      // 地图回调监听函数
      this.map.on('dblclick', function (res) {
        that.control = 0
        that.datas = []
        that.pointGet = [res.latLng.lat, res.latLng.lng]
        if (that.pointGet) {
          that.datas = []
          that.showGet = true
        }
      })
    },
    createLine (data) {
      const line = []
      const useLine = []
      for (let a = 0; a < data.length; a++) {
        const lines = []
        const num = data[a].trackPoints.length
        for (let l = 0; l < num; l++) {
          lines[l] = new TMap.LatLng(data[a].trackPoints[l].latitude, data[a].trackPoints[l].longitude)
        }
        if (lines) {
          line.push({
            'id': a.toString(),
            'styleId': 'sty' + ((a % 6) + 1),
            'paths': lines
          })
        }
      }
      if (line) {
        let d = 0
        for (let e = 0; e < line.length; e++) {
          if (line[e].paths.length) {
            line[e].id = d.toString()
            useLine.push(line[e])
            this.lineTex.push({
              name: data[e].volunteer.volunteerInformation.name,
              phone: data[e].volunteer.phone
            })
            d++
          }
        }
      }
      this.poLine = new TMap.MultiPolyline({
        map: this.map,
        styles: {
          'sty1': new TMap.PolylineStyle(this.polineStyle[0]),
          'sty2': new TMap.PolylineStyle(this.polineStyle[1]),
          'sty3': new TMap.PolylineStyle(this.polineStyle[2]),
          'sty4': new TMap.PolylineStyle(this.polineStyle[3]),
          'sty5': new TMap.PolylineStyle(this.polineStyle[4]),
          'sty6': new TMap.PolylineStyle(this.polineStyle[5])
        },
        geometries: useLine
      })
      this.poLine.on('click', (e) => {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
        const conten = ` <div style="width: 128px;height: 80px;display: flex;justify-content: center;align-items: center;flex-wrap: wrap">
        <div style="width: 200px;height: 10px;">
          <p style="text-align: center;">志愿者: ` + this.lineTex[e.geometry.id].name + `</p>
        </div>
        <div style="width: 200px;height: 30px">
            <p style="text-align: center;">手机号: ` + this.lineTex[e.geometry.id].phone + `</p>
        </div>
    </div>`
        this.infoWindow = new TMap.InfoWindow({
          map: this.map,
          position: new TMap.LatLng(e.latLng.lat, e.latLng.lng),
          offset: { x: 0, y: -3 },
          content: conten
        })
        this.infoWindow.open()
      })
    },
    getLine () {
      getTrack({ caseId: this.$store.state.data.caseId }).then(res => {
        this.createLine(res.data)
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
          'lostplace-marker': new TMap.MarkerStyle({
            'src': 'https://fwwb2020-common.tgucsdn.com/images/map/lost_place.png',
            'width': 35,
            'height': 35
          })
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

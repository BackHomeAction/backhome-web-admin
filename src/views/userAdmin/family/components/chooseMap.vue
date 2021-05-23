<template>
  <div class="borderbox" @click="exitMap">
    <div class="bodys" @click.stop="() => {}">
      <div class="inboxs">
        <div style="width: 100%;height: 100%;border-radius: 30px;z-index:5;">
          <div id="mapbox" />
        </div>
        <div class="searchbox">
          <a-input-search
            v-model="searchInput"
            @change="listenInput"
            @search="inputSearch"
            style="float: left;width: 440px;height: 50px;"
            size="large"
            placeholder="input search text"
            enter-button/>
          <transition name="change">
            <div class="listMap" v-if="listShow">
              <a-list item-layout="horizontal" :data-source="data">
                <a-list-item
                  slot="renderItem"
                  slot-scope="item, index"
                  rowKey="rowKey"
                  :key="index"
                  style="margin-left: 8px"
                  v-if="!item.choose">
                  <a-list-item-meta :description="item.address">
                    <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
                  </a-list-item-meta>
                  <a-button type="primary" style="margin-right: 5px" @click="() => {chooseIt(item,index);item.choose = true;var ex =data;data = [];data = ex}" >添加</a-button>
                </a-list-item>
              </a-list>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script charset="utf-8" src="https://map.qq.com/api/js?v=2.exp&key=75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN"></script>
<script src="https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js"></script>
<script>
import { arrayChange, marketGet } from '@/api/TMaps'
export default {
  name: 'ChooseMap',
  mounted () {
    this.$jsonp('https://apis.map.qq.com/ws/location/v1/ip', {
      key: '75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN',
      jsonpCallback:"success_jsonpCallback",
      output: 'jsonp',
    }).then(res => {
      this.city = res.result.ad_info.city
      this.latlng = [res.result.location.lat,res.result.location.lng]
     if(res.result.location){
       this.getMap()
     }
    })
  },
  data: function() {
    return {
      searchInput: '',
      marketAray: [],
      objAray: '',
      listShow: false,
      map: null,
      center: null,
      choosePla: null,
      markets: null,
      latlng: [39.984120, 116.307484],
      marketLL: [0,0],
      marketLayer: null,
      data : [],
      city: null
    }
  },
  methods: {
    inputSearch: function () {
      this.listShow = true
      let pla = this.searchInput
      let city = this.city
      var lat,lng
      if(this.marketLL[0]){
        lat = this.marketLL[0]
        lng = this.marketLL[1]
      } else {
        lat = this.latlng[0]
        lng = this.latlng[1]
      }
      if(pla){
        this.$jsonp('https://apis.map.qq.com/ws/place/v1/search', {
          region: (this.$store.state.data.oldManData.oldmanEdit.city),
          keyword: pla,
          boundary:'nearby('+lat+','+lng+',500000,1)',
          output: 'jsonp&callback=cb',
          key: '75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN',
          page_size: 20
        }).then(res => {
          this.data = []
          this.data = res.data
          for (let e = 0; e < this.data.length; e++) {
            this.data[e].choose = false
          }
          if(this.$store.state.data.chooseUses){
            for(let c=0;c<this.$store.state.data.chooseUses.length;c++){
              for(let d=0;d<this.data.length;d++){
                if(this.$store.state.data.chooseUses[c].name === this.data[d].title){
                  this.data[d].choose = true
                }
              }
            }
          for(let g=0;g<this.data.length;g++){
            if(this.data[g].choose === false){
              this.searchInput = this.data[g].title
              break;
            }
          }
          }
          if(res.data[0]) {
            this.changes(res.data[0].location.lat, res.data[0].location.lng)
            if (this.data[0]) {
              this.listShow = true
            }
            var that = this
            if (that.objAray) {
              that.objAray.setMap(null)
            }
            this.marketAray = []
            for (var d = 0; d < res.data.length; d++) {
              let arraySon = {
                "id": '',
                "position": new window.TMap.LatLng(res.data[d].location.lat, res.data[d].location.lng),
                "styleId": 'marker',
              }
              that.marketAray.push(arraySon)
            }
            this.objAray = new TMap.MultiMarker({
              map: this.map,
              geometries: this.marketAray,
              styles: {
                "marker": new TMap.MarkerStyle({
                  "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png'
                })
              }
            })
            var bounds = new TMap.LatLngBounds();
            this.marketAray.forEach(item => {
              if (bounds.isEmpty() || !bounds.contains(item.position)) {
                bounds.extend(item.position);
              }
            })
            this.map.fitBounds(bounds, {
              padding:200
            })
          } else {
            this.objAray.setMap(null)
            this.listShow = false
            this.searchInput = ''
          }
        })
      } else {
        this.listShow = false
       this.$message.error('搜索项为空', 10)
        this.data = []
      }
    },
    placeRequest: function (lat,lng) {
      this.$jsonp('https://apis.map.qq.com/ws/place/v1/search', {
        region : this.city,
        boundary:'nearby('+lat+','+lng+',5000,1)',
        output:'jsonp&callback=cb',
        key : '75ABZ-3LBEJ-4JDF5-FJG6X-QZ4Q7-TDBMN',
        page_size:20
      }).then(res => {
        this.searchInput = res.data[0].title
        this.data = []
        this.data = res.data
        for (let e = 0; e < this.data.length; e++) {
          this.data[e].choose = false
        }
        if(this.$store.state.data.chooseUses){
          for(let c=0;c<this.$store.state.data.chooseUses.length;c++){
            for(let d=0;d<this.data.length;d++){
              if(this.$store.state.data.chooseUses[c].name === this.data[d].title){
                this.data[d].choose = true
              }
            }
          }
          for(let g=0;g<this.data.length;g++){
            if(this.data[g].choose === false){
              this.searchInput = this.data[g].title
              break;
            }
          }
        }
       if(this.data[0]){
         this.listShow = true
       }
      })
    },
    chooseIt: function (num,index) {
      for(let g=0;g<this.data.length;g++){
        if(g !== index) {
          if (this.data[g].choose === false) {
            this.searchInput = ''
            this.searchInput = this.data[g].title
            break;
          }
        }
      }
      this.$message.success('添加成功',10)
      var uses = {
        address: '',
        city: '',
        district: '',
        latitude: '',
        longitude: '',
        name: '',
        province: ''
      }
      uses.address = num.address
      uses.name = num.title
      uses.city = num.ad_info.city
      uses.district = num.ad_info.district
      uses.province = num.ad_info.province
      uses.latitude = num.location.lat
      uses.longitude = num.location.lng
      if(!this.$store.state.data.chooseUses) {this.$store.state.data.chooseUses = []}
      this.$store.state.data.chooseUses.push(uses)
      this.changes(num.location.lat,num.location.lng)
    },
    exitMap: function () {
      this.$store.state.data.controlMap = false
    },
    getMap: function () {
      this.center = new window.TMap.LatLng(this.latlng[0],this.latlng[1])
      this.map = new window.TMap.Map(document.getElementById('mapbox'), {
        center: this.center
      })
      var that = this
      this.map.on('click',function (event) {
        if(that.objAray){that.objAray.setMap(null)}
        that.marketLL = [event.latLng.lat,event.latLng.lng]
        that.changes(event.latLng.lat,event.latLng.lng)
        that.placeRequest(event.latLng.lat,event.latLng.lng)
      })
      this.map.on('dragstart',()=>{
        if(!this.objAray){
          this.listShow = false
        }
      })
     this.marketLayer =  new TMap.MultiMarker({
        map: this.map,
        geometries:[{
          "id": '1',
          "position": this.center,
        }]
      })
    },
    changeCenter: function (lat,lng) {
      this.map.panTo(new TMap.LatLng(lat,lng),{duration: 500})
    },
    changes: function (lat,lng) {
      var thisLan = new TMap.LatLng(lat,lng)
      this.marketLayer.updateGeometries({
        "id": '1',
        "position": thisLan
      })
      this.changeCenter(lat,lng)
    },
    listenInput: function (e) {
      if(this.objAray){this.objAray.setMap(null)}
      if (!this.searchInput) {
        this.listShow = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.change-enter,.change-leave-to {
  opacity: 0;
}
.change-enter-active ,.change-leave-active {
  transition: opacity 0.8s;
}
.flex{
  display: flex;
  justify-content: center;
  align-items: center;
 }
 .borderbox{
   width: 100%;
   height: 100%;
   z-index:15;
   position: absolute;
   .flex();
   background-color: rgba(128,128,128,.5);
 }
 .borderbox::before{
   content: '';
   display: inline-block;
   position: absolute;
   width: auto;
   height: auto;
   z-index:16;
   background-color: black;
 }
 .bodys{
   width: 90%;
   height: 90%;
   position: relative;
   z-index: 17;
   .flex();
   .inboxs{
     height: 100%;
     width: 97%;
     display: flex;
     flex-wrap: wrap;
     position: relative;
     .searchbox{
       width: 440px;
       height: 700px;
       margin-left: 24px;
       margin-top: 24px;
       position: absolute;
       left: 0;
       top: 0;
       z-index: 6;
       float: left;
     }
     #mapbox{
       border-radius: 30px;
       position: relative;
       width: 100%;
       height: 100%;
       float: left;
     }
     .listMap{
       overflow: auto ;
       width: 440px;
       height: 700px;
       margin-top: 50px;
       background-color: rgba(255,255,255,.9);
     }
   }
 }

</style>

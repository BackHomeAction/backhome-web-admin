<template>
  <div class="map">
    <div id="map-container" ref="map-container" />
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      map: null,
      markers: {
        circle: null,
        lostPlace: null,
        offenPlaces: null,
        volunteers: null
      }
    }
  },
  mounted () {
    this.initMap()
    this.initMarkers()
  },
  computed: {
    ...mapGetters(['currentMission', 'currentMissionInfo', 'onlineMembers'])
  },
  methods: {
    initMap () {
      const info = this.currentMissionInfo
      this.map = new TMap.Map(this.$refs['map-container'], {
        zoom: 12.5,
        center: new TMap.LatLng(info.latitude, info.longitude),
        scaleControl: true
      })
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
          'offenplace-marker': new TMap.MarkerStyle({
            'src': 'https://fwwb2020-common.tgucsdn.com/images/map/offen_place.png',
            'width': 35,
            'height': 35
          })
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

      console.log(this.markers)
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

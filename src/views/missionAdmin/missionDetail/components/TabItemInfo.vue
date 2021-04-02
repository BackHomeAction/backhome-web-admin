<template>
  <a-descriptions bordered>
    <a-descriptions-item label="姓名">
      {{ currentMissionInfo.oldMan.name }}
    </a-descriptions-item>
    <a-descriptions-item label="性别">
      {{ currentMissionInfo.oldMan.sex === 1 ? '男' : '女' }}
    </a-descriptions-item>
    <a-descriptions-item label="出生日期">
      {{ currentMissionInfo.oldMan.birthDate | moment }}
    </a-descriptions-item>
    <a-descriptions-item label="报案时间">
      {{ currentMissionInfo.startTime }}
    </a-descriptions-item>
    <a-descriptions-item label="走失时间">
      {{ currentMissionInfo.lostTime }}
    </a-descriptions-item>
    <a-descriptions-item label="走失地点">
      {{ currentMissionInfo.place }}
    </a-descriptions-item>
    <a-descriptions-item label="家属联系方式">
      {{ currentMissionInfo.oldMan.phone || '暂无' }}
    </a-descriptions-item>
    <a-descriptions-item label="体貌特征" :span="2">
      {{ featureText }}
    </a-descriptions-item>
    <a-descriptions-item label="疾病信息" :span="3">
      {{ currentMissionInfo.oldMan.disability || '暂无' }}
    </a-descriptions-item>
    <a-descriptions-item label="常去地点" :span="3">
      {{ offenPlaceText }}
    </a-descriptions-item>
    <a-descriptions-item label="备注" :span="3">
      {{ currentMissionInfo.others || '暂无' }}
    </a-descriptions-item>
    <a-descriptions-item label="照片" :span="3">
      <div class="photo" v-viewer>
        <img class="photo__item" v-for="(item, index) in photos" :key="index" :src="item" />
      </div>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['currentMissionInfo']),
    offenPlaceText () {
      let text = ''
      const list = JSON.parse(this.currentMissionInfo.oldMan.offerPlace)
      list.map((ele, index) => {
        if (index !== list.length - 1) {
          text += `${ele.name}、`
        } else {
          text += ele.name
        }
      })

      if (!text) return '暂无'

      return text
    },
    featureText () {
      let text = ''

      if (this.currentMissionInfo.oldMan.height) {
        text += `身高${this.currentMissionInfo.oldMan.height}cm，`
      }
      if (this.currentMissionInfo.oldMan.weight) {
        text += `体重${this.currentMissionInfo.oldMan.weight}kg，`
      }
      if (this.currentMissionInfo.oldMan.senileDementia === 2) {
        text += '患有老年痴呆，'
      }
      if (this.currentMissionInfo.oldMan.others) {
        text += `${this.currentMissionInfo.oldMan.others}，`
      }

      if (!text) return '暂无'

      return text.substring(0, text.lastIndexOf('，'))
    },
    photos () {
      const idPhoto = this.currentMissionInfo.oldMan.identificationPhoto
      const lifePhotos = this.currentMissionInfo.oldMan.lifePhoto && JSON.parse(this.currentMissionInfo.oldMan.lifePhoto) || []

      return [idPhoto, ...lifePhotos]
    }
  }
}
</script>

<style lang="less" scoped>
.photo {
  &__item {
    display: inline-block;
    margin-right: 16px;
    width: 120px;
    height: 80px;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>

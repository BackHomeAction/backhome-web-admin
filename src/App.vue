<template>
  <a-config-provider :locale="locale">
    <div id="app" :style="{'overflow':this.$store.state.data.controlMap? 'hidden':'auto' }">
      <div v-if="this.$store.state.data.controlMap" style="width: 100%;height: 100%">
        <choose-map/>
      </div>
      <router-view style="position: relative;z-index:3;" />
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import chooseMap from '@/views/userAdmin/family/components/chooseMap'

export default {
  data () {
    return {
    }
  },
  components: {
    chooseMap
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>

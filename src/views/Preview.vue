<template>
  <div class="preview">
    <!-- 1. 导航 -->
    <Navigation :bgColor="''" :fontColor="'#000'" :navBack="false" :navClose="false" :showUsr="false" :showBtn="false" :showEdit="true" :showRule="false" :navContent="'我的配对资料'" :textAlign="'center'" />

    <!-- 2. swiper区 -->
    <MainCard :pageType="'preview'" :showTip="false" :tipObj="tipObj" />
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import Navigation from "@/components/Navigation"
import MainCard from "@/components/MainCard"

export default {
  name: 'Preview',
  components: {
    Navigation,
    MainCard
  },
  data() {
    return {
      tipObj: {
        editFlag: false,
        slideFlag: false,
        likeFlag: false,
        editTip: "编辑配对资料, 才能认识更多朋友哦!",
        slideTip: "试试向侧面滑动 了解Ta的兴趣爱好!",
        likeTip: "喜欢就点, 来交个朋友吧~"
      },
    }
  },
  mounted() {
    if (this.$route.query.isUpdate) {
      this.SetToast({status: 1, type: 'success', msg: '配对资料已更新'})
    }
  },
  methods: {
    ...mapActions(["SetToast"])
  }
}
</script>

<style lang="scss" scoped>
.preview{
  height: 100%;
}
</style>

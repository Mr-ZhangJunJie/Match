<template>
  <div id="app" :class="{'big-screen':bigScreen}">
    <Loading style="color:#fff;" />
    <Toast />
    <router-view />
  </div>
</template>
<script>
import {mapActions,mapMutations} from 'vuex'
import JudgeScreen from "@/utils/JudgeScreen.js"
import Loading from "@/components/Loading"
import Toast from '@/components/Toast'
import {webpIsSupported} from '@/utils/common'

export default {
  name: "app",
  data(){
      return{
          bigScreen: false
      }
  },
  components: {
    Loading,
    Toast
  },
  async mounted() {
    // 获取浏览器的视口高度有误差，延迟获取
    let timer = setInterval(()=>{
        if(window.innerHeight > window.screen.height-100){
            clearInterval(timer);
            this.bigScreen = JudgeScreen.bigScreen();
        }
    },100);
    window.addEventListener('offline', () => {
      this.SetToast({status: 1, msg: '网络异常，请检查网络'})
    });

    let ret = await webpIsSupported();
    this.setWebp(ret);
  },
  methods: {
    ...mapActions(["SetToast"]),
    ...mapMutations(['setWebp'])
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fff;
  color: #000;
  height: 100%;
}
// 去掉tab上面的border
[class*=van-hairline]::after {
  border: 0 solid #ebedf0;
}

.van-cell{
  padding: 0!important;
}
// 去掉feed中boder-bottom
.van-cell:not(:last-child)::after {
  border-bottom: 0!important;
}
</style>

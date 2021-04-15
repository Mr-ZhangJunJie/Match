<template>
  <!-- 父子组件 -->
  <div class="component-toast-box" 
    :style="contentStyle" 
    :class="[toastContent.type, animationClass, {'component-toast-box-big': isBigScreen}]"
    @animationend="onAnimationEnd" 
    @webkitAnimationEnd="onAnimationEnd">
    <p>{{toastContent.msg}}</p>
  </div>

</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default{
  name: "Toast",
  data() {
    return{
      isBigScreen: false, // 判断手机是否是全面屏
      duration: 0,        // css3一次动画需要的时间
      animationClass: ''  // 添加animate动画
    }
  },
  computed: {
    contentStyle() {
      return {
        animationDuration: this.duration + 'ms'
      };
    },
    ...mapGetters(["toastContent"])
  },
  created() {
    this.isBigScreen = this.judgeScreen()
  },
  methods: {
    ...mapActions(["SetToast"]),
    onAnimationEnd() {
      this.animationClass = '';
      this.duration = 0;
    },

    // 标准屏和全面屏兼容
    judgeScreen() {
      // window.screen.height 为屏幕高度
      // window.screen.availHeight 为浏览器 可用高度
      let result = false;
      const rate = window.screen.height / window.screen.width;    
      let limit =  window.screen.height == window.screen.availHeight ? 1.8 : 1.65; // 临界判断值  
      if (rate > limit) {
        result = true;
      }
      return result;
    }
  },
  watch: {
    toastContent: {
      handler(newVal) {
        if (newVal) {
          this.duration = this.toastContent.delay
          this.animationClass = this.isBigScreen ? 'animate-bigScreen' : 'animate'
          
          let timer = setTimeout(() => {
            this.SetToast({status: 0, type: 'error', msg: ''})
            clearTimeout(timer)
          }, this.duration)
        } 
      },
      deep: true
    }
  }
}
</script>

<style scoped lang='scss'>
.component-toast-box{
  width: 100%;
  height: 112px;
  position: fixed;
  line-height: 35px;
  left: 0;
  top: -100%;
  opacity: 0;
  transform: translateY(-100%);
  box-sizing: border-box;
  text-align: center;
  z-index: 1000;
  display: flex; 
  justify-content: center;
  align-items: center;
  p{
    padding: 20px 120px;
    box-sizing: border-box;
    font-size: 30px;
  }
}

.error{
  background-color: #F60000;
  p{
    color: #fff;
    font-weight: bold;
  }
}
.success{
  background-color: #33EEA7;
  p{
    color: #323232;
    font-weight: bold;
  }
}

.animate {
  animation: dance;
  animation-delay: 30ms;
}
.animate-bigScreen{
  animation: dance-big;
  animation-delay: 30ms;
}
.component-toast-box-big{
  height: 180px;
  padding-top: 68px;
}

@keyframes dance{
  0% {
    opacity: 0;
    top: -112px;
    transform: translateY(-100%);
  }
  20% {
    opacity: 1;
    top: 0;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    top: 0;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    top: -112px;
    transform: translateY(-100%);
  }
}

@keyframes dance-big{
  0% {
    opacity: 0;
    top: -112px;
    transform: translateY(-100%);
  }
  20% {
    opacity: 1;
    top: 0;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    top: 0;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    top: -112px;
    transform: translateY(-100%);
  }
}

</style>
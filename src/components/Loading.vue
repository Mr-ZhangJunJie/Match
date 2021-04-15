<template>
    <div
      class="request-loading-component"
      v-show="requestLoading.flag"
      :style="{backgroundColor: requestLoading.bg}"
    >
      <div class="load-bg">
        <!-- <img :src="require('@/assets/img/loading/loading-icon.png')" class="load-rotate" /> -->
        <img :src="require('@/assets/img/loading/spinner_72@3x.png')" class="load-rotate" />
      </div>
      <p>{{requestLoading.text}}</p>
    </div>
</template>

<script>
// import { mapGetters, mapActions } from "vuex";
import { mapGetters } from "vuex";
export default {
  name: "Loading",
  methods: {
    // ...mapActions(["SetLoading"])
  },
  computed: {
    ...mapGetters(["requestLoading"])
  },
  mounted() {

    // this.$store.commit('SET_LOADING', {flag: 1, text: '正在等待pk结果。。。'})

    // this.SetLoading({flag:1,text:'正在等待pk结果。。。'})
    // this.SetLoading({flag:1,text:'正在等待pk结果...',bg:'rgba(0,0,0,0.3)'})
  }
};
</script>

<style lang='scss' scoped>
.request-loading-component {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  // .bg{
  //   width: 60PX;/*no*/
  //   height: 60PX;/*no*/
  //   border-radius: 50%;
  //   background-color: rgba(0, 0, 0, 0.4);
  //   display: flex;
  //   justify-content: center;
	// 	align-items: center;
	// 	img{
  //     margin: 1PX 0 0 1PX;/*no*/
  //     width: 23PX;/*no*/
  //     height: 23PX;/*no*/
	// 	}
  // }
  .load-bg{
    width: 60PX;/*no*/
    height: 60PX;/*no*/
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
		align-items: center;
		img{
      margin: 1PX 0 0 1PX;/*no*/
      width: 36PX;/*no*/
      height: 36PX;/*no*/
		}
  }
  p{
    margin-top: 10PX;/*no*/
    font-size: 15PX;/*no*/
    color: currentColor;
  }
}
.load-rotate {
  animation: rotating 2s infinite linear;
}
@keyframes rotating {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

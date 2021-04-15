<template>
    <nav class="component-navigation" :style="{background: bgColor, color: fontColor}">
      <h2 :style="{textAlign: textAlign, backgroundImage: `url(${bgImg})`}" class="component-navigation-txt">{{navContent}}
        <span class="component-usr" v-show="showUsr" @click.self="handleUsr">
          <i v-if="showRedDot" class="red-dot"></i>
        </span>
        <span v-show="navClose" class="component-square" @click.self="handleCloseH5"></span>
        <span v-show="navBack" class="component-back" @click.self="handleBack"></span>
        <span v-show="showRule" class="component-rule" @click.self="handleRule"></span>
        <span v-show="showBtn" class="component-btn" :class="{'component-btn-active': isActive}" @click.self="handleComplete">完成</span>
        <span v-show="showEdit" class="component-edit" @click.self="handleEdit"></span>
        <span v-show="showEdit2" class="component-edit2" @click.self="handleEdit2">编辑资料</span></h2>
    </nav>
</template>

<script>
import appApi from '@/api/api'
import {mapActions,mapGetters} from 'vuex'

export default {
  name: "Navigation",
  props: {
    bgImg: {
      type: String,
      default: require('../assets/img/navImg/blank1x1.png')
    },
    bgColor: {
      type: String,
      default: '#fff'
    },
    fontColor: {
      type: String,
      default: '#333'
    },
    textAlign: {
      type: String,
      default: '#333'
    },
    navContent: {
      type: String,
      default: ''
    },
    navBack: {
      type: Boolean,
      default: false
    },
    navClose: {
      type: Boolean,
      default: false
    },
    showRule: {
      type: Boolean,
      default: false
    },
    showUsr: {
      type: Boolean,
      default: false
    },
    showRedDot: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    showEdit2: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(["myApp"]),
  },
  methods: {
    ...mapActions(["SetToast", "SetLoading"]),
    // 去个人中心
    handleUsr() {
      _html({e: 'match.my.profile', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
      localStorage.setItem('$pageName', 'Home')
      this.$emit("notifyUserCenter")
    },

    handleComplete() {
      if (this.isActive) {
        this.$emit("notifyComplete")
        _html({e: 'match.my.info', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
      }
    },

    // 关闭H5
    handleCloseH5() {
      let timer = setTimeout(() => {
        window.location.href = 'ZEPETO://WEBVIEW/CLOSE'
        clearTimeout(timer)
      }, 60);
      appApi.getUserOffline({token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {

          } else {
            this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
            this.SetLoading({flag: 0, text: '', bg: 'transparent'})
          }
        })
        .catch(err => {
          this.SetToast({status: 1, msg: err})
          this.SetLoading({flag: 0, text: '', bg: 'transparent'})
        });
    },

    // 返回主页
    handleBack() {
      if (this.$route.path == '/user') {
        this.$router.push({name: 'Home'})
      } else {
        if (localStorage.getItem('$pageName') == "isPreview") {
          this.$router.push({path: '/edit', query: {edited: true}})
        } else {
          this.$router.push({
            name: localStorage.getItem('$pageName'),
          })
        }
      }
    },

    // 显示规则
    handleRule() {
      this.fixedBody()
    },

    /**
     * 弹窗滑动时，滚动不穿透
     */
    fixedBody () {
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
    },

    handleEdit() {
      _html({e: 'match.info.edit', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
      localStorage.setItem('$pageName', 'Preview')
      this.$router.push({path: '/edit', query: {edited: true}})
    },

    handleEdit2() {
      _html({e: 'match.info.edit', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
      localStorage.setItem('$pageName', 'User')
      this.$router.push({path: '/edit', query: {edited: true}})
    }
  }
}
</script>

<style lang="scss" scoped>
.component-navigation{
  width: calc(100% - 36px - 36px);
  height: 72px;
  padding: 20px 36px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 19;
  .component-navigation-txt{
    position: relative;
    height: 72px;
    line-height: 72px;
    font-size: 30px;
    font-weight: bold;
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 168px 56px;
    .component-usr{
      position: absolute;
      top: 0;
      right: 96px;
      width: 72px;
      height: 72px;
      background: url('../assets/img/navImg/myPage_72@3x.png') no-repeat right center;
      background-size: 72px 72px;
    }
    .red-dot{
      position: absolute;
      top: -6px;
      right: 0;
      width: 30px;
      height: 30px;
      background: url('../assets/pic/home/redDot_30@3x.png') no-repeat center center;
      background-size: 30px 30px;
    }
    .component-square{
      position: absolute;
      top: 0;
      right: 0;
      width: 72px;
      height: 72px;
      background: url('../assets/img/navImg/ex_72@3x.png') no-repeat right center;
      background-size: 72px 72px;
    }
    .component-back{
      position: absolute;
      top: 0;
      left: 0;
      width: 72px;
      height: 72px;
      background: url('../assets/img/navImg/back_72@3x.png') no-repeat left center;
      background-size: 72px 72px;
    }
    .component-rule{
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 60px;
      background: url('../assets/img/nav/ic_rule@3x.png') no-repeat right center;
      background-size: 36px 36px;
    }
    .component-btn{
      position: absolute;
      top: 0;
      right: 0;
      width: 108px;
      height: 68px;
      line-height: 68px;
      border-radius: 34px;
      background-color: #F4F3F6;
      font-size: 26px;
      color: #7A7A86;
      text-align: center;
    }
    .component-btn-active{
      background-color: #6332F8;
      color: #fff;
    }
    .component-edit{
      position: absolute;
      top: 0;
      right: 0;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: url('../assets/pic/edit/ex_72@3x.png') no-repeat center center;
      background-size: 72px 72px;
    }
    .component-edit2{
      position: absolute;
      top: 0;
      right: 0;
      width: 160px;
      height: 72px;
      background: #F1F3F8;
      border-radius: 36px;
      text-align: center;
      box-sizing: border-box;
      line-height: 74px;
      font-weight: bold;
      font-size: 26px;
    }
  }
}
.big-screen{
  .component-navigation{
    padding-top: 94px;
  }
}
</style>

<template>
  <div class="mainCard" :class="[{'usrBorderRadius': pageType === 'user'}, {'mainCard-big': isBigScreen && pageType !== 'user'}]">
      <!-- 1. swiper -->
      <div class="custom-card" :class="{'usrBorderRadius': pageType === 'user'}" :style="{background: cardBgColor}">
        <img class="close-card" src="../assets/pic/icon/ex@3x.png" v-if="pageType === 'user'" @click="closeCard" />

        <van-swipe ref="swipe" v-if="images.length" @change="onChange" class="swipe-box" :class="{'swipe-box-big': isBigScreen && pageType !== 'user'}">

          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img class="zz-img" v-lazy="(isSupportWebp && image['photoBoothWebp'])?image['photoBoothWebp']:image['photoBooth']" />
          </van-swipe-item>

          <template #indicator>
            <div class="custom-indicator">
              <i class="custom-icon" v-for="(indicator, iNum) in images" :key="iNum" :class="{'custom-icon-active': iNum == current}" @click="changeTab(iNum)">
                <img :src="require(`../assets/pic/icon/${indicator.labelCode}.png`)" />
              </i>
              <span v-if="(pageType === 'user') && (dataObject.userId != usrObj.userId) && dataObject.isFollow == 2" class="custom-follow" :class="{'custom-follow-active': dataObject.isFollow === 1}" @click="handleFollow">{{dataObject.isFollow == 1 ? '已关注' : '关注'}}</span>
            </div>
          </template>

        </van-swipe>

        <!-- 2. 用户信息面板 -->
        <div class="user-pannel" v-if="images.length">

          <div class="user-info">
            <span class="user-nickname">{{dataObject.nickName}}</span>
            <span class="user-status-on" v-if="dataObject.offLine && dataObject.offLine === '活动中'">{{dataObject.offLine}}</span>
            <span class="user-status-un" v-else-if="dataObject.offLine == ''">{{dataObject.offLine}}</span>
            <span class="user-status-off" v-else>{{dataObject.offLine}}</span>
          </div>

          <p v-if="images.length" class="user-txt">{{images[current].labelInput}}</p>

        </div>

        <div v-if="tipObj.slideFlag">
          <div class="bubble-card-box">
            <div class="bubble-right">
              <p>试试向侧面滑动</p>
              <p>了解Ta的兴趣爱好!</p>
            </div>
          </div>
        </div>

      </div>

      <!-- 3. 按钮 -->
      <div class="handle-pannel" v-if="images.length && (pageType === 'home' || pageType === 'preview')">
        <div v-if="tipObj.editFlag" class="bubble-box-edit">
          <p class="bubble-bottom">{{tipObj.editTip}}</p>
        </div>
        <div v-if="tipObj.likeFlag">
          <div class="bubble-box-edit bubble-box-like">
            <p class="bubble-bottom">{{tipObj.likeTip}}</p>
          </div>
        </div>
        <div v-if="!hadEdit" class="btn-single">
          <button v-if="pageType === 'home'" class="btn-edit" @click.self.stop="handleEdit">编辑配对资料</button>
          <button v-else-if="pageType === 'preview'" class="btn-edit" @click.self.stop="handleEdit">去配对</button>
        </div>
        <div v-if="hadEdit" class="btn-group">
          <button class="btn-next" @click.self.stop="handleNext('dislike')"></button>
          <button class="btn-like" @click.self.stop="handleNext('like')"></button>
        </div>
      </div>

  </div>
</template>

<script>
import appApi from '@/api/api'
import {mapActions,mapGetters} from 'vuex'
import JudgeScreen from "@/utils/JudgeScreen.js"

export default {
  name: 'MainCard',
  props: {
    tipObj: {
      type: Object,
    },
    hadEdit: {
      type: Boolean,
      default: false
    },
    singleUserData: {
      type: Object,
    },
    pageType: {
      type: String
    }
  },
  data() {
    return {
      pageSize: 10, // 每页数据10条
      pageNum: 0,

      isBigScreen: false, // 判断手机是否是全面屏
      platform: null, // 判断手机系统
      isFist: true, // 第一次调推荐列表
      dataList: [], // 从接口拿到的总数据条数
      dataObject: {}, // 每组卡片的数据
      images: [], // 每组卡片里图片数据
      current: 0, // 每组卡片当前图
      cardBgColor: '',
      inputVal: '',

      recommendCardNum: 0,
      recommendCardTotal: 10,
      nextFlag: true, // 可以点击下一个

      likeEachOther: false, // matchStatus 1不喜欢，2喜欢，3互相喜欢

      animationClass: '',

      defHolder: "一起聊聊感兴趣的话题吧",

    };
  },
  created() {
    this.isBigScreen = JudgeScreen.bigScreen();

    if (this.pageType === 'home') {
      this.getRecommendCards()
    } else if (this.pageType === 'user') {
      this.dataObject = this.singleUserData
      this.images = this.dataObject.userLabelList
      this.cardBgColor = this.images[0].bgColor
      this.inputVal = this.images[0].labelInput
    } else if (this.pageType === 'preview') {
      this.dataObject = JSON.parse(localStorage.getItem('$previewData'))
      this.images = this.dataObject.userLabelList
      this.cardBgColor = this.images[0].bgColor
      this.inputVal = this.images[0].labelInput
    }

  },
  mounted() {
    this.SetLoading({flag: 0, text: '', bg: 'transparent'})
  },
  computed: {
    ...mapGetters(["myApp", "usrObj","isSupportWebp"])
  },
  methods: {
    ...mapActions(["SetLoading", "SetToast"]),
    // 获取设备系统 iOS or Android
    checkPlatForm() {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //iOS终端
        return "iOS";
      } else if (/(Android)/i.test(navigator.userAgent)) {
        //Android终端
        return "Android";
      }
    },

    // 获取推荐卡片列表
    getRecommendCards() {
      appApi.getMatchRecommend({token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && (res.code === 200 || res.code === 400)) {
            if (res.result.length === 0) {
              _html({e: 'match.status.fail', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})

              if (this.isFist) {
                this.isFist = false
                this.$emit('notifyHideCard', false)
              }
              this.recommendCardTotal = this.dataList.length
              this.SetLoading({flag: 0, text: '', bg: 'transparent'})
            } else if (res.result.length < 10) {
              _html({e: 'match.start', duid: this.myApp.duid, args: { userid: this.myApp.userId, "hashcode": this.myApp.zzId }})

              if (this.hadEdit) {
                _html({e: 'match.home', duid: this.myApp.duid, args: { userid: this.myApp.userId, "hashcode": this.myApp.zzId, "status": 0 }})
              } else {
                _html({e: 'match.home', duid: this.myApp.duid, args: { userid: this.myApp.userId, "hashcode": this.myApp.zzId, "status": 1 }})
              }

              this.pageNum = this.pageNum + 2
              console.log('this.pageNum_1::', this.pageNum)
              this.pageSize = res.result.length
              console.log('this.pageSize_1::', this.pageSize)
              this.dataList.push(...res.result)
              this.recommendCardTotal = this.dataList.length
              this.dataObject = this.dataList[this.recommendCardNum]
              this.images = this.dataList[this.recommendCardNum].userLabelList
              this.cardBgColor = this.images[0].bgColor
              this.inputVal = this.images[0].labelInput
            } else {
              _html({e: 'match.start', duid: this.myApp.duid, args: { userid: this.myApp.userId, "hashcode": this.myApp.zzId }})

              if (this.hadEdit) {
                _html({e: 'match.home', duid: this.myApp.duid, args: { userid: this.myApp.userId, "hashcode": this.myApp.zzId, "status": 0 }})
              } else {
                _html({e: 'match.home', duid: this.myApp.duid, args: { userid: this.myApp.userId, "hashcode": this.myApp.zzId, "status": 1 }})
              }

              this.pageNum = this.pageNum + 1
              console.log('this.pageNum_2::', this.pageNum)
              this.pageSize = res.result.length
              console.log('this.pageSize_2::', this.pageSize)
              if (this.recommendCardNum > this.recommendCardTotal) {
                this.recommendCardNum = this.recommendCardTotal
              } else {
                this.dataList.push(...res.result)
                this.recommendCardTotal = this.dataList.length
                this.dataObject = this.dataList[this.recommendCardNum]
                this.images = this.dataList[this.recommendCardNum].userLabelList
                this.cardBgColor = this.images[0].bgColor
                this.inputVal = this.images[0].labelInput
              }
            }

          } else {
            throw Error('网络请求超时，请稍后重试')
          }
        })
        .catch(err => {
          this.SetToast({status: 1, msg: err})
          this.SetLoading({flag: 0, text: '', bg: 'transparent'})
        });
    },

    // 监听change事件
    onChange(index) {
      this.current = index;
      this.cardBgColor = this.images[this.current].bgColor
      this.tipObj.slideFlag = false
      localStorage.setItem('$hasViewPage', JSON.stringify(this.tipObj))

      if (this.pageType === 'home') {
        _html({e: 'match.interest.tab', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "tab": this.hobbyTabNum(this.images[this.current].labelCode), "place": "home" }})
      } else if (this.pageType === 'user') {
        _html({e: 'match.interest.tab', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "tab": this.hobbyTabNum(this.images[this.current].labelCode), "place": "user_profile" }})
      } else if (this.pageType === 'preview') {
        _html({e: 'match.interest.tab', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "tab": this.hobbyTabNum(this.images[this.current].labelCode), "place": "my_info" }})
      }
    },

    // 点击tab
    changeTab(iNum) {
      this.current = iNum;
      this.$refs.swipe.swipeTo(iNum)
      this.cardBgColor = this.images[iNum].bgColor
      this.tipObj.slideFlag = false
      localStorage.setItem('$hasViewPage', JSON.stringify(this.tipObj))
    },

    // 点击不喜欢按钮 点击下一个按钮
    handleNext(type) {
      console.log('clike-type::', type)
      if (this.nextFlag) {
        this.SetLoading({flag: 1, text: '', bg: 'transparent'})
        this.nextFlag = false;
        if (type == 'dislike') {
          this.handleDislike()
        } else if (type == 'like') {
          this.handleLike()
        }
      }
    },

    // 不喜欢 看下一个
    handleDislike() {
      _html({e: 'match.user.select', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "type": "dislike" }})
      if (this.dataObject.zzId == "" || this.dataObject.zzId == undefined) {
        console.log('zzId::不存在---不喜欢')
        this.showNextImg(200)
      } else {
        _html({e: 'match.user.select', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "type": "dislike" }})

        appApi.dislikeCard({zzId: this.dataObject.zzId, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && (res.code === 200 || res.code === 400)) {
            this.tipObj.likeFlag = false
            localStorage.setItem('$hasViewPage', JSON.stringify(this.tipObj))
            this.showNextImg(200)
            this.refreshTime(2)
          } else {
            throw Error('网络请求超时，请稍后重试');
          }
        })
        .catch(err => {
          this.showNextImg(200)
          this.nextFlag = true;
          this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
          this.SetLoading({flag: 0, text: '', bg: 'transparent'})
        });
      }
    },

    // 喜欢
    handleLike() {
      _html({e: 'match.user.select', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "type": "like" }})
      if (this.dataObject.zzId == "" || this.dataObject.zzId == undefined) {
        this.showNextImg(200)
      } else {

        appApi.likeCard({zzId: this.dataObject.zzId, userId: this.dataObject.userId, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            this.likeEachOther = res.result.matchStatus == 3 ? true : false;

            if(res.result.completeItemQuest && res.result.completeItemQuest === 1){
                this.SetToast({status: 1, type:'success', msg: '盲盒任务完成，抽奖卡已发放'});
                // eslint-disable-next-line
                _html({
                    appid:'lottery',e: "lottery.Task.finish", bk: this.myApp.userId,duid: this.myApp.duid,args:{TaskID: 'match'}
                });
            }

            // matchStatus==3，匹配成功，匹配成功才有commonLabels字段
            if (res.result.commonLabels != undefined || res.result.commonLabels != "") {
              this.defHolder = res.result.commonLabels
            }
            this.$emit('notifyMarkLike', this.likeEachOther, this.dataObject.zzId, this.dataObject.userId, this.dataObject.nickName, res.result.commonLabels)
            this.tipObj.likeFlag = false
            localStorage.setItem('$hasViewPage', JSON.stringify(this.tipObj))

            if (res.result.matchStatus == 3) {
              this.nextFlag = true
            } else {
              this.showNextImg(1350)
            }
            this.refreshTime(1)
          } else {
            throw Error('网络请求超时，请稍后重试');
          }
        })
        .catch(err => {
          this.showNextImg(200);
          this.nextFlag = true;
          this.SetToast({status: 1, msg: err.message});
          this.SetLoading({flag: 0, text: '', bg: 'transparent'});
        });
      }
    },

    showNextImg(time) {
      if (!time) {
        time = 200
      }
      clearTimeout(timer)
      let timer = setTimeout(() => {
        this.recommendCardNum = this.recommendCardNum + 1
        if (this.recommendCardNum === this.recommendCardTotal) {
          console.log('当前卡片的索引值recommendCardNum和推荐卡片总数相等，即没有数据了', this.recommendCardNum, this.recommendCardTotal)
          _html({e: 'match.status.fail', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
          this.dataList = []
          this.recommendCardNum = 0
          this.dataObject = {}
          this.images = []
          this.pageSize = 10
          this.pageNum = 0
          this.$emit('notifyHideCard', false)
        } else {
          this.dataObject = this.dataList[this.recommendCardNum]
          this.images = this.dataList[this.recommendCardNum].userLabelList
          this.cardBgColor = this.images[0].bgColor
          this.inputVal = this.images[0].labelInput
          this.$refs.swipe.swipeTo(0)
          if (this.pageSize < 10) {
            if ((this.recommendCardNum - this.pageNum*10) == this.pageSize) {
              this.getRecommendCards()
            }
          } else {
            if ((this.recommendCardNum%10) == 8) {
              this.getRecommendCards()
            }
          }

          this.current = 0
          this.nextFlag = true
          this.SetLoading({flag: 0, text: '', bg: 'transparent'})
          clearTimeout(timer)
        }
      }, time)
    },

    // 刷新在线时间
    refreshTime(source) {
      appApi.getRefresh({source: source, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            this.SetLoading({flag: 0, text: '', bg: 'transparent'})
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

    handleEdit() {
      localStorage.setItem('$hasViewPage', JSON.stringify(this.tipObj))
      if (this.pageType === 'preview') {
        _html({e: 'match.now', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
        this.tipObj.editFlag = false
        this.tipObj.slideFlag = false
        this.tipObj.likeFlag = false
        this.$router.push({name: 'Home'})
      } else {
        _html({e: 'match.info.edit', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
        this.tipObj.editFlag = false
        this.$router.push({name: 'Edit'})
      }
    },

    closeCard() {
      this.$emit('notifyHideCard', false)
    },

    // 关注
    handleFollow() {
      if (this.dataObject.isFollow === 1) return; // 已经关注了
      let params = {
        authToken: this.usrObj.authToken,
        userId: this.dataObject.userId,
        duid: "-",
        ua: "zepeto.service.zzz.crew/1.0.0"
      };

      _html({e: 'match.follow', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "place": "user_profile" }})

      appApi.setFollow(params)
        .then(res => {
          if (res && res.code === 200) {
            if (res.result === '{"isSuccess":true}') {
              return this.dataObject.isFollow = 1
              this.refreshTime(5)
            } else {
              this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
              this.SetLoading({flag: 0, text: '', bg: 'transparent'})
            }
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

    // 获取兴趣标签索引值，默认按这个数组的索引，大数据埋点使用
    hobbyTabNum(hobby) {
      let tabIds = ['introduce', 'video', 'game', 'shopping', 'music', 'emotion']
      let hobbyTabNum = tabIds.indexOf(hobby)
      console.log('hobbyTabNum::', hobbyTabNum)
      return hobbyTabNum + 1
    }

  }
};
</script>

<style lang="scss" scoped>
// 缩略图 icon 样式
// ::-webkit-scrollbar {
//   width: 0;
//   height: 0;
// }

// // swiper样式
.mainCard{
  height: 100%;
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;

  .close-card{
    position: absolute;
    top: 24px;
    right: 30px;
    width: 60px;
    height: 60px;
    z-index: 10;
  }
  .swipe-box{
    height: 100%;

    .zz-img{
      width: 750px;
      border-radius: 0 0 40px 40px;
    }
  }
  .swipe-box-big{
    box-sizing: border-box;
    padding-top: 68px;
  }

  .custom-indicator {
    width: 100%;
    height: 84px;
    position: absolute;
    left: 56px;
    bottom: 212px;
    .custom-icon{
      display: inline-block;
      width: 68px;
      height: 68px;
      border: 8px solid rgba(0, 0, 0, 0);
      border-radius: 30px;
      img{
        display: block;
        width: 68px;
        height: 68px;
      }
    }
    .custom-icon-active{
      border: 8px solid #6332F8;
    }
    .custom-follow{
      display: inline-block;
      width: 118px;
      height: 68px;
      border-radius: 34px;
      background-color:#6332F8;
      border: 2px solid #6332F8;
      line-height: 68px;
      text-align: center;

      color: #fff;
      font-size: 26px;
      font-weight: bold;
      vertical-align:top;
      margin-top: 8px;
      margin-left: 8px;
      box-sizing: border-box;
    }
    .custom-follow-active{
      background-color:#fff;
      color: #CCCCD3;
      border: 2px solid #CCCCD3;
    }
  }

  // 用户面板信息
  .custom-card{
    flex:1;
    height:0;
    position: relative;
    border-radius: 0 0 40px 40px;
  }

  .user-pannel{
    position: absolute;
    bottom: -98px;
    // bottom: -82px;
    left: 50%;
    transform: translateX(-50%);
    width: 622px;
    height: 286px;
    border-radius: 40px;
    padding: 55px 56px 52px;
    box-sizing: border-box;
    background-color: #fff;
    font-weight: bold;
    box-shadow: 0px 20px 50px 0px rgba(1, 31, 69, 0.1);
    .user-info{
      display: flex;
      justify-content: flex-start;
    }
    .user-txt{
      word-break: break-word;
      word-wrap:break-word;
    }
    .online{
      color: #20C997;
    }
    .user-nickname{
      font-size: 32px;
      margin-bottom: 40px;
      height: 40px;
      line-height: 40px;
      margin-right: 12px;
    }
    .user-status-on, .user-status-off{
      display: inline-block;
      width: 120px;
      height: 40px;
      line-height: 42px;
      border-radius: 20px;
      background: #F1F3F8;
      font-size: 24px;
      color: #828F9F;
      font-weight: bold;
      padding-left: 34px;
      box-sizing: border-box;
      position: relative;
      &:after {
        content: ' ';
        position: absolute;
        left: 15px;
        top: 15px;
        width: 10px;
        height: 10px;
        background-color: #C7D1DA;
        border-radius: 50%;
      }
    }
    .user-status-on{
      background: #E3FFF6;
      color: #20C997;
      &:after {
        background-color: #20C997;
      }
    }
    .user-status-off{
      width: 152px;
    }
    p{
      font-size: 34px;
    }
  }

  .bubble-right{
    position: absolute;
    right: 56px;
    bottom: 320px;
    width: 286px;
    height: 120px;
    background: #A1F2F9;
    border-radius: 20px;
    font-size: 26px;
    font-weight: bold;
    padding: 22px 32px;
    box-sizing: border-box;
    &:after {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -14px;
      width: 0px;
      height: 0px;
      border-top: 16px solid transparent;
      border-bottom: 16px solid transparent;
      border-left: 16px solid #A1F2F9;
    }
  }

  .handle-pannel{
    flex-basis: 334px;
    position: relative;
    .bubble-box-edit{
      width: auto;
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
    }
    .bubble-box-like{
      right: 47px;
      transform: translate(0);
    }
    .bubble-bottom{
      width: auto;
      white-space: nowrap;
      height: 72px;
      background: #A1F2F9;
      border-radius: 20px;
      font-size: 26px;
      font-weight: bold;
      line-height: 72px;
      padding: 0 32px;
      box-sizing: border-box;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -13px;
        transform: translate(-50%);
        width:0;
        height:0;
        border-top: 16px solid #A1F2F9;
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
      }
    }

    .btn-single{
      margin-top: 174px;
      .btn-edit{
        display: block;
        margin: 0 auto;
        width: 678px;
        height: 110px;
        background: #6332F8;
        border-radius: 60px;
        color: #fff;
        font-size: 30px;
        font-weight: bold;
      }
    }
    .btn-group{
      width: 430px;
      height: 128px;
      display: flex;
      justify-content: space-between;
      margin: 156px auto 0;
      .btn-next, .btn-like{
        width: 128px;
        height: 128px;
      }
      .btn-next{
        background: url('../assets/pic/home/like_120@3x.png') no-repeat center center;
        background-size: 128px 128px;
      }
      .btn-like{
        background: url('../assets/pic/home/liked_120@3x.png') no-repeat center center;
        background-size: 128px 128px;
      }
    }
  }
}

.mainCard-big{
  .custom-indicator{
    bottom: 130px;
  }
  .custom-card{
    padding-top: calc(200px - 68px);
    box-sizing: border-box;
  }
  .user-pannel{
    bottom: -168px;
  }
  .btn-single{
    margin-top: 244px!important;
  }
  .handle-pannel{
    flex-basis: 424px;
    .bubble-box-edit{
      top: 140px;
    }
    .btn-group{
      width: 430px;
      height: 128px;
      display: flex;
      justify-content: space-between;
      margin: 226px auto 0!important;
      .btn-next, .btn-like{
        width: 128px;
        height: 128px;
      }
      .btn-next{
        background: url('../assets/pic/home/like_120@3x.png') no-repeat center center;
        background-size: 128px 128px;
      }
      .btn-like{
        background: url('../assets/pic/home/liked_120@3x.png') no-repeat center center;
        background-size: 128px 128px;
      }
    }
  }
}
.usrBorderRadius{
  border-radius: 40px!important;
}
</style>


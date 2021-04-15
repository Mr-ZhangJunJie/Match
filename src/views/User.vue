<template>
  <div class="user">

    <!-- 0. 提示对话框 -->
    <ConfirmDialog v-show="showConfirm" :txtVal="'登录后才可聊天哦~'" @confirmHand="handleConfirm" />

    <!-- 1. 导航 -->
    <Navigation :bgColor="bgColor" :fontColor="'#000'" :navBack="true" :navClose="false" :showUsr="false" :showBtn="false" :showEdit="false" :showEdit2="true" :showRule="false" :navContent="''" :textAlign="''" />

    <!-- 2. 个人信息卡片 -->
    <div class="user-card">
      <img class="user-img" :src="(isSupportWebp && usrCenter.boothIdWebp)?usrCenter.boothIdWebp:usrCenter.myUrl" />
      <div class="user-pannel">
        <h3>{{usrObj.nickName}}<span class="user-fansNum">粉丝 {{usrObj.fansNum}}</span></h3>
        <p class="user-likeNum">{{usrCenter.likeNum}}</p>
      </div>
    </div>

    <!-- 3. tab -->
    <div class="tabBox">
      <van-tabs
        @click="changeTab"
        @change="changeTab"
        class="tab"
        swipeable
        :offset-top="offsetTop"
        :line-width="lineWidth"
        line-height="2"
        title-inactive-color="#828F9F"
        title-active-color="#6332F8"
        color="#5C46FF"
        v-model="active"
        animate
      >
        <!-- :immediate-check="false" -->
        <van-tab title="互相喜欢">
          <van-list
          class="padBottomBig"
          v-model="loading1"
          :finished="finished1"
          finished-text=""
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad1"
          :offset="160"
          v-if="likeEachOther.length>0"
        >
          <van-cell v-for="(item, index) in likeEachOther" :ref="`vanCell${index}`" :key="index">
            <div class="elemItem">
              <div class="avatar" v-if="usrObj.userId === item.userId">
                <img v-if="item.profilePic" :src="item.profilePic" />
                <img class="red-dot" v-show="item.isRed === 2" src="../assets/pic/home/redDot_30@3x.png" />
              </div>
              <div class="avatar" v-if="usrObj.userId !== item.userId" @click="viewOther(item)">
                <img v-if="item.profilePic" :src="item.profilePic" />
                <img class="red-dot" v-show="item.isRed === 2" src="../assets/pic/home/redDot_30@3x.png" />
              </div>
              <div class="elemGroup" v-if="usrObj.userId === item.userId">
                <span class="elemName">{{item.nickName}}</span>
                <span class="fansNum">粉丝 {{item.fansNum}}</span>
              </div>
              <div class="elemGroup" v-if="usrObj.userId !== item.userId" @click="viewOther(item)">
                <span class="elemName">{{item.nickName}}</span>
                <span class="fansNum">粉丝 {{item.fansNum}}</span>
              </div>
              <div v-if="item.userId !== usrObj.userId" class="followBtn" :class="{fActive: item.isFollow === 1}" @click="handleFollow(item, 1)">{{item.isFollow == 2 ? '关注' : '已关注'}}</div>
            </div>
          </van-cell>
        </van-list>
        </van-tab>

        <van-tab title="喜欢你的">
          <van-list
            class="padBottomBig"
            v-model="loading2"
            :finished="finished2"
            finished-text=""
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad2"
            :offset="160"
            v-if="likeYou.length>0"
          >
            <van-cell v-for="(item, index) in likeYou" :ref="`vanCell${index}`" :key="index">
              <div class="elemItem">
                <div class="avatar" v-if="usrObj.userId === item.userId">
                <img v-if="item.profilePic" :src="item.profilePic" />
                <img class="red-dot" v-show="item.isRed === 2" src="../assets/pic/home/redDot_30@3x.png" />
              </div>
              <div class="avatar" v-if="usrObj.userId !== item.userId" @click="viewOther(item)">
                <img v-if="item.profilePic" :src="item.profilePic" />
                <img class="red-dot" v-show="item.isRed === 2" src="../assets/pic/home/redDot_30@3x.png" />
              </div>
              <div class="elemGroup" v-if="usrObj.userId === item.userId">
                <span class="elemName">{{item.nickName}}</span>
                <span class="fansNum">粉丝 {{item.fansNum}}</span>
              </div>
              <div class="elemGroup" v-if="usrObj.userId !== item.userId" @click="viewOther(item)">
                <span class="elemName">{{item.nickName}}</span>
                <span class="fansNum">粉丝 {{item.fansNum}}</span>
              </div>
                <div v-if="item.userId !== usrObj.userId" class="followBtn" :class="{fActive: item.isFollow === 1}" @click="handleFollow(item, 2)">{{item.isFollow == 2 ? '关注' : '已关注'}}</div>
              </div>
            </van-cell>
          </van-list>
        </van-tab>

        <van-tab title="你喜欢的">
          <van-list
            class="padBottomBig"
            v-model="loading3"
            :finished="finished3"
            finished-text=""
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad3"
            :offset="160"
            v-if="youLike.length>0"
          >
            <van-cell v-for="(item, index) in youLike" :ref="`vanCell${index}`" :key="index">
              <div class="elemItem">
                <div class="avatar" v-if="usrObj.userId === item.userId">
                  <img v-if="item.profilePic" :src="item.profilePic" />
                  <img class="red-dot" v-show="item.isRed === 2" src="../assets/pic/home/redDot_30@3x.png" />
                </div>
                <div class="avatar" v-if="usrObj.userId !== item.userId" @click="viewOther(item)">
                  <img v-if="item.profilePic" :src="item.profilePic" />
                  <img class="red-dot" v-show="item.isRed === 2" src="../assets/pic/home/redDot_30@3x.png" />
                </div>
                <div class="elemGroup" v-if="usrObj.userId === item.userId">
                  <span class="elemName">{{item.nickName}}</span>
                  <span class="fansNum">粉丝 {{item.fansNum}}</span>
                </div>
                <div class="elemGroup" v-if="usrObj.userId !== item.userId" @click="viewOther(item)">
                  <span class="elemName">{{item.nickName}}</span>
                  <span class="fansNum">粉丝 {{item.fansNum}}</span>
                </div>
                <div v-if="item.userId !== usrObj.userId" class="followBtn" :class="{fActive: item.isFollow === 1}" @click="handleFollow(item, 3)">{{item.isFollow == 2 ? '关注' : '已关注'}}</div>
              </div>
            </van-cell>
          </van-list>
        </van-tab>

      </van-tabs>
    </div>

    <!-- 4. 他人信息 -->
    <div class="other-mask" v-show="showCardFlag">
      <div class="other-white">
        <div class="other-card" id="cardId">
          <div class="main-box" v-if="showCardFlag">
            <MainCard :pageType="'user'" :singleUserData="userData" :tipObj="tipObj" @notifyHideCard="hideMainCard" />
          </div>
          <div class="match-talk">
            <input class="match-input" type="text" ref="inputId" v-model.trim="inputTxt" placeholder="一起聊聊感兴趣的话题吧"/>
            <span class="match-msg" @click="commitInput">
              <img src="../assets/pic/home/sendon@3x.png" />
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import appApi from '@/api/api'
import { mapActions, mapGetters } from "vuex"

import Navigation from "@/components/Navigation"
import Toast from "@/components/Toast"
import MainCard from "@/components/MainCard"
import ConfirmDialog from "@/components/ConfirmDialog"

function blurFun() {
  setTimeout(function() {
    window.scrollTo(0, 0);
  }, 0);
}

export default {
  name: 'User',
  components: {
    Navigation,
    MainCard,
    ConfirmDialog
  },
  data() {
    return {
      bgColor: '',
      platform: null, // 判断手机系统
      offsetTop: 0, // 导航和tab固定在顶端，内容区距离顶部距离
      lineWidth: 125,
      active: 0,
      loading1: false,
      finished1: false,
      loading2: false,
      finished2: false,
      loading3: false,
      finished3: false,
      error: false,

      likeEachOther: [], // 互相喜欢
      likeYou: [], // 喜欢你的
      youLike: [], // 你喜欢的

      isUsr: false,

      showCardFlag: false,
      inputTxt: '',

      usrCenter: {
        likeNum: 0,
        myUrl: ''
      },

      userData: {},
      tipObj: {
        editFlag: false,
        slideFlag: false,
        likeFlag: false,
        editTip: "编辑配对资料, 才能认识更多朋友哦!",
        slideTip: "试试向侧面滑动 了解Ta的兴趣爱好!",
        likeTip: "喜欢就点, 来交个朋友吧~"
      },

      msgFlag: true,
      likeType: 1,
      current: 1,
      size: 100,

      tab1First: true,
      tab2First: true,
      showConfirm: false,
    }
  },
  computed: {
    ...mapGetters(["usrObj", "myApp","isSupportWebp"])
  },
  created() {
    this.getLikeNums()
    this.handleLike1()
    this.platForm = this.checkPlatForm()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.$nextTick(()=>{
       let inputId = this.$refs.inputId;
       inputId.addEventListener('blur',blurFun);
    })
  },
  methods: {
    ...mapActions(["SetToast", "SetLoading"]),
    // 收到的喜欢数
    getLikeNums() {
      appApi.getBeLikeNum({token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            this.usrCenter.likeNum = res.result.beLikedNum;
            this.usrCenter.myUrl = res.result.boothId;
            this.usrCenter.boothIdWebp = res.result.boothIdWebp;

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

    // 监听导航滚动的位置
    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 112) {
        this.bgColor = '#fff'
      } else {
        this.bgColor = ''
      }
    },

    // 点击tab
    changeTab(name, title) {
      this.loading1 = false
      this.finished1 = true
      this.loading2 = false
      this.finished2 = true
      this.loading3 = false
      this.finished3 = true

      this.current = 1
      this.likeType = name + 1
      if (name === 0) {
        this.loading1 = false
        this.finished1 = false
      } else if (name === 1) {
        this.loading2 = false
        this.finished2 = false
        if (this.tab1First) {
          this.tab1First = false
          this.handleLike2()
        }
      } else if (name == 2) {
        this.loading3 = false
        this.finished3 = false
         if (this.tab2First) {
          this.tab2First = false
          this.handleLike3()
        }
      }
    },

    // tab - 1相互喜欢，2喜欢你的，3你喜欢的
    handleLike1() {
      _html({e: 'match.status.view', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "tab": "mudual" }})

      appApi.getLikeList({type: 1, current: this.current, size: this.size, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            this.loading1 = false
            if (res.result.records.length < this.size) {
              this.finished1 = true
            }
            if (this.current == 2) {
              this.likeEachOther = []
            }
            this.likeEachOther.push(...res.result.records)

            if (res.result.records.length === 0) {
              this.finished1 = true
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
    // tab - 1相互喜欢，2喜欢你的，3你喜欢的
    handleLike2() {
      _html({e: 'match.status.view', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "tab": "like" }})

      appApi.getLikeList({type: 2, current: this.current, size: this.size, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            this.loading2 = false
            if (res.result.records.length < this.size) {
               this.finished2 = true
            }
            if (this.current == 2) {
              this.likeYou = []
            }

            this.likeYou.push(...res.result.records)
            console.log('this.likeYou', this.likeYou)

            if (res.result.records.length === 0) {
              this.finished2 = true
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
    // tab - 1相互喜欢，2喜欢你的，3你喜欢的
    handleLike3() {
      _html({e: 'match.status.view', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "tab": "liking" }})

      appApi.getLikeList({type: 3, current: this.current, size: this.size, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            this.loading3 = false
            if (res.result.records.length < this.size) {
               this.finished3 = true
            }
            if (this.current == 2) {
              this.youLike = []
            }
            this.youLike.push(...res.result.records)
            console.log('this.youLike', this.youLike)

            if (res.result.records.length === 0) {
              this.finished3 = true
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

    // 刷新时间
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

    // 关注
    handleFollow(item, like_type) {
      console.log('like_type::', like_type)
      if (item.isFollow === 1) return; // 已经关注了
      let params = {
        authToken: this.usrObj.authToken,
        userId: item.userId,
        duid: "-",
        ua: "zepeto.service.zzz.crew/1.0.0"
      };

      if (like_type === 1) {
        _html({e: 'match.follow', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "place": "mudual" }})
      } else if (like_type === 2) {
        _html({e: 'match.follow', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "place": "liked" }})
      } else if (like_type === 3) {
        _html({e: 'match.follow', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "place": "liking" }})
      }

      appApi.setFollow(params)
        .then(res => {
          if (res && res.code === 200) {
            if (res.result === '{"isSuccess":true}') {
              return item.isFollow = 1
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

    // 滑动加载更多
    onLoad1() {
      setTimeout(() => {
        this.handleLike1()
        this.current++
        this.loading1 = true
      }, 400)

    },
    // 滑动加载更多
    onLoad2() {
      setTimeout(() => {
        this.handleLike2()
        this.current++
        this.loading2 = true
      }, 400)
    },
    // 滑动加载更多
    onLoad3() {
      setTimeout(() => {
        this.handleLike3()
        this.current++
        this.loading3 = true
      }, 400)
    },

    // 访问用户详情卡片
    viewOther(item) {
      _html({e: 'match.user.profile', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
      this.fixedBody()
      this.userData = item
      this.showCardFlag = true
      this.refreshTime(4)
    },

    // 关闭用户详情卡片
    hideMainCard() {
      this.looseBody()
      this.inputTxt = ""
      this.showCardFlag = false
    },

    // 提示登录弹窗
    handleConfirm(data) {
      this.showConfirm = !this.showConfirm
      if (data) {
        window.location.href = 'ZEPETO://WEBVIEW/CLOSE';
        let timer = setTimeout(() => {
          window.location.href = 'ZEPETO-CN://HOME/LOGIN'
          clearTimeout(timer);
        }, 50)
      }
    },

    // 发送消息
    commitInput() {
      // 先调易顿检验用户输入是否合法
      if (this.usrObj.IsLoggedIn) {
        this.checkUserInput()
      } else {
        this.showConfirm = true

      }
    },

    // 检验用户的输入
    checkUserInput() {
      if (this.inputTxt === "") {
        this.inputTxt = "一起聊聊感兴趣的话题吧"
      }
      appApi.checkUserInfo({content: this.inputTxt, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code == 200) {
            if (res.result) {
              this.postMsg()
            } else {
              this.SetToast({status: 1, msg: '配对资料违规，请编辑后重试'})
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

    // 发送聊天信息
    postMsg() {

      if (this.targetId == '') return this.SetToast({status: 1, msg: '崽崽代码不存在'})
      if (this.targetUserId == '') return this.SetToast({status: 1, msg: '用户id不存在'})

      if (this.msgFlag) {
        this.msgFlag = false
        _html({e: 'match.send.message', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "place": "user_profile" }})

        appApi.getMatchMsg({zzId: this.userData.zzId, userId: this.userData.userId, token: this.$store.state.app.myApp.token, msg: this.inputTxt})
        .then(res => {
          if (res && res.code === 200) {
            this.inputTxt = ""
            this.hideMainCard()
            window.location.href = `zepeto-cn://home/chat/dm/${this.userData.userId}`

            let timer = setTimeout(() => {
              this.msgFlag = true
              clearTimeout(timer)
            }, 2000)
          } else {
            this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
            this.SetLoading({flag: 0, text: '', bg: 'transparent'})
          }
        })
        .catch(err => {
          this.SetToast({status: 1, msg: err})
          this.SetLoading({flag: 0, text: '', bg: 'transparent'})
          let timer = setTimeout(() => {
            this.msgFlag = true
            clearTimeout(timer)
          }, 2000)
        });
      }
    },

    checkPlatForm() {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //Ios
        return 'iOS'
      } else if (/(Android)/i.test(navigator.userAgent)) {
        //Android终端
        return 'Android'
      }
    },
    // 打开弹窗，滑动页面，滚动不穿透
    fixedBody () {
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
    },
    // 关闭弹窗，释放body锁定
    looseBody() {
      let body = document.body
      body.style.position = ''
      let top = body.style.top
      document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
      body.style.top = ''
    },

  }
}
</script>

<style lang="scss" scoped>
.user{
  height: 100%;
}
.user-card{
  width: 100%;
  height: 512px;
  background-color: #828F9F;
  border-radius: 0 0 40px 40px;
  position: relative;
  .user-img{
    display: block;
    height: 512px;
    width: auto;
    margin: auto;
  }
  .user-pannel{
    position: absolute;
    top: 432px;
    left: 50%;
    transform: translateX(-50%);
    width: 622px;
    height: 212px;
    border-radius: 40px;
    background-color: #fff;
    box-shadow: 0px 20px 50px 0px rgba(1, 31, 69, 0.1);
    padding: 48px 0 46px 56px;
    box-sizing: border-box;
    z-index: 9;
    h3{
      height: 48px;
      line-height: 48px;
      font-size: 44px;
      margin-bottom: 32px;
      font-weight: bold;
    }
  }
  .user-fansNum{
    font-size: 26px;
    color: #828F9F;
    margin-left: 16px;
    margin-bottom: 26px;
    font-weight: normal;
  }
  .user-likeNum{
    height: 42px;
    line-height: 42px;
    font-weight: bold;
    font-size: 40px;
    color: #FF1A6A;
    background: url('../assets/pic/user/like_120@3x.png') no-repeat left center;
    background-size: 40px 40px;
    padding-left: 56px;
    box-sizing: border-box;
  }
}



.padBottomBig{
  padding-bottom: 0;
}

.elemItem{
  width: 100%;
  height: 160px;
  padding: 20px 36px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
}
.avatar{
  width: 120px;
  height: 120px;
  border-radius: 40px;
  margin-right: 36px;
  position: relative;
  img{
    width: inherit;
    height: inherit;
    border-radius: 40px;
  }
  .red-dot{
    width: 36px;
    height: 36px;
    position: absolute;
    top: -6px;
    right: -6px;
  }
}

.elemGroup{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 340px;
  padding: 24px 0 22px;
  box-sizing: border-box;
  .elemName{
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    font-size: 30px;
    margin-bottom: 14px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .fansNum{
    height: 28px;
    line-height: 28px;
    font-size: 26px;
    color: #828F9F;
  }
}

.followBtn, .fActive{
  width: 146px;
  height: 72px;
  border-radius: 36px;
  box-sizing: border-box;
  font-size: 26px;
  text-align: center;
  line-height: 72px;
  display: inline-block;
  margin: auto;
  margin-right: 0;
  font-weight: bold;
}
.followBtn{
  background: #5C46FF;
  border: 2px solid #5C46FF;
  color: #fff;
}
.fActive{
  background: #fff;
  border: 2px solid #CCCCD3;
  color: #CCCCD3;
}

.other-mask{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 19;
}
.other-white{
  background: #fff;
  margin-top: calc(100% - 88px);
  height: 100%;
}
.other-card{
  width: 100%;
  height: 1246px;
  background: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 40px 40px 0 0;
  .main-box{
    height: 1000px;
  }
}
.match-talk{
  width: 100%;
  height: 144px;
  padding: 28px 36px;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: start;
  .match-input{
    display: block;
    border: none;
    outline: none;
    width: calc(100% - 124px);
    height: 34px;
    padding: 27px 10px 27px 30px;
    border-radius: 44px;
    font-size: 30px;
    background: #F1F3F8;
    font-weight: bold;
  }
  .match-msg{
    display: block;
    width: 88px;
    height: 84px;
    img{
      display: block;
      width: 48px;
      height: 48px;
      margin-top: 20px;
      margin-left: 36px;
    }
  }
}

.big-screen{
  .user-card{
    height: 580px;
    padding-top: 68px;
    box-sizing: border-box;
    .user-pannel{
      top: 500px;
    }
  }
  .other-white{
    margin-top: calc(100% - 322px);
    height: 100%;
  }
  .other-card{
    width: 100%;
    height: 1302px;
  }
  .match-talk{
    height: 200px!important;
  }
  .padBottomBig{
    padding-bottom: 60px;
  }
}

input::-webkit-input-placeholder {
  color: #C7D1DA;
}

</style>

<style>
  /*列表信息*/
  .tabBox {
    min-height: 500px;
    margin-top: 172px;
    padding-bottom: 80px;
    box-sizing: border-box;
  }
  .tabBox .van-list__finished-text{
    height: 80px;
    line-height: 80px;
  }
  .van-tabs--line .van-tabs__wrap {
    height: 88px;
  }
  .van-tab {
    height: 88px;
    line-height: 88px;
  }
  .van-tab__text {
    font-size: 30px;
  }
  .van-tab--active {
    font-size: 30px;
    font-weight: bold;
  }
  .van-list__finished-text{
    font-size: 26px;
  }
  .van-loading__text{
    font-size: 26px!important;
  }
</style>

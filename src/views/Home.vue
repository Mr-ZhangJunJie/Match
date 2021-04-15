<template>
  <div class="home">
    <!-- 0. 提示对话框 -->
    <ConfirmDialog v-show="showConfirm" :txtVal="'登录后才可聊天哦~'" @confirmHand="handleConfirm" />

    <!-- 1. 导航 -->
    <Navigation :bgColor="''" :bgImg="require('../assets/img/navImg/h5_title@3x.png')" :fontColor="'#fff'" :navBack="false" :navClose="true" :showUsr="showUsr" :showRedDot="userInfoFlag.isRed" :showRule="false" :showBtn="false" :navContent="''" :textAlign="'left'" @notifyUserCenter="handleUserCenter" />

    <!-- 等到拿到token的时候在渲染卡片 -->
    <MainCard ref="mainCard" v-if="showCardFlag && token" :pageType="'home'" :tipObj="tipObj" :hadEdit="userInfoFlag.edited" @notifyHideCard="hideMainCard" @notifyMarkLike="markLike" />

    <div class="blankPage" v-if="!showCardFlag">
      <p class="blankTitle">被看完了</p>
      <p class="blankSub">暂时没有合适匹配的崽了, 晚点再来</p>
      <button class="blankBtn" @click="getMainCardData">刷新</button>
    </div>

    <div class="animation-like" v-show="likeAnimation">
      <img class="my-animate animate__animated animate__heartBeat" src="../assets/pic/home/like_motion@3x.png" alt="">
    </div>

    <div class="match-box0" v-show="likeEachOther"></div>
    <div class="match-box animate__animated" :class="[{'animate__fadeInUpBig': likeEachOther}, {'animate__fadeOutDown': animSlideDown}]" v-show="likeEachOther">
      <div class="match-white">
        <div class="match-cont" id="matchId">
          <div class="match-pannel">
            <div class="match-photo">
              <img class="match-img" v-lazy="`${groupPic}${isSupportWebp?'?x-oss-process=image/format,webp':''}`" />
            </div>
            <span class="match-close" @click="handleCloseMatchBox"></span>
            <div class="match-title"></div>
            <div class="match-user">
              <p class="nickname">{{beLikeNickname}}</p>
              <p class="desc">对你也有好感!</p>
              <p class="info">合拍照片已经保存到你的相册啦</p>
            </div>
          </div>
          <div class="match-talk">
            <!--@blur="fnBlur" @focus="fnFocus"-->
            <input class="match-input" ref="inputId" type="text" v-model.trim="inputTxt" :placeholder="placeholderMsg"  />
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
import {mapActions,mapGetters} from 'vuex'
import Navigation from "@/components/Navigation"
import MainCard from "@/components/MainCard"
import ConfirmDialog from "@/components/ConfirmDialog"

import { setTimeout, setInterval, clearTimeout, clearInterval } from "timers"

function blurFun() {
  setTimeout(function() {
    window.scrollTo(0, 0);
  }, 0);
}

export default {
  name: 'Home',
  components: {
    Navigation,
    MainCard,
    ConfirmDialog
  },
  data() {
    return {
      show: false, // 接口拿到数据在显示页面

      images: [],
      indicators: [],
      current: 0,
      inputTxt: "",

      userInfoFlag: {
        edited: false,
        isRed: false
      },

      showCardFlag: true, // 推荐卡片列表

      canClickEditBtn: false,

      tipObj: {
        editFlag: false,
        slideFlag: false,
        likeFlag: false,
        editTip: "编辑配对资料, 才能认识更多朋友哦!",
        slideTip: "试试向侧面滑动 了解Ta的兴趣爱好!",
        likeTip: "喜欢就点, 来交个朋友吧~"
      },
      likeEachOther: false,
      targetId: '', // 被我喜欢的zzId
      likeAnimation: false, // 点击喜欢的时候，展示动画
      groupBoothId: '',
      groupPic: '',
      platform: null, // 判断手机系统
      beLikeNickname: '',

      animSlideDown: false,

      msgFlag: true,

      token: '',

      placeholderMsg: "",
      noDataFlag: false, // 默认不显示
      showConfirm: false, // 默认不显示
      showUsr: false, // 调完登录接口在赋值，该按钮跳转的页面依赖于接口返回情况
    };
  },
  created() {

    this.platForm = this.checkPlatForm()

    let timer = setInterval(() => {
      if (window.ZEPETO) {
        //站内
        console.log('window.ZEPETO:', window.ZEPETO)
        this.Check_App_Info();
        this.Check_Usr_Info();
        this.postUserInfo(this.usrObj);

        clearInterval(timer);
      }
    }, 250);

    if (process.env.NODE_ENV === "development") {
      let timer = setTimeout(() => {
        //站外
        this.Check_App_Info();
        this.Check_Usr_Info();
        this.postUserInfo(this.usrObj);

        clearInterval(timer);
      }, 1500);
    }
  },
  mounted() {
    localStorage.setItem('$pageName', 'Home')
    this.SetLoading({flag: 1, text: '', bg: 'transparent'})

    // this.$nextTick(()=>{
    //   let inputId = this.$refs.inputId;
    //   inputId.addEventListener('blur',blurFun);
    // })
  },
  computed: {
    ...mapGetters(["myApp", "usrObj","isSupportWebp"]),
  },
  watch: {
    likeEachOther: {
      handler(newVal) {
        console.log(newVal);
        if (newVal) {
          _html({e: 'match.status.success', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
          this.renderGroupPic()
        }
      },
      // deep: true
    }
  },
  methods: {
    ...mapActions(["Check_App_Info", "Check_Usr_Info", "SetLoading", "SetToast"]),
    // 用户信息上报接口
    postUserInfo(usrObj) {
      appApi.postUsrInfo(usrObj)
        .then(res => {
          if (res && res.code === 200) {
            this.token = res.result
            this.$store.state.app.myApp.token = res.result
            sessionStorage.setItem("$token",res.result)
            this.getUserInfoFlag()
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

    // 获取是否编辑过资料及小红点
    getUserInfoFlag() {
      appApi.getUserLogin({token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            // edited=1 表示没编辑过资料；isRed=1 表示没有小红点。
            // edited=2 表示编辑过资料；  isRed=2 表示有小红点。
            this.userInfoFlag.edited = res.result.edited == 2 ? true : false
            this.userInfoFlag.isRed = res.result.isRed == 2 ? true : false
            this.canClickEditBtn = true;
            if (localStorage.getItem('$hasViewPage')) {
              let obj = JSON.parse(localStorage.getItem('$hasViewPage'));
              if (res.result.edited === 1) {
                this.tipObj.slideFlag = obj.slideFlag
                this.tipObj.editFlag = obj.editFlag
              } else {
                this.tipObj.slideFlag = obj.slideFlag
                this.tipObj.likeFlag = obj.likeFlag
              }
            } else {
              if (res.result.edited === 1) {
                this.tipObj.slideFlag = true
                this.tipObj.editFlag = true
              } else {
                this.tipObj.slideFlag = true
                this.tipObj.likeFlag = true
              }
              localStorage.setItem('$hasViewPage', JSON.stringify(this.tipObj))
            }
            this.showUsr = true;

            this.SetLoading({flag: 0, text: '', bg: 'transparent'})
          } else {
            this.showUsr = true
            this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
            this.SetLoading({flag: 0, text: '', bg: 'transparent'})
          }
        })
        .catch(err => {
          this.showUsr = true
          this.SetToast({status: 1, msg: err})
          this.SetLoading({flag: 0, text: '', bg: 'transparent'})
        });
    },

    // 刷新在线时间
    refreshTime(source) {
      appApi.getRefresh({source: source, token: this.$store.state.app.myApp.token})
        .then(res => {
          if (res && res.code === 200) {
            // code=200，不用处理
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

    // 点击编辑按钮
    handleUserCenter() {
      if (this.canClickEditBtn) {
        this.refreshTime(3)
        let timer = setTimeout(() => {
          // 编辑过资料的，跳个人中心要带上 编辑过true 标记，方便共用的组件渲染数据
          this.tipObj.slideFlag = false
          this.tipObj.editFlag = false
          this.tipObj.likeFlag = false
          localStorage.setItem('$hasViewPage', JSON.stringify(this.tipObj))
          if (this.userInfoFlag.edited) {
            this.$router.push({path: '/user'})
          } else {
            this.$router.push({path: '/edit', query: {edited: this.userInfoFlag.edited}})
          }
          clearTimeout(timer)
        }, 50)
      } else {
        this.$router.push({path: '/edit', query: {edited: false}})
      }
    },

    // 监听change事件
    onChange(index) {
      this.current = index;
      console.log('当前 Swipe 索引：' + index)
    },

    hideMainCard(data) {
      this.inputTxt = ""
      this.showCardFlag = data;
    },

    markLike(flag, targetId, targetUserId, nickname, labelName) {
      if (!flag) {
        this.likeAnimation = true
        let timer = setTimeout(() => {
          this.likeAnimation = false
          clearTimeout(timer)
        }, 1200)
      } else {
        this.SetLoading({flag:1, text:'', bg:'transparent'})
        this.groupBoothId = this.randomBoothId();
        this.likeEachOther = flag
        this.targetId = targetId
        this.targetUserId = targetUserId
        this.beLikeNickname = nickname
        if (labelName == "" || labelName == undefined) {
          this.placeholderMsg = "一起聊聊感兴趣的话题吧"
        } else {
          this.placeholderMsg = labelName
        }
      }
    },

    getMainCardData() {
      if (navigator.onLine) {
        _html({e: 'match.refresh', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId }})
        this.showCardFlag = true
      } else {
        this.SetToast({status: 1, msg: '请检查网络设置'})
      }
    },

    handleCloseMatchBox() {
      this.inputTxt = ""
      this.likeEachOther = false
      this.animSlideDown = true
      if (this.$refs.mainCard) {
        this.$refs.mainCard.showNextImg(200)
      }
      let timer = setTimeout(() => {
        this.animSlideDown = false
        clearTimeout(timer)
      }, 380)
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
    // fnBlur() {
    //   if (this.platForm === 'Android') { // 安卓弹出键盘时不能向上推页面，iOS可以自动推起
    //     let timer = setTimeout(function(){
    //       document.getElementById('matchId').style.bottom = 0
    //       clearTimeout(timer)
    //     }, 100);
    //   }
    // },
    // fnFocus() {
    //   this.showPannel = false
    //   if (this.platForm === 'Android') { // 安卓弹出键盘时不能向上推页面，iOS可以自动推起
    //     let timer = setTimeout(function(){
    //       if(document.body.clientHeight < 630) {
    //         document.getElementById('matchId').style.bottom = '55%'
    //       } else {
    //         document.getElementById('matchId').style.bottom = '45%'
    //       }
    //       clearTimeout(timer)
    //     }, 100);
    //   }
    // },

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
        console.log('nihao')
      if (this.usrObj.IsLoggedIn) {
        console.log('this.usrObj.IsLoggedIn',this.usrObj.IsLoggedIn)
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
          if (res.code == 200) {
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

      if (this.targetId == '') return this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
      if (this.targetUserId == '') return this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
      if (this.inputTxt == "") {
        this.inputTxt = "一起聊聊感兴趣的话题吧"
      }

      if (this.msgFlag) {
        this.msgFlag = false
        _html({e: 'match.send.message', duid: this.myApp.duid, args: { "userid": this.myApp.userId, "hashcode": this.myApp.zzId, "place": "match_success" }})

        appApi.getMatchMsg({zzId: this.targetId, userId: this.targetUserId, token: this.$store.state.app.myApp.token, msg: this.inputTxt})
          .then(res => {
            if (res && res.code === 200) {
              this.inputTxt = ""
              this.handleCloseMatchBox()

              window.location.href = `zepeto-cn://home/chat/dm/${this.targetUserId}`

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

    // 渲染合拍照
    renderGroupPic() {
        let params = {
            data: {
                target: {
                    hashCodes: [
                        this.usrObj.zzId,
                        this.targetId
                    ]
                },
                width: 750,
                override: {
                    metadatas: [
                        {
                            Properties: [],
                            BlendShapes: [],
                            Deformations: [
                                {
                                    name: "CLEAR",
                                },
                            ],
                        },
                    ],
                },
            },
            boothId: this.groupBoothId,
        };

      appApi.renderSingleImage(params)
        .then(res => {

          this.groupPic = res.url
          this.getImageBase64(res.url)
        })
        .catch(err => {
          this.SetToast({status: 1, msg: err})
          this.SetLoading({flag: 0, text: '', bg: 'transparent'})
        });
    },
    preloadImage(uri) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = uri
        img.onload = function () {
          uri = null;
          resolve(this)
        }
        img.onerror = function () {
          uri = null;
          reject(new Error('img url not exist', uri))
        }
      })
    },
    async getImageBase64(url) {
      let img = await this.preloadImage(await getBlobUrl(url));
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let dataURL = canvas.toDataURL("image/png");
      const toFeed = () => {
        this.SetLoading({flag:0, text:'', bg:'transparent'})
      }

      this.saveToAlbum(dataURL, toFeed)

      if (this.platform == null) {
        this.SetLoading({flag:0, text:'', bg:'transparent'})
      }

      canvas = null; //释放
      return dataURL;
    },

    // 将base64图保存到相册
    saveToAlbum(base64, callback) {
      let newBase64 = base64.substring(base64.indexOf(',')+1); // 去掉开头"data:image/png;base64,"
      if (window.ZEPETO) {
        window.ZEPETO.invoke('SaveImage', newBase64, callback); // callback可以是保存成功的提示
      }
    },

    randomBoothId() {
      let boothIdAry = ["PHOTOBOOTH_TWO_419", "PHOTOBOOTH_TWO_437", "PHOTOBOOTH_TWO_432", "PHOTOBOOTH_TWO_424","PHOTOBOOTH_TWO_406", "PHOTOBOOTH_TWO_399", "PHOTOBOOTH_TWO_290", "PHOTOBOOTH_TWO_318"]
      let boothId;
      let num = parseInt(Math.random()*7,10)+1;
      if (num > 7) {
        num = 2
      } else {
        return boothId = boothIdAry[num]
      }
    }

  }
};

// 转为blob解决跨域限制
function getBlobUrl(url) {
  return new Promise(function(resolve, reject) {
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(inputPath2url(this.response));
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "blob";
    client.send();
  });
}

function inputPath2url(file) {
  var url = null;
  if (window.createObjectURL != undefined) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  position: relative;
}

// 点喜欢后的效果
.animation-like{
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: 400px;
  height: 400px;
  top: 300px;
  img{
    width: 400px;
    height: 400px;
  }
}

// 匹配成功
.match-box{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 19;
}
.match-box0{
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 19;
}
.match-white{
  background: #fff;
  margin-top: calc(100% - 420px);
  height: 100%;
}
.match-cont{
  width: 750px;
  height: 1040px;
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: #6332F8;
  border-radius: 40px 40px 0px 0px;
}
.match-pannel{
  padding-top: 382px;
  box-sizing: border-box;
}
.match-photo{
  position: absolute;
  width: 512px;
  height: 392px;
  background: #ffc439;
  transform: rotate(2deg);
  top: -60px;
  left: 50%;
  margin-left: -256px;
  border: 16px solid #fff;
  box-sizing: border-box;
  box-shadow: 0px 20px 50px 0px rgba(1, 31, 69, 0.1);
  .match-img{
    display: block;
    max-width: 480px;
    max-height: 360px;
    margin: 0 auto;
  }
}
.match-close{
  display: inline-block;
  position: absolute;
  width: 60px;
  height: 60px;
  top: 24px;
  right: 30px;
  background: url("../assets/pic/home/ex@3x.png") no-repeat center center;
  background-size: 60px 60px;
}
.match-title{
  width: 100%;
  height: 180px;
  background: url('../assets/pic/home/match_big@3x.png') no-repeat center center;
  background-size: 750px 180px;
  margin-bottom: 50px;
}
.match-user{
  color: #fff;
  text-align: center;
  .nickname{
    font-size: 40px;
    line-height: 56px;
    font-weight: bold;
  }
  .desc{
    font-size: 40px;
    line-height: 56px;
    margin-bottom: 60px;
    font-weight: bold;
  }
  .info{
    font-size: 28px;
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
  background-color: #fff;
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

// 推荐的看完了
.blankPage{
  height: 100%;
  background: #F1F3F8 url('../assets/pic/home/img_attention@3x.png') no-repeat center 338px;
  background-size: 148px 148px;
  padding-top: 338px;
  box-sizing: border-box;
  text-align: center;
  .blankTitle{
    font-weight: bold;
    font-size: 36px;
    margin-top: 182px;
  }
  .blankSub{
    font-size: 28px;
    color: #686675;
    margin-top: 20px;
  }
  .blankBtn{
    width: 220px;
    height: 84px;
    border-radius: 42px;
    background: #fff;
    margin-top: 66px;
    font-size: 30px;
    font-weight: 500;
  }
}
.big-screen{
  .match-white{
    margin-top: calc(100% - 180px);
    height: 100%;
  }
  .match-cont{
    width: 750px;
    height: 1096px;
  }
  .match-talk{
    height: 200px!important;
  }
  .animation-like{
    top: 400px;
  }
  .blankPage{
    padding-top: 483px;
    background: #F1F3F8 url('../assets/pic/home/img_attention@3x.png') no-repeat center 483px;
    background-size: 148px 148px;
  }
}
.my-animate{
  opacity: 0.6;
}

input::-webkit-input-placeholder {
  color: #C7D1DA;
}
</style>

<template>
    <!--{'edit-big': isBigScreen}-->
    <div class="edit">

        <!-- 1. 导航 -->
        <Navigation :bgColor="'#fff'" :fontColor="'#000'" :navBack="true" :navClose="false" :showUsr="false"
                    :showBtn="true" :showRule="false" :isActive="isActive" :navContent="'编辑配对资料'" :textAlign="'center'"
                    @notifyComplete="commitInput"/>

        <div id="contenId">
            <!-- 2. 兴趣爱好类目 -->
            <div class="my-card">

                <div v-if="showBubble" class="bubble-box">
                    <p class="bubble-top">填写更多兴趣资料, 更容易得到喜爱哦</p>
                </div>

                <van-swipe ref="swipe" :loop="false" stop-propagation @change="onChange" class="swipe-box">

                    <van-swipe-item v-for="(item, index) in dynamicMap" :key="index">
                        <div class="zz-bg" :style="{background: item.bgColor}">
                            <img v-if="!nextImgFlag" class="zz-img"
                                 v-lazy="(isSupportWebp && item['photoBoothWebp'])?item['photoBoothWebp']:item.currImg"/>
                            <img v-else class="zz-img amy"
                                 v-lazy="`${nextImg}${isSupportWebp?'?x-oss-process=image/format,webp':''}`"/>
                        </div>
                        <span class="change-pose" @click.self="changePose">更换姿势</span>
                    </van-swipe-item>

                    <template #indicator>
                        <div class="custom-indicator">
                            <div class="custom-slide">
                                <i class="custom-icon" v-for="(item, iNum) in staticList" :key="item.id"
                                   :class="[`${'indicator'+iNum}`, {'custom-icon-active': iNum == current}]"
                                   @click="changeTab(iNum)">{{item.labelName}}</i>
                            </div>
                        </div>
                    </template>

                </van-swipe>
            </div>

            <!-- 3. 更换背景色 -->
            <ul class="change-bgColor">
                <li class="change-icon-outLine" :class="{'color-active': dynamicMap[current].colorNum === 0}"
                    @click="handlePicker('open')">
                    <div class="change-icon-middleLine">
                        <span class="change-icon icon0"></span>
                    </div>
                </li>
                <li :class="['change-icon-outLine', {'color-active': dynamicMap[current].colorNum === index + 1}]"
                    v-for="(color, index) in colorArr" :key="index" @click="selectColor(index+1, color)">
                    <div class="change-icon-middleLine">
                        <span class="change-icon" :style="{background: color}"></span>
                    </div>
                </li>
            </ul>


            <!-- 4. 用户输入文案区 -->
            <div class="costom-desc">
                <h3>
                    <span v-show="showNote" class="titleNote">描述</span>
                    <span v-show="!showNote" class="title">描述</span>
                    <span class="num">{{descNum}}/30</span>
                </h3>
                <input type="text" v-model.trim="dynamicMap[current].labelInput" maxlength="30"
                       :placeholder="dynamicMap[current].hintText" @blur="fnBlur" @focus="fnFocus"/>
                <p class="costom-tip">需编辑描述内容，才可展示该兴趣资料哦~</p>
            </div>
        </div>

        <!-- 5. 用户点开拾色器 -->
        <div class="picker-mask" v-show="!closePicker">
            <div class="picker-pannel">
                <div class="picker-handle">
                    <span class="cancle" @click="handlePicker('close')">取消</span>
                    <span class="ok" @click="handleOK">确定</span>
                </div>
                <div id="picker"></div>
            </div>
        </div>

    </div>
</template>

<script>
    import appApi from '@/api/api'
    import {mapActions, mapGetters} from 'vuex'
    import Navigation from "@/components/Navigation"
    import Toast from "@/components/Toast"
    import iro from '@jaames/iro';

    export default {
        name: "Edit",
        components: {
            Navigation,
            Toast
        },
        data() {
            return {
                platform: null, // 判断手机系统
                closePicker: true,
                beforePicker: '',

                current: 0, // 当前选项卡
                colorNum: 1, // 默认选中第二个背景色

                nextImgFlag: false,
                nextNum: 0,
                nextImg: '',
                poseFlag: true,

                showBubble: false,

                // 向用户提供的默认背景色
                colorArr: ['linear-gradient(180deg, #FCA5F1 0%, #B5FFFF 100%)', 'linear-gradient(180deg, #A9F1DF 0%, #FFBBBB 100%)', 'linear-gradient(180deg, #66FF21 0%, #F4FF1E 100%)', 'linear-gradient(180deg, #B400FF 0%, #FF35F7 100%)', 'linear-gradient(180deg, #00E5FF 0%, #0BFFD7 100%)', 'linear-gradient(180deg, #3383FC 0%, #00CCE5 100%)', 'linear-gradient(180deg, #FFD200 0%, #FFF900 100%)', 'linear-gradient(180deg, #FC6E33 0%, #E500A3 100%)', 'linear-gradient(180deg, #FF8441 0%, #E44BC9 100%)', 'linear-gradient(180deg, #29ABE2 0%, #15E66C 100%)', 'linear-gradient(180deg, #A146FF 0%, #6332F8 100%)', 'linear-gradient(180deg, #6C6C6C 0%, #B4B7C3 100%)', 'linear-gradient(180deg, #CC80FF 0%, #BBDEFF 100%)', 'linear-gradient(180deg, #1BD3D4 0%, #C4FF89 100%)', 'linear-gradient(180deg, #FFB019 0%, #C4F013 100%)', '#7BE0FF', '#FF6BC3', '#7F7FFF', '#FFF200', '#64F988', '#F9B2D4', '#BF9F84', '#DDBFA6', '#EF8993', '#FCA265', '#EBF7FC', '#FCFBF5', '#F9D4EB', '#775742', '#FC802D', '#9BF8D0', '#75714E', '#8547FF', '#FFD524', '#C4C3BF'],
                // 动态可操作的数据，用于记录用户设置渲染到页面上和传数据到服务端
                dynamicMap: {
                    0: {
                        flag: false,
                        bgColor: '',
                        hintText: '',
                        labelCode: '',
                        labelInput: '',
                        labelName: '',
                        currImg: '',
                        photoBoothWebp: '',
                        boothList:''
                    },
                    1: {
                        flag: false,
                        bgColor: '',
                        hintText: '',
                        labelCode: '',
                        labelInput: '',
                        labelName: '',
                        currImg: '',
                        photoBoothWebp: '',
                        boothList:''
                    },
                    2: {
                        flag: false,
                        bgColor: '',
                        hintText: '',
                        labelCode: '',
                        labelInput: '',
                        labelName: '',
                        currImg: '',
                        photoBoothWebp: '',
                        boothList:''
                    },
                    3: {
                        flag: false,
                        bgColor: '',
                        hintText: '',
                        labelCode: '',
                        labelInput: '',
                        labelName: '',
                        currImg: '',
                        photoBoothWebp: '',
                        boothList:''
                    },
                    4: {
                        flag: false,
                        bgColor: '',
                        hintText: '',
                        labelCode: '',
                        labelInput: '',
                        labelName: '',
                        currImg: '',
                        photoBoothWebp: '',
                        boothList:''
                    },
                    5: {
                        flag: false,
                        bgColor: '',
                        hintText: '',
                        labelCode: '',
                        labelInput: '',
                        labelName: '',
                        currImg: '',
                        photoBoothWebp: '',
                        boothList:''
                    }
                },
                staticList: [], // 接口list拿到的6个tab页面数据。页面图片需用该数据里的boothId请求拿到。
                staticImgMap: { // swiper图片数据
                    0: [],
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: []
                },
                showNote: false, // 不显示紫色小圆点
                renderMultipleNum: 0,
                pickerColor: '#9BF8D0'
            }
        },
        computed: {
            ...mapGetters(["usrObj", "myApp", "isSupportWebp"]),
            descNum() {
                return this.dynamicMap[this.current].labelInput.length
            },
            // 【完成】按钮是否可点击
            isActive() {
                if (this.dynamicMap[0].labelInput == "" &&
                    this.dynamicMap[1].labelInput == "" &&
                    this.dynamicMap[2].labelInput == "" &&
                    this.dynamicMap[3].labelInput == "" &&
                    this.dynamicMap[4].labelInput == "" &&
                    this.dynamicMap[5].labelInput == "") {
                    return false
                } else {
                    return true
                }
            }
        },
        created() {
            if (this.$route.query.edited) { // 调编辑过资料的接口
                this.getEditedTabs()
            } else {
                this.getNotEditedTabs()
                if (localStorage.getItem('$showBubble')) {
                    let showFlag = localStorage.getItem('$showBubble')
                    this.showBubble = JSON.parse(showFlag)
                } else {
                    this.showBubble = true
                }
            }
            this.platForm = this.checkPlatForm()
        },
        mounted() {
            this.SetLoading({flag: 1, text: '', bg: 'transparent'})
        },
        methods: {
            ...mapActions(["SetToast", "SetLoading"]),
            // 获取所有标签数据-编辑过资料时使用
            getEditedTabs() {
                appApi.getUserInfo({token: this.$store.state.app.myApp.token})
                    .then(res => {
                        if (res && res.code === 200) {
                            let resData = res.result
                            this.staticList = res.result
                            let colorIndexOfNum

                            resData.forEach((item, i) => {
                                this.dynamicMap[i].bgColor = item.bgColor || "linear-gradient(180deg, #FCA5F1 0%, #B5FFFF 100%)"
                                this.dynamicMap[i].hintText = item.hintText || ''
                                this.dynamicMap[i].labelCode = item.labelCode || ''
                                this.dynamicMap[i].labelInput = item.labelInput || ''
                                this.dynamicMap[i].labelName = item.labelName || ''
                                this.dynamicMap[i].currImg = item.photoBooth || ''
                                this.dynamicMap[i].photoBoothWebp = item.photoBoothWebp || '';
                                this.dynamicMap[i].boothList = item.boothList || '';

                                colorIndexOfNum = this.colorArr.indexOf(item.bgColor)
                                if (colorIndexOfNum > -1) {
                                    this.dynamicMap[i].colorNum = colorIndexOfNum + 1
                                } else {
                                    // 说明上一次编辑，用户没有编辑该tab(描述必填否则保存不上修改信息)
                                    if (item.bgColor == "") {
                                        this.dynamicMap[i].colorNum = 1
                                    } else {
                                        this.dynamicMap[i].colorNum = 0
                                        this.dynamicMap[i].bgColor = item.bgColor
                                    }
                                }

                                // this.initPoseImg(i, item.boothList)
                            });
                            this.initPoseImg(0, this.dynamicMap[0].boothList)

                            if (this.dynamicMap[0].labelInput == "") {
                                this.showNote = true
                            }

                            // 初始化拾色器
                            this.pickerColor = this.dynamicMap[0].bgColor
                            this.initPicker()

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

            // 获取所有标签数据-没有编辑过资料时使用
            getNotEditedTabs() {
                appApi.getLabelList({token: this.$store.state.app.myApp.token})
                    .then(res => {
                        if (res && res.code === 200) {
                            let resData = res.result;
                            this.staticList = res.result
                            resData.forEach((item, i) => {
                                this.dynamicMap[i].bgColor = item.bgColor || "linear-gradient(180deg, #FCA5F1 0%, #B5FFFF 100%)"
                                this.dynamicMap[i].hintText = item.hintText || ''
                                this.dynamicMap[i].labelCode = item.labelCode || ''
                                this.dynamicMap[i].labelInput = item.labelInput || ''
                                this.dynamicMap[i].labelName = item.labelName || ''
                                this.dynamicMap[i].colorNum = 1;
                                this.dynamicMap[i].boothList = item.boothList || '';

                                if (this.dynamicMap[i].labelInput == '') {
                                    this.showNote = true
                                }

                                this.initPoseImg(i, item.boothList)
                            })
                            console.log('this.dynamicMap：notEdit', this.dynamicMap)
                            this.pickerColor = '#9BF8D0'
                            this.initPicker()
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

            // 获取六组tab崽崽形象图
            initPoseImg(tabNum, boothIdStr) {
                if (boothIdStr === "") return this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})
                if (this.usrObj.zzId === "") return this.SetToast({status: 1, msg: '网络请求超时，请稍后重试'})

                appApi.renderMultipleImage({boothIdStr: boothIdStr, hashCodes: this.usrObj.zzId})
                    .then(res => {
                        this.renderMultipleNum++;
                        res.urls.forEach((item, index) => {
                            if (index === 0) {
                                // 上次编辑图片的有photoBooth
                                if (this.staticList[tabNum].photoBooth && this.staticList[tabNum].photoBooth != "") {
                                    this.dynamicMap[tabNum].currImg = this.staticList[tabNum].photoBooth;
                                    this.dynamicMap[tabNum].photoBoothWebp = this.staticList[tabNum].photoBoothWebp;
                                    return;
                                }
                                this.dynamicMap[tabNum].currImg = item;
                            }
                            this.staticImgMap[tabNum].push(item);
                        });
                        console.log('this.staticImgMap',this.staticImgMap)

                        // Object.keys(res).forEach((key, index) => {
                        //   if (index === 0) {
                        //     this.dynamicMap[tabNum].currImg = res[key].url
                        //     // 上次编辑图片的有photoBooth
                        //     if (this.staticList[tabNum].photoBooth && this.staticList[tabNum].photoBooth != "") {
                        //       this.dynamicMap[tabNum].currImg = this.staticList[tabNum].photoBooth
                        //     }
                        //   }
                        //   this.staticImgMap[tabNum].push(res[key].url)
                        // });

                        // if (this.renderMultipleNum == 6) {
                            this.SetLoading({flag: 0, text: '', bg: 'transparent'})
                        // }
                    })
                    .catch(err => {
                        this.renderMultipleNum++;
                        this.SetToast({status: 1, msg: err})
                        this.SetLoading({flag: 0, text: '', bg: 'transparent'})
                    });
            },

            // 初始化拾色器
            initPicker() {
                var colorPicker = new iro.ColorPicker('#picker', {
                    width: 180, // Set the size of the color picker
                    // color: this.pickerColor, // Set the initial color
                    color: '#9BF8D0', // Set the initial color
                    padding: 12,
                    margin: 46,
                });
                colorPicker.on('color:change', (color) => {
                    console.log('color color', color.hexString);
                    this.dynamicMap[this.current].bgColor = color.hexString
                });
            },

            // 监听change事件
            onChange(index) {
                this.nextImgFlag = false;
                this.current = index;
                this.nextNum = 0;
                this.nextImg = '';
                this.showBubble = false
                this.colorNum = this.dynamicMap[index].colorNum;
                this.initPoseImg(index, this.dynamicMap[index].boothList)
                if (this.dynamicMap[index].labelInput !== "") {
                    this.showNote = false
                } else {
                    this.showNote = true
                }
                localStorage.setItem('$showBubble', this.showBubble);

                // 切换tab时，tab跟着移动
                let moveL = document.getElementsByClassName('custom-icon')[index].offsetLeft
                document.getElementsByClassName('custom-indicator')[0].scrollLeft = moveL;


                _html({
                    e: 'match.interest.tab',
                    duid: this.myApp.duid,
                    args: {
                        "userid": this.myApp.userId,
                        "hashcode": this.myApp.zzId,
                        "tab": index + 1,
                        "place": "edit_info"
                    }
                })
            },

            // 点击tab
            changeTab(iNum) {
                this.nextImgFlag = false
                this.current = iNum
                this.colorNum = this.dynamicMap[iNum].colorNum + 1
                this.$refs.swipe.swipeTo(iNum)
                if (this.staticList[iNum].photoBooth && this.staticList[iNum].photoBooth != "") {
                    this.dynamicMap[iNum].currImg = this.staticList[iNum].photoBooth;
                    this.dynamicMap[iNum].photoBoothWebp = this.staticList[iNum].photoBoothWebp;
                    this.nextImg = this.staticList[iNum].photoBooth
                } else {
                    this.nextImg = this.staticImgMap[iNum].currImg
                }

                this.showBubble = false
                if (this.dynamicMap[iNum].labelInput !== "") {
                    this.showNote = false
                } else {
                    this.showNote = true
                }
                localStorage.setItem('$showBubble', this.showBubble)
            },

            // 更换姿势
            changePose() {
                this.nextImgFlag = true
                if (this.poseFlag) {
                    this.poseFlag = false
                    this.nextNum = this.nextNum + 1
                    if (this.nextNum > this.staticImgMap[this.current].length - 1) {
                        this.nextNum = 0
                    }
                    this.nextImg = this.staticImgMap[this.current][this.nextNum]
                    this.dynamicMap[this.current].currImg = this.staticImgMap[this.current][this.nextNum]
                }
                let timer = setTimeout(() => {
                    this.poseFlag = true
                    clearTimeout(timer)
                }, 800)
            },

            // 选择设定的背景色
            selectColor(index, color) {
                this.colorNum = index
                this.dynamicMap[this.current].bgColor = color
                this.dynamicMap[this.current].colorNum = index
                _html({
                    e: 'match.bg.select',
                    duid: this.myApp.duid,
                    args: {"userid": this.myApp.userId, "hashcode": this.myApp.zzId, "bg_type": "1"}
                })
            },
            handlePicker(type) {
                if (type === 'close') {
                    this.dynamicMap[this.current].bgColor = this.beforePicker
                } else {
                    _html({
                        e: 'match.bg.select',
                        duid: this.myApp.duid,
                        args: {"userid": this.myApp.userId, "hashcode": this.myApp.zzId, "bg_type": "0"}
                    })

                    let colorIndexOfNum = this.colorArr.indexOf(this.dynamicMap[this.current].bgColor)
                    if (colorIndexOfNum > -1) {
                        this.dynamicMap[this.current].colorNum = colorIndexOfNum + 1
                        this.beforePicker = this.dynamicMap[this.current].bgColor
                    } else {
                        this.beforePicker = this.dynamicMap[this.current].bgColor
                        this.pickerColor = this.dynamicMap[this.current].bgColor
                        this.dynamicMap[this.current].colorNum = 0
                    }
                }
                this.closePicker = !this.closePicker

            },
            handleOK() {
                this.colorNum = 0
                this.dynamicMap[this.current].colorNum = 0
                this.closePicker = true
            },

            // 点击【完成】按钮
            commitInput() {
                // 先调易顿检验用户输入是否合法
                this.checkUserInput()
            },

            // 检验用户的输入
            checkUserInput() {
                let str = `${this.dynamicMap[0].labelInput},${this.dynamicMap[1].labelInput},${this.dynamicMap[2].labelInput},${this.dynamicMap[3].labelInput}${this.dynamicMap[4].labelInput},${this.dynamicMap[5].labelInput}`
                console.log("str::", str, str.length)
                if (str.length < 5) {
                    this.SetToast({status: 1, msg: "请填写描述哦~"})
                    return
                }
                this.SetLoading({flag: 1, text: '', bg: 'transparent'})
                appApi.checkUserInfo({content: str, token: this.$store.state.app.myApp.token})
                    .then(res => {
                        this.SetLoading({flag: 0, text: '', bg: 'transparent'})
                        if (res && res.code == 200) {
                            if (res.result) {
                                this.assemblyData()
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

            // 提交前组装数据
            assemblyData() {
                if (this.usrObj.zzId == "" || this.usrObj.zzId == undefined) return this.SetToast({
                    status: 1,
                    msg: '保存失败，退出重试下哦~'
                })
                let data = []
                for (let i = 0; i < 6; i++) {
                    if (this.dynamicMap[i].labelInput !== "") {
                        data.push({
                            "bgColor": this.dynamicMap[i].bgColor,
                            "id": i,
                            "labelCode": this.dynamicMap[i].labelCode,
                            "labelInput": this.dynamicMap[i].labelInput,
                            "photoBooth": this.dynamicMap[i].currImg,
                            "zzId": this.usrObj.zzId,
                        })
                    }
                }
                this.postUserInput(data)
            },

            // 将编辑好的资料传给后端
            postUserInput(labelList) {
                appApi.postUserInfo({labelList: labelList, token: this.$store.state.app.myApp.token})
                    .then(res => {
                        if (res && res.code === 200) {
                            this.refreshTime(6)
                            this.SetToast({status: 0})
                            localStorage.setItem('$pageName', 'Edit')
                            localStorage.setItem('$previewData', JSON.stringify(res.result))
                            let timer = setTimeout(() => {
                                this.$router.push({name: 'Preview', query: {isUpdate: true}})
                            }, 50)
                        } else {
                            this.SetToast({status: 1, msg: err})
                            this.SetLoading({flag: 0, text: '', bg: 'transparent'})
                        }
                    })
                    .catch(err => {
                        this.SetToast({status: 1, msg: err})
                        this.SetLoading({flag: 0, text: '', bg: 'transparent'})
                    });
            },

            // 刷新在线时间
            refreshTime(source) {
                appApi.getRefresh({source: source, token: this.$store.state.app.myApp.token})
                    .then(res => {

                    })
                    .catch(err => {
                        this.SetToast({status: 1, msg: err})
                    });
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
            fnBlur() {
                if (this.platForm === 'Android') { // 安卓弹出键盘时不能向上推页面，iOS可以自动推起
                    let timer = setTimeout(function () {
                        document.getElementById('contenId').style.marginTop = 0
                        clearTimeout(timer)
                    }, 100);
                }
            },
            fnFocus() {
                this.showPannel = false
                if (this.platForm === 'Android') { // 安卓弹出键盘时不能向上推页面，iOS可以自动推起
                    let timer = setTimeout(function () {
                        if (document.body.clientHeight < 630) {
                            document.getElementById('contenId').style.marginTop = '-55%'
                        } else {
                            document.getElementById('contenId').style.marginTop = '-45%'
                        }
                        clearTimeout(timer)
                    }, 100);
                }
            },
        }
    }

</script>

<style lang="scss" scoped>
    .edit {
        .my-card {
            width: 100%;
            height: 684px;
            padding-top: 112px;
            position: relative;
        }

        // swiper样式
        .swipe-box {
            .van-swipe-item {
                width: 100%;
                height: 684px;
                border-radius: 0 0 40px 40px;
            }
            .zz-bg {
                width: 320px;
                height: 426px;
                margin: 150px auto 0;
                border-radius: 40px;
            }
            .zz-img {
                display: block;
                width: 320px;
                height: 426px;
                margin: 150px auto 0;
                border-radius: 40px;
            }
            .change-pose {
                display: block;
                width: 200px;
                height: 48px;
                margin: 30px auto 0;
                background: url("../assets/pic/edit/changepose@3x.png") no-repeat left center;
                background-size: 48px 48px;
                padding-left: 66px;
                box-sizing: border-box;
                line-height: 48px;
                font-size: 30px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #000000;
            }
        }
        .custom-indicator::-webkit-scrollbar {
            display: none;
        }
        .custom-indicator {
            width: 750px;
            padding-right: 36px;
            padding-left: 36px;
            box-sizing: border-box;
            margin-bottom: 30px;
            height: 88px;
            white-space: nowrap;
            overflow-x: scroll;
            position: absolute;
            left: 0;
            top: 16px;
            font-size: 0;
            .custom-slide {
                position: absolute;
                left: 36px;
                padding-right: 36px;
                box-sizing: border-box;
            }
            .custom-icon {
                display: inline-block;
                width: 152px;
                height: 88px;
                padding-left: 66px;
                box-sizing: border-box;
                border-radius: 44px;
                line-height: 88px;
                font-style: normal;
                font-size: 30px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: bold;
                color: #000000;
            }
            .custom-icon-active {
                background-color: #F1F3F8 !important;
            }
        }

        .change-bgColor::-webkit-scrollbar {
            display: none;
        }
        .change-bgColor {
            width: 750px;
            height: 120px;
            overflow-y: auto;
            padding: 12px 36px;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            .change-icon-outLine {
                width: 96px;
                height: 96px;
                border-radius: 50%;
                border: 6px solid transparent;
                box-sizing: border-box;
                margin-right: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .change-icon-middleLine {
                width: 84px;
                height: 84px;
                border-radius: 50%;
                border: 6px solid transparent;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .change-icon {
                display: block;
                width: 72px;
                height: 72px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .color-active {
            border: 6px solid #764EFF !important;
            .change-icon-middleLine {
                border: 6px solid #fff !important;;
            }
        }
        .costom-desc {
            h3 {
                width: 100%;
                height: 88px;
                line-height: 88px;
                padding: 0 36px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
            }
            .costom-tip {
                font-size: 24px;
                color: #969799;
                width: calc(100% - 74px);
                height: 32px;
                line-height: 32px;
                padding-left: 36px;
                box-sizing: border-box;

                margin: 25px auto;
                background: url('../assets/pic/edit/tip.png') no-repeat left 1px;
                background-size: 28px 28px;
            }
            .titleNote {
                font-size: 26px;
                position: relative;
                &:after {
                    content: '';
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #764EFF;
                    position: absolute;
                    top: 34px;
                    right: -22px;
                }
            }
            .title {
                font-size: 26px;
            }
            .num {
                font-size: 26px;
                color: #828F9F;
            }
            input {
                outline: none;
                border: none;
                display: block;
                margin: 0 auto;
                width: 598px;
                height: 32px;
                padding: 28px 40px;
                border-radius: 44px;
                background: #F1F3F8;
                font-size: 30px;
                font-weight: bold;
            }
            input::-webkit-input-placeholder {
                color: #C7D1DA;
            }
        }
    }

    .picker-mask {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.2);
        z-index: 19;
        .picker-pannel {
            width: 750px;
            height: 736px;
            border-radius: 40px 40px 0px 0px;
            background: #fff;
            position: absolute;
            left: 0;
            bottom: 0;
        }
        .picker-handle {
            width: 100%;
            height: 112px;
            line-height: 112px;
            padding: 0 36px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            span {
                display: inline-block;
                width: 80px;
                height: 112px;
                font-size: 30px;
            }
            .ok {
                color: #6332F8;
                font-weight: bold;
                text-align: right;
            }
        }
        #picker {
            width: 360px;
            margin: 0 auto;
            background: #FFFFFF;
        }
    }

    .indicator0 {
        background: url('../assets/pic/edit/0.png') no-repeat 23px 27px;
        background-size: 36px 36px;
    }

    .indicator1 {
        background: url('../assets/pic/edit/1.png') no-repeat 23px 27px;
        background-size: 36px 36px;
    }

    .indicator2 {
        background: url('../assets/pic/edit/2.png') no-repeat 23px 27px;
        background-size: 36px 36px;
    }

    .indicator3 {
        background: url('../assets/pic/edit/3.png') no-repeat 23px 27px;
        background-size: 36px 36px;
    }

    .indicator4 {
        background: url('../assets/pic/edit/4.png') no-repeat 23px 27px;
        background-size: 36px 36px;
    }

    .indicator5 {
        background: url('../assets/pic/edit/5.png') no-repeat 23px 27px;
        background-size: 36px 36px;
    }

    .icon0 {
        background: url('../assets/pic/edit/gracolor@3x.png') no-repeat center center;
        background-size: 72px 72px;
    }

    .bubble-box {
        position: absolute;
        top: 220px;
        right: 60px;
        width: 496px;
        height: 72px;
        background: #A1F2F9;
        border-radius: 20px;
        z-index: 9;
        .bubble-top {
            line-height: 72px;
            font-size: 26px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #000000;
            text-align: center;
            position: relative;
            &:after {
                content: '';
                position: absolute;
                right: 400px;
                top: -13px;
                width: 0;
                height: 0;
                border-bottom: 16px solid #A1F2F9;
                border-left: 16px solid transparent;
                border-right: 16px solid transparent;
            }
        }
    }

    .big-screen {
        .my-card {
            padding-top: 180px;
        }
        .bubble-box {
            top: 288px;
        }
    }
</style>

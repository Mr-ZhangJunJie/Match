import BrowserChecker from '@/utils/BrowserChecker'

const app = {
    state: {
        requestLoading: {flag: 0, bg: 'transparent', text: ''},
        networkContent: {flag: 0, message: ''},

        ruleContent: {flag: 0, txt: '', type: 1},
        toastContent: {flag: 0, type: 'error', msg: '出错啦，请稍后重试~'},

        config: {
            ruleDesc: '',
        },
        myApp: {
            inState: '-outApp',
            isInApp: false,
            version: '',
            dpr: window.devicePixelRatio,
            eventName: '2020geek',
            isAnd: false,
            isIos: false,

            token: '',

            UA: 'zepeto.service.zzz.crew/1.0.0',
            authToken: '6Lj+/pr5rGvf3tRm1/T4duISfcyrY6a6Iqlx1anpjWGIK4ApcHCF67781FPZ6UPXc8p7Mk7bBT2KwrA+rb6Y/yBmwBezO2XEABOJiBzAOig=\\1\\RsfMQ5P2Z9sBZ9W30YClC5sEu9g2CwI5ZY4BNYp=',
            // deviceId: '07C5AF32-568F-4BE0-B215-B55A950430F1',
            duid: '-',
            imToken: '',
            nickName: 'Amy',
            profilePic: 'https://cdn.zepeto.cn/users/5d10d0d562b11025c8ce0094/profile/5d10d160cc34fc35ef80de9d.png?modified=1582449814000',

            userAgent: 'ios.zepeto_cn/2.18.2 (ios; U; iOS 13.4; zh-CN; occ-CN; iPhone8,2)',
            // zzId: 'NQFOBI',
            // userId: '5eaa66bc62b1103917d26fdd',
            // zzId: 'G4DO5R',
            // userId: '5f335ee6a3fc654b9fd43095',
            zzId: "3L748O",
            userId: "5cdb8550dcda1b4f4c8cdab8",
            // zzId: 'G4DO5R',
            // userId: '5f335ee6a3fc654b9fd43095',
            // zzId: 'HZNM3Q',
            // userId: '5e37ea9862b11032ccf5333d',

            // userId: '5e4ac48012918c7bcb316212',
            // zzId: '28M5N0',

            // userId: '5cfcef8dcc34fc35ef757a2a',
            // zzId: 'S0HIN9',

            // zzId: "LSMSSJ",
            // userId: "5faa761ba3fc652f867348f6",

            // userId: '5d10d0d562b11025c8ce0094',
            // zzId: 'VLUFUV',

            IsLoggedIn: true,

            fansNum: '1999'
        },
        usrInfo: {
            UA: 'zepeto.service.zzz.crew/1.0.0',
            authToken: '6Lj+/pr5rGvf3tRm1/T4duISfcyrY6a6Iqlx1anpjWGIK4ApcHCF67781FPZ6UPXc8p7Mk7bBT2KwrA+rb6Y/yBmwBezO2XEABOJiBzAOig=\\1\\RsfMQ5P2Z9sBZ9W30YClC5sEu9g2CwI5ZY4BNYp=',
            // deviceId: '07C5AF32-568F-4BE0-B215-B55A950430F1',
            duid: '-',
            imToken: '',
            nickName: 'Amy',
            profilePic: 'https://cdn.zepeto.cn/users/5d10d0d562b11025c8ce0094/profile/5d10d160cc34fc35ef80de9d.png?modified=1582449814000',

            userAgent: 'ios.zepeto_cn/2.18.2 (ios; U; iOS 13.4; zh-CN; occ-CN; iPhone8,2)',
            // zzId: 'NQFOBI',
            // userId: '5eaa66bc62b1103917d26fdd',
            // zzId: 'G4DO5R',
            // userId: '5f335ee6a3fc654b9fd43095',
            zzId: "3L748O",
            userId: "5cdb8550dcda1b4f4c8cdab8",
            // zzId: 'HZNM3Q',
            // userId: '5e37ea9862b11032ccf5333d',

            // userId: '5e4ac48012918c7bcb316212',
            // zzId: '28M5N0',


            // userId: '5cfcef8dcc34fc35ef757a2a',
            // zzId: 'S0HIN9',

            // zzId: "LSMSSJ",
            // userId: "5faa761ba3fc652f867348f6",

            // userId: '5d10d0d562b11025c8ce0094',
            // zzId: 'VLUFUV',

            IsLoggedIn: true,

            fansNum: '1999',

        },
        showRule: false,
        showRuleTip: false,
        showPrize: false,
        showToast: false,
        isSupportWebp: false,
    },
    mutations: {
        SET_LOADING: (state, status) => {
            state.requestLoading.text = status.text;
            state.requestLoading.bg = status.bg;
            // error 的时候直接重置
            if (status.flag === 0) {
                state.requestLoading.flag = 0
                return
            }
            state.requestLoading.flag = status.flag ? ++state.requestLoading.flag : --state.requestLoading.flag
        },
        SET_TOAST: (state, {status, type, msg}) => {
            console.log('status, delay, type, msg', status, type, msg)
            state.toastContent.delay = 2500;

            state.toastContent.flag = status;
            state.toastContent.type = type || state.toastContent.type;
            state.toastContent.msg = msg || state.toastContent.msg;
            console.log('dfasda::', state.toastContent)
        },


        SET_NETWORK: (state, {status, message}) => {
            // error 的时候直接重置
            state.networkContent.message = message;
            if (status === 0) {
                state.networkContent.flag = 0
                return
            }
            state.networkContent.flag = status ? ++state.networkContent.flag : --state.networkContent.flag
        },
        SET_RULE: (state, {status, txt, type}) => {
            // error 的时候直接重置
            state.ruleContent.txt = txt;
            state.ruleContent.type = type;
            if (status === 0) {
                state.ruleContent.flag = 0
                return
            }
            state.ruleContent.flag = status ? ++state.ruleContent.flag : --state.ruleContent.flag
        },

        SET_CONFIG: (state, obj) => {
            state.ruleContent.txt = obj.ruleDesc;
            state.config = obj;
        },
        ASSIGN_MYAPP: (state, obj) => {
            state.myApp = Object.assign({}, state.myApp, obj)
        },
        ASSIGN_USRINFO: (state, obj) => {
            state.usrInfo = Object.assign({}, state.usrInfo, obj)
        },
        setShowRule(state, status) {
            state.showRule = status
        },
        setShowRuleTip(state, status) {
            state.showRuleTip = status
        },
        setShowToast(state, status) {
            state.showToast = status
        },
        setWebp(state, isWebp){
            state.isSupportWebp = isWebp;
        }
    },
    actions: {
        SetLoading({commit}, status) {
            commit('SET_LOADING', status)
        },
        SetToast({commit}, status) {
            commit('SET_TOAST', status)
        },
        SetRule({commit}, status) {
            commit('SET_RULE', status)
        },
        SetNetwork({commit}, status) {
            commit('SET_NETWORK', status)
        },
        Check_App_Info({state, commit}) {
            if (BrowserChecker.isIos()) {
                commit('ASSIGN_MYAPP', {isIos: true})
            } else if (BrowserChecker.isAndroid()) {
                commit('ASSIGN_MYAPP', {isAnd: true})
            }

            state.myApp.inState = window.ZEPETO ? '-inApp' : '-outApp'
            state.myApp.isInApp = window.ZEPETO ? true : false

            state.myApp.version = window.ZEPETO ? window.ZEPETO.version : state.myApp.version

            state.myApp.authToken = window.ZEPETO ? window.ZEPETO.userInfo.authToken : state.myApp.authToken

            state.myApp.duid = (window.ZEPETO && window.ZEPETO.duid) ? window.ZEPETO.duid : state.myApp.duid

            state.myApp.nickName = window.ZEPETO ? window.ZEPETO.userInfo.name : state.myApp.nickName

            state.myApp.profilePic = window.ZEPETO ? window.ZEPETO.userInfo.profilePic : state.myApp.profilePic

            state.myApp.userAgent = (window.ZEPETO && window.ZEPETO.userAgent) ? window.ZEPETO.userAgent : state.myApp.userAgent

            state.myApp.userId = window.ZEPETO ? window.ZEPETO.userInfo.userId : state.myApp.userId

            state.myApp.zzId = window.ZEPETO ? window.ZEPETO.userInfo.hashCode : state.myApp.zzId

            state.myApp.fansNum = window.ZEPETO ? window.ZEPETO.userInfo.followerCount : state.myApp.fansNum

            state.usrInfo.IsLoggedIn = window.ZEPETO ? window.ZEPETO.userInfo.IsLoggedIn : state.usrInfo.IsLoggedIn

            commit('ASSIGN_MYAPP', {EventFullPath: state.myApp.eventName + state.myApp.inState})

        },
        Check_Usr_Info({state, commit}) {
            state.usrInfo.authToken = window.ZEPETO ? window.ZEPETO.userInfo.authToken : state.usrInfo.authToken

            state.usrInfo.duid = (window.ZEPETO && window.ZEPETO.duid) ? window.ZEPETO.duid : state.usrInfo.duid

            state.usrInfo.nickName = window.ZEPETO ? window.ZEPETO.userInfo.name : state.usrInfo.nickName

            state.usrInfo.profilePic = window.ZEPETO ? window.ZEPETO.userInfo.profilePic : state.usrInfo.profilePic

            state.usrInfo.userAgent = (window.ZEPETO && window.ZEPETO.userAgent) ? window.ZEPETO.userAgent : state.usrInfo.userAgent

            state.usrInfo.userId = window.ZEPETO ? window.ZEPETO.userInfo.userId : state.usrInfo.userId

            state.usrInfo.zzId = window.ZEPETO ? window.ZEPETO.userInfo.hashCode : state.usrInfo.zzId

            state.usrInfo.fansNum = window.ZEPETO ? window.ZEPETO.userInfo.followerCount : state.usrInfo.fansNum

            state.usrInfo.IsLoggedIn = window.ZEPETO ? window.ZEPETO.userInfo.IsLoggedIn : state.usrInfo.IsLoggedIn

            commit('ASSIGN_USRINFO', {})

        },
        SetConfig({commit}, config) {
            commit('SET_CONFIG', config)
        },
    }
}

export default app

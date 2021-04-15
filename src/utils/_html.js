"use strict";
var sha1 = require('sha1');
import config from '@/config/index'

let appidDefault = 'match'; // appid 针对项目的appid设置默认值，调用时省时
let objectName = 'chaopai';  // 目前是固定值，不会根据项目改变
let isIos = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;

window._html=function(_ref) {
    var _ref$appid = _ref.appid,
        appid = _ref$appid  === void 0 ? appidDefault : _ref$appid,
        _ref$ts = _ref.ts,
        ts = _ref$ts === void 0 ? Date.now() : _ref$ts,
        _ref$duid = _ref.duid,
        duid = _ref$duid === void 0 ? '-' : _ref$duid,
        _ref$bk = _ref.bk,
        bk = _ref$bk === void 0 ? '-' : _ref$bk,
        os = isIos ? 'I' : 'A',
        _ref$ver = _ref.ver,
        ver = _ref$ver === void 0 ? '-' : _ref$ver,
        e = _ref.e,
        args = _ref.args;
    //ajax 请求
    var seq = parseFloat(sessionStorage.getItem('_index')) || 0;

    if (!Number.isSafeInteger(Number.parseFloat(seq))) {
        seq = 0;
    }
    seq++;
    sessionStorage.setItem('_index', seq);
    var xhr = new XMLHttpRequest();
    var data = "seq=".concat(seq, "&d=").concat(encodeURI(JSON.stringify({
        appid: appid,
        ts: ts,
        duid: duid,
        bk: bk,
        os: os,
        ver: ver,
        e: e,
        args: args
    })));
    // console.log('上报data:', decodeURIComponent(data))
    xhr.onreadystatechange = function () {
        // 通信成功时，状态值为4
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                console.log(xhr.responseText);
            } else {
                console.error(xhr.statusText);
            }
        }
    };

    xhr.onerror = function () {
        console.error('统计失败');
    };
    xhr.open('POST', config.VUE_APP_BURY, true);
    xhr.setRequestHeader('t', sha1(seq+duid+objectName)); // 指定 10 秒钟超时
    xhr.timeout = 3 * 1000;
    xhr.send(data);
}
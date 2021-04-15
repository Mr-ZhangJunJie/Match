import Browser from '@/utils/BrowserChecker'
export function visitePersion(zzId) {
    window.location.href = `ZEPETO://HOME/PROFILE/CARD?${zzId}`;
    setTimeout(() => {
        window.location.href = 'ZEPETO://WEBVIEW/CLOSE';
    }, 100);
}
export function recalc() {
    if(Browser.isIos()){
        !function(e,t){var n=e.documentElement,i="orientationchange"in window?"orientationchange":"resize",d=(/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,function(){var t=n.clientWidth;t&&(t>=750?(t=750,e.body.style.width="750px"):e.body.style.width=t+"px",n.style.fontSize=(t/10)+"px",n.dataset.width=t,n.dataset.percent=(t/10))});d(),e.documentElement.classList.add("iosx"+t.devicePixelRatio),e.addEventListener&&t.addEventListener(i,d,!1)}(document,window)
    }else{
        !(function(doc, win) {
            var docEl = doc.documentElement,
                defaultFontSize = parseFloat(window.getComputedStyle(docEl,null)['fontSize'])||16,
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function() {
                    var clientWidth = win.innerWidth
                        || doc.documentElement.clientWidth
                        || doc.body.clientWidth;
                    if (!clientWidth) return;
                    if (clientWidth < 750) {
                        docEl.style.fontSize = clientWidth / 10 / defaultFontSize * 100 + '%';
                        console.log('first',docEl.style.fontSize)
                    } else {
                        doc.body.style.width="750px";
                        docEl.style.fontSize = '75px';
                    }
                };
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
        })(document, window);
    }
}

/**
 * 获取图片blob地址
 * @param url 图片地址
 * @returns {Promise<any>}
 */
export function getBlobUrl(url) {
  const promise = new Promise(function (resolve, reject) {
    const handler = function () {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        const src = inputPathToUrl(this.response)
        resolve(src);
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
  return promise;
}

/**
 * 文件或blob对象转blob地址
 * @param file 文件或blob对象
 * @returns {string} 返回blob地址
 */
export function inputPathToUrl(file) {
  var url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}


/**
 * 弹窗滑动时，滚动不穿透
 */
export function fixedBody () {
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
}

export function looseBody () {
    let body = document.body
    body.style.position = ''
    let top = body.style.top
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
    body.style.top = ''
}

/**
 * 支持webp
 * */
const supportsWebp = ({ createImageBitmap, Image }) => {
    if (!createImageBitmap || !Image) return Promise.resolve(false);

    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
            createImageBitmap(image)
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
        };
        image.onerror = () => {
            resolve(false);
        };
        image.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    });
};

export function webpIsSupported(){
    return new Promise((resolve,reject)=>{
        const image = new Image();
        image.onload = () => {
            var result = (image.width > 0) && (image.height > 0);
            resolve(true);
        };
        image.onerror = () => {
            resolve(false);
        };
        image.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    })
}

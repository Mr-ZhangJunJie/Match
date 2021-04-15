export default class JudgeScreen {
  static bigScreen() {
      let result = false;
      // const rate = window.screen.height / window.screen.width;
      const rate = window.innerHeight / window.innerWidth;
      // let limit =  window.screen.height === window.screen.availHeight ? 2.05 : 1.65; // 临界判断值
      let limit =  window.screen.height === window.screen.availHeight ? 1.9 : 1.65; // 临界判断值
      // let limit =  2.05; // 临界判断值
      console.log(window.screen.height,window.screen.width,document.body.clientWidth,document.body.clientHeight,window.innerWidth,window.innerHeight,rate,limit);
      if (rate > limit) {
          result = true;
      }
      return result;
  }
}

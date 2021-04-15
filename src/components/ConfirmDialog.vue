<template>
  <div class="dialog">
    <div class="main">
      <div class="block">
        <h4 v-html="txtVal"></h4>
      </div>
      <div class="btnWrap">
        <a class="noBtn" @click="cancelFn">取消</a>
        <a class="okBtn" @click="confirmFn">登录</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    txtVal: String
  },
  methods: {
    cancelFn () {
      this.$emit('confirmHand', false)
    },
    confirmFn () {
      this.$emit('confirmHand', true)
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 667;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
  .main{
    position: absolute;
    width: 460px;
    height: 300px;
        left: 50%;
        top: 50%;
        margin-top: -170px;
        margin-left: -230px;
    border-radius: 20px;
    background: #fff;
    padding: 60px 40px 45px;
    box-sizing: border-box; 
    text-align: center;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, .2);
    .block{
      height: 90px;
    }
    h4{
      color: #000;
      font-size: 34px;
      padding: 0 30px;
      box-sizing: border-box;
      text-align: center;
      line-height: 48px;
      margin-bottom: 0;
    }
    span{
      display: inline-block;
      width: auto;
      height: 49px;
      line-height: 49px;
      color: #333;
      font-size: 32px;
    }
    .btnGroup{
      display: flex;
    }
    .noBtn, .okBtn{
      display: inline-block;
      width: 164px;
      height: 80px;
      line-height: 80px;
      border-radius: 40px;
      border: 1px solid #404040;
      font-size: 32px;
      position: relative;
      color: red;
    }
    .noBtn{
      border-color: #6332F8;
      background: #fff;
      color: #6332F8;
      margin-right: 34px;
    }
    .okBtn{
      background-color: #6332F8;
      color: #fff;
    }
  }
}
</style>

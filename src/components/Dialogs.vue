<template>
  <!-- 父子组件 -->

  <div class="component-dialog-mask" v-show="showDialog" @click="handleCloseDialog">
    <div class="component-dialog">
      <img class="component-dialog-icon" src="../assets/img/dialog/pic_gift@2x.png" alt="" />
      <span class="component-dialog-close" @click="handleCloseDialog">
        <img src="../assets/img/dialog/n_ex_48@2x.png" alt="" />
      </span>
      <p class="component-dialog-title">{{title}}</p>
      <p class="component-dialog-subTitle">{{subTitle}}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "Dialogs",
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit("notifyCloseDialog", false);
    }
  }
};
</script>

<style lang='scss' scoped>
.component-dialog-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .component-dialog{
    width: 540px;
    height: 450px;
    background-color: #4b4bf0;
    border-radius: 40px;
    color: #fff;
    text-align: center;
    position: relative;
    padding-top: 254px;
    box-sizing: border-box;
    .component-dialog-icon{
      position: absolute;
      top: -92px;
      left: 0;
      width: 540px;
      height: 346px;
    }
    .component-dialog-title{
      font-size: 40px;
      font-weight: bold;
      height: 22px;
      line-height: 22px;
      margin: 36px 0 30px;
    }
    .component-dialog-subTitle{
      font-size: 28px;
    }
    .component-dialog-close{
      position: absolute;
      top: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      background: #3c3cc1;
      border-radius: 50%;
      img{
        width: 36px;
        height: 36px;
        margin-bottom: 14px;
      }
    }
  }
}
</style>

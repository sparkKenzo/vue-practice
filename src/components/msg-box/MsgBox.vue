<template>
  <transition name="fade">
    <div class="msg-box-wrapper ignore-vw" v-if="visible">
      <div class="mask-layer"></div>
      <div class="msg-box">
        <i class="close" @click="close" v-if="options.show_close"></i>
        <img src="./image/error.png" alt="icon" class="msg-icon" v-if="options.status === 1">
        <img src="./image/success.png" alt="icon" class="msg-icon" v-else>
        <div class="msg" v-if="options.html" v-html="options.html"></div>
        <p class="msg" v-else>{{options.msg}}</p>
        <button class="btn" v-hover @click="close">{{options.btn_text}}</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MsgBox',
  data () {
    return {
      visible: false,
      options: {
        status: 1, // 提示状态，1:失败,2:成功
        msg: '出错了', // 提示信息
        html: '', // 自定义信息
        show_close: true, // 是否显示右上角关闭按钮
        btn_text: '确定', // 按钮文字
        beforeClose: null // 关闭前执行的函数
      }
    }
  },
  methods: {
    close () {
      if (this.options.beforeClose) {
        this.options.beforeClose()
      }
      this.visible = false
    },
    keyDown (e) {
      // esc关闭
      if (e.keyCode === 27) {
        this.close()
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.keyDown)
  },
  beforeDestroy () {
    document.addEventListener('keydown', this.keyDown)
  }
}
</script>

<style scoped lang="scss">
.ignore-vw.msg-box-wrapper{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  transition: all .5s;
  .mask-layer{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #000;
    opacity: 0.5;
  }
  .msg-box{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 344px;
    padding: 40px 0;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 8px;
  }
  .close{
    position: absolute;
    width: 16px;
    height: 16px;
    top: 10px;
    right: 10px;
    background: url("./image/icon-close.png") no-repeat center;
    background-size: cover;
    cursor: pointer;
  }
  .msg-icon{
    width: 64px;
    height: 64px;
  }
  .msg{
    margin: 20px 20px 40px;
    font-size: 16px;
    color: #1F1F22;
  }
  .btn{
    height: 38px;
    line-height: 38px;
    padding: 0 44px;
    font-size: 16px;
    color: #fff;
    background: #FF7200;
    outline: none;
    border: none;
    border-radius: 19px;
    cursor: pointer;
    &.hover {
      opacity: .8;
    }
    &:active {
      opacity: .6;
    }
    &.btn-confirm{
      background: #379AFF;
    }
  }
}
/* 过渡样式 */
.fade-enter-active, .fade-leave-active{
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>

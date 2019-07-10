<template>
  <transition name="kc-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'kc-message',
        type && !iconClass ? `kc-message--${ type }` : ''
      ]"
      :style="positionStyle"
      v-show="visible">
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="kc-message__content">{{message}}</p>
        <p v-else v-html="message" class="kc-message__content"></p>
      </slot>
    </div>
  </transition>
</template>  
<script>
import { setTimeout } from 'timers';
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}
export default {
  data () {
    return {
      visible: false, // 是否显示
      message: '', // 提示文字信息
      duration: 3000, // 自动关闭事件(ms)
      type: 'info', // 消息类型
      iconClass: '', 
      onClose: null,
      closed: false,
      verticalOffset: 70, // 距离顶部的距离
      timer: null,
      dangerouslyUseHTMLString: false
    }
  },
  computed: {
    typeClass () {
      return this.type && !this.iconClass
        ? `kc-message__icon kc-icon-${ typeMap[this.type] }`
        : ''
    },
    positionStyle () {
      return {
        'top': `${ this.verticalOffset }px`
      }
    }
  },
  watch: {
    closed (newVal) {
      if (newVal) {
        this.visible = false
      }
    }
  },
  methods: {
    // 关闭后移除元素
    handleAfterLeave () {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    // 关闭消息提示
    close () {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }
    },
    // 定时自动关闭消息
    startTimer () {
      if (this.duration > 0) {
        this.timer = setTimeout (() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    keyDown (e) {
      if (e.keyCode === 27) { // esc关闭消息
        if (!this.closed) {
          this.close()
        }
      }
    }
  },
  mounted () {
    this.startTimer()
    document.addEventListener('keydown', this.keyDown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.keyDown)
  }
}
</script>

<style scoped lang="scss">
.kc-message{
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-width: 380px;
  padding: 15px 15px 15px 20px;
  background: #edf2fc;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  p{
    margin: 0;
  }
  .kc-message__content{
    font-size: 14px;
    line-height: 1;
  }
  .kc-message__icon {
    margin-right: 10px;
  }
  &.kc-message--success {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67C23A;
  }
  &.kc-message--warning {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #E6A23C;
  }
  &.kc-message--info {
    background: #edf2fc;
    border-color: EBEEF5;
    color: #909399;
  }
  &.kc-message--error {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #F56C6C;
  }
}
/* 过渡样式 */
.kc-message-fade-enter-active, .kc-message-fade-leave-active{
  transition: opacity .5s
}
.kc-message-fade-enter, .kc-message-fade-leave-to{
  opacity: 0;
}
</style>     
<style>
[class^="kc-icon-"], [class*=" kc-icon-"] {
  font-family: 'element-icons' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}
.kc-icon-success::before {
  content: "\E79C";
}
.kc-icon-warning::before {
  content: "\E7A3";
}
.kc-icon-info::before {
  content: "\E7A1";
}
.kc-icon-error::before {
  content: "\E79D";
}
</style>
 
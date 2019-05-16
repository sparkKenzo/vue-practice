<template>
  <div class="page">
    <div :style="style"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'progressBar',
  props: {
    options: {
      type: Object,
      default () {
        return {
          sucColor: 'green',
          failColor: 'red',
          position: 'top',
          transition: { 
            widthSpeed: 200,
            opacitySpeed: 400,
            duration: 300 // 定义消失时间ms
          },
          thickness: 2 // 进度条的高度
        }
      }
    }
  },
  data() {
    return {
      percent: 0, // 进度条长度
      show: false, // 显示和隐藏
      canSuccess: true // 是否是成功的状态
    }
  },
  computed: {
    style () {
      // 获取用到的属性
      const {sucColor,failColor,position,transition,thickness} = this.options
      const {widthSpeed,opacitySpeed} = transition
      const {percent,show,canSuccess} = this
      // 定义css样式
      const style = {
        backgroundColor: canSuccess ? sucColor : failColor,
        opacity: show ? 1 : 0
      }
      if (position !== 'top' && position !== 'bottom') {
        throw new Error('The wrong config of position!')
      }
      style[position] = 0
      style.right = 0
      style.width = percent + '%' // 设置进度条长度
      style.height = thickness + 'px' // 设置进度条高度
      style.transition = `width ${widthSpeed}ms,opacity ${opacitySpeed}` // 设置过渡样式
      return style
    }
  }
}
</script>

<style scoped>
.bar{
    position: fixed;
    z-index:999;
    opacity: 1;
}
</style>

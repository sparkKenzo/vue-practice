import MsgBox from './MsgBox'

export default {
  install (Vue, options = {}) {
    // 注册组件
    Vue.component(MsgBox.name, MsgBox)
    // 创建一个子类
    const Component = Vue.extend(MsgBox)
    // 挂载到全局
    Vue.prototype.$kcMsgBox = function (options) {
      // 创建组件实例
      const vm = new Component()
      vm.$mount()
      // 如果是服务端渲染那么不继续执行
      if (!vm.$isServer) {
        document.body.appendChild(vm.$el)
      }
      vm.visible = true
      vm.options = { ...vm.options, ...options }
      this.close = function () {
        vm.visible = false
      }
      return this
    }
  }
}

import KcMessage from './main'

export default {
  install (Vue, opts = {}) {
    Vue.prototype.$kcMessage = KcMessage
  }
}
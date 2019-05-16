import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import progressBar from '@/components/progress-bar'

Vue.use(progressBar, {autoFinish: false})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

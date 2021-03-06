// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import router from './router'
import axios from 'axios'
// import VueLazyload from 'vue-lazyload'


import dpay from 'dpayjs'

// only import the icons you use to reduce bundle size
// import 'vue-awesome/icons/flag'

// or import all icons if you don't care about bundle size


// globally (in your main .js file)

dpay.api.setOptions({ url: 'wss://dpayd.dpays.io' });



var bus = new Vue()

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.prototype.$bus = bus
Vue.prototype.$dpay = dpay

Vue.prototype.$apiserver = 'https://rest.dpays.io'



Vue.use(Vuex)
// Vue.use(VueLazyload)




const store = new Vuex.Store({
  state: {
    count: 0,
    topMenu:'dpaystatus'
  },
  mutations: {
    increment (state) {
      state.count++
    },
    topMenu (state, val) {
      state.topMenu = val
    }
  }
})

// Vue.prototype.$store = store



store.commit('increment')

console.log(store.state.count) // -> 1







/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

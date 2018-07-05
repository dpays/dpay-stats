<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view/>
    <bottom></bottom>
    <snackbar></snackbar>

  </div>
</template>

<script>

import TopBar from '@/components/Top'
import Bottom from '@/components/Bottom'
import Snackbar from '@/components/Snackbar'


export default {
  name: 'App',
  components: {
      'nav-bar': TopBar,
      'bottom': Bottom,
      'snackbar':Snackbar
  },
  created: function () {


    let page = localStorage.getItem('topMenu') || ''
    console.log('page : ' + page)

    if(this.$route.path=='/'){
      if(page=='account'){
        page = '@' + localStorage.getItem('accountName')
      }

      this.$router.push(
          {
            path: '/'+page,
          }
       )
    }

  },

  methods: {
    preventZoom(e){
      console.log('preventZoom')
      var t2 = e.timeStamp;
      var t1 = e.currentTarget.dataset.lastTouch || t2;
      var dt = t2 - t1;
      var fingers = e.touches.length;
      e.currentTarget.dataset.lastTouch = t2;

      if (!dt || dt > 500 || fingers > 1) return; // not double-tap

      e.preventDefault();
      e.target.click();
    }

  }





}
</script>

<style>
#app {
  @import './assets/bootstrap.css';
  @import './assets/custom.css';
}
</style>

<template>

<div class="" >

  <div class="navbar2">
    <router-link id="m1" to="/" v-bind:class="{ 'text-primary-mutable': $store.state.topMenu == 'steemstatus' }">STEEMST</router-link>

    <a href="javascript:void(0);" class="text-muted" id="m2" style="margin-left: 20px;margin-right: -5px" v-bind:class="{ 'text-primary-mutable': $store.state.topMenu == 'accounts' }" v-on:click="accountClick()">Accounts</a>


    <router-link id="m3" to="/witness" style="margin-right: -5px" v-bind:class="{ 'text-primary-mutable': $store.state.topMenu == 'witness' }">Witness</router-link>


    <hr id="h1" style="margin-top:50px;margin-bottom:1px;width: 100%"/>
  </div>

<div style="margin-bottom:70px"/>
</div>
</template>

<script>
export default {
  data () {
    return {
      prePositionState:'up'
    }
  },
  computed: {    
  },

  methods: {

    accountClick(){
      console.log('acc click')
      let accountName = localStorage.getItem('accountName')
      console.log('accountName : ' + accountName)
      // this.$router.push('/'+topMenu)

      if(accountName!==null){
        this.$router.push('/@'+accountName)
      }else{
        this.$router.push('/accounts')
      }



    }


  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#top {
}

</style>

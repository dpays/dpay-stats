<template>

<div class="accounts container" >


<ul class="list-group mb-2" >
  <li class="d-flex justify-content-between steem-card-title">
      <p></p>
      <span><small>Synced daily.</small></span>
  </li>
</ul>


<div class="card mb-2" >
  <div class="card-body">
    <div class="row" >
      <div class="col-lg-4 col-md-6" >
        Sort By
        <div class="form-group">
          <select class="custom-select" v-model="sortBy" v-on:change="sortByChange">
            <option value="total_steem"  >Total STEEM</option>
            <option value="active_steem" >Effective SP</option>
            <option value="num_reputation" >Reputation</option>
          </select>
        </div>
      </div>
      <div class="col-lg-4 col-md-6" >
        User Name
        <div class="form-group">
          <div class="input-group mb-3">
            <div class="">
              <input type="text" class="form-control " id="inputGroupFile02" v-model="userName" v-on:keyup="nameKeyup" v-on:keydown.enter="nameEnter">
            </div>
            <div class="input-group-append">
              <span class="btn btn-secondary" id="" v-on:click="nameEnter">Search</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6" >
        <ul class="list-group" >
          <li class="list-group-item d-flex justify-content-between align-items-center " >
            Accounts
            <div class="text-right">

              <span>{{ toLS(accountCount.block_user_count)}} <small>steem</small></span><br/>
              <span>{{ toLS(accountCount.db_user_count)}} <small>status</small></span>
            </div>
          </li>
        </ul>  
      </div>
    </div>
  </div>
</div>


<div v-if="showSpinner" class="sk-spinner sk-spinner-pulse"></div>



<div class="card mb-2" v-for="(value, index) in users">

  <div class="card-body">

    <div class="row justify-content-between" style="padding: 0.1rem 1rem 0.5rem 1rem">
      <span>
        <b>#{{value.rank}}</b>
        <img class="pthumbnail ml-1" :src="value.profile_image" @error="imageLoadOnError(value)">
        <router-link class="ml-1" :to="'/@'+value.name"><b> {{value.name}} </b></router-link>
      </span>
      <span class="text-right" v-bind:class="{ 'alive-2': value.lastVoteTime>7 && value.lastVoteTime<=31, 'alive-1': value.lastVoteTime<=7, 'alive-3': value.lastVoteTime>31}"  > <a :href="'https://steemit.com/@'+value.name" target="_blank">steemit</a>  ●</span>

    </div>



    <p>{{value.about}}</p>
    <p style="margin-top: -10px"><a :href="value.website" target="_blank">{{value.website}}</a></p>

    <div class="row" >
      <div class="col-sm-6" >
        <ul class="list-group" >
          <li class="list-group-item d-flex justify-content-between align-items-center " >
            Calculated
            <div class="text-right">
              <span>{{ toLS(toFixed0(value.total_steem))}} <small>STEEM (total)</small></span><br/>
              <span>{{ toNumber(value.active_steem)}} <small>SP (effective)</small></span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Balances
            <div class="text-right">
              <span>{{ toNumber(value.balance)}} <small>STEEM</small></span><br/>
              <span>{{ toNumber(value.sp)}} <small>SP</small></span><br/>
              <span>{{ toNumber(value.sbd_balance)}} <small>SBD</small></span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
              Reputation
              <span>{{ value.reputation}} </span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
              Created
              <span>{{ value.created}} </span>
          </li>
        </ul>  
      </div>
      <div class="col-sm-6" >
        <ul class="list-group">

          <li v-if="value.witnesses_voted_for!='0'" class="list-group-item d-flex justify-content-between align-items-center">
            Witnesses voted count
            <span >{{value.witnesses_voted_for}}</span>
          </li>
          <li v-if="value.witnessVotes!=''" class="list-group-item d-flex justify-content-between align-items-center">
            <span ><small>{{value.witnessVotes}}</small></span>
          </li>


          <li v-if="value.witnesses_voted_for=='0'" class="list-group-item d-flex justify-content-between align-items-center">
            Proxy
              <span >{{value.proxy}} </span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Proxied
              <span >{{value.proxied}} <small>STEEM</small></span>
          </li>


        </ul>  
      </div>
    </div>
  </div>
</div>


<div v-if="!showSpinner">
  <nav aria-label="Page navigation example" style="margin-top:22px">
    <ul class="pagination justify-content-center">
      <li class="page-item"  v-for="(value, index) in pageList" v-bind:class="{ active: page==value }">
        <a class="page-link" v-on:click.prevent="pageClick(value)">{{value}}</a>
      </li>
    </ul>
  </nav>
</div>


<br/>



  </div>
</template>
<script>

var moment = require('moment');


export default {
  name: 'accounts',
  data () {
    return {
      allUsers : [],
      users : [],
      page : 1,
      pageList : [1,2,3,4,5],
      sortBy : 'total_steem',
      userName : '',
      showSpinner : false,
      globalProperties : {vestingValue:0},
      accountCount:{}
    }
  },
  computed: {
    // hasResult: function () {
    //   return this.posts.length > 0
    // }
  },

    mounted() {
    },

  created: function () {

    // this.userName = this.$route.params.id || ''
    // let page = this.userName !==undefined ? '@'+this.userName : 'accounts'
    // console.log(page)

    localStorage.removeItem('accountName')
    localStorage.setItem('topMenu','accounts')
    this.$store.commit('topMenu','accounts')


    this.sortBy = localStorage.getItem('sortBy') || 'total_steem'
    this.showSpinner = true;

    this.getGlobalProperties();


  },

  methods: {

    getGlobalProperties(){

        this.$http.get(this.$apiserver + '/steem/cache')
        .then((result) => {
            this.globalProperties.time = result.data.time
            this.globalProperties.vestingValue =  result.data.vesting_value
          
            this.getUsers(1);


        })
        .catch(error => {
          console.log(error.response)
        });


      this.$http.get(this.$apiserver+'/usercount')
        .then((result) => {
          this.accountCount=result.data
        })
        .catch(error => {
          console.log(error.response)
        });

    },

    getVoting(){

      if(this.userName===''){
        return;
      }


      this.$http.get(this.$apiserver+'/users/' + this.userName + '/voting')
      .then((result) => {
        console.log(result.data)
      })
      .catch(error => {
        console.log(error.response)
      });

    },


    getUsers: function (page) {

        let url = ''
        if(page===1){
          url = this.$apiserver+'/users?page=1&sort='+this.sortBy
        }else{

          let nexrOrPrev = this.page < page ? '/next' : '/prev'
          let targetUserName = ''



          if(nexrOrPrev=='/next'){

            let index  = (page-this.page)*15-1

            console.log(index)

            targetUserName = this.allUsers[index].name

          }else{
            targetUserName = this.allUsers[0].name
          }

          console.log(targetUserName)

          url = this.$apiserver+'/users/'+targetUserName+nexrOrPrev + '?sort='+this.sortBy
        }

        this.initPage(page)
        this.showSpinner = true;

        this.$http.get(url)
        .then((result) => {
          // console.log(result.data)
          this.createUsers(result.data);
          this.showSpinner = false;

        })
        .catch(error => {
          console.log(error.response)
          this.showSpinner = false;
        });

    },

    updateClick(name){
      this.$http.get(this.$apiserver+'/users/'+name + '?sort='+this.sortBy)
      .then((result) => {
            this.getUsers()
      })
      .catch(error => {
      });      
    },


    createUsers(data){

      console.log('createUsers')

          let tmpList = [];

          for(let value of data.data){

            value.fromNow = moment(value.last_updated).fromNow();

            // console.log(value)

            var tempimg = 'https://steemst.com/images/steem_thumb.png';

            if(value.json_metadata==='' || value.json_metadata.length===2){
                value.profile_image = tempimg;
            }else{
                var json_metadata = JSON.parse(value.json_metadata);

                if(json_metadata.profile){


                  if(json_metadata.profile.profile_image){
                    json_metadata.profile.profile_image = json_metadata.profile.profile_image.replace(/http:/gi, "https:"); 
                    value.profile_image = json_metadata.profile.profile_image !== undefined? json_metadata.profile.profile_image : tempimg;
                  }

                  value.profile_image = json_metadata.profile.profile_image !== undefined? json_metadata.profile.profile_image : tempimg;

                  // console.log(json_metadata.profile)

                  value.about = json_metadata.profile.about || ''
                  value.website = json_metadata.profile.website || ''
                }else{
                  value.profile_image = tempimg;
                }
            }

            value.reputation = value.num_reputation;

            value.witnessVotes = ''
            for(let wit of value.witness_votes){
              value.witnessVotes += '@' + wit + ' '
            }

            // let delegated_vesting_shares = parseFloat(value.delegated_vesting_shares);
            let vesting_shares = parseFloat(value.vesting_shares);
            // let received_vesting_shares = parseFloat(value.received_vesting_shares);
            value.sp = vesting_shares * this.globalProperties.vestingValue;
            value.proxy = value.proxy=='' ? '\"\"' : value.proxy
            value.proxied = (Number(value.proxied_vsf_votes[0])/1000000) * this.globalProperties.vestingValue
            value.proxied = Number(value.proxied.toFixed(0)).toLocaleString()

            value.lastVoteTime = this.fromNowDay(value.last_vote_time)

            if(tmpList.length<15){
              tmpList.push(value)
            }

            
          }

          this.allUsers = data.data
          this.users = tmpList
    },

    imageLoadOnError(value){
      value.profile_image = 'https://steemst.com/images/steem_thumb.png'
    },


    pageClick(value){
      this.getUsers(value)
    },

    preNextClick(value){
      if(value=='prev'){
        if(this.page > 1){
          this.page-=1
          this.getUsers(this.page)
        }
      }else{
        this.page+=1
        this.getUsers(this.page)
      }
    },

    sortByChange(){
      localStorage.setItem('sortBy',this.sortBy)

      console.log(this.userName.length)

      if(this.userName.length){
        this.nameEnter()
      }else{
        this.getUsers(1)
      }
      
      
    },

    nameKeyup(){
      console.log('keyup')
    },

    nameEnter(){

      if(this.userName==''){
        this.getUsers(1);

        return
      }


    // this.getVoting();


      this.showSpinner = true;
      this.$http.get(this.$apiserver+'/users/'+this.userName + '?sort='+this.sortBy)
      .then((result) => {
        if(result.data.message){
          console.log('show snack')
          this.$bus.$emit('showSnackbar', result.data.message)
        }

        this.showSpinner = false;
        this.initPage(result.data.page)
        this.createUsers(result.data)
      })
      .catch(error => {
        this.showSpinner = false;
      });   

    },

    initPage(page){
       if(page){
          this.page = page;
          this.createPageList(page)
        }

        $('html,body').scrollTop(0);
    },




    createPageList(value){
      if(value>2){
        this.pageList = []
        for(let i = 1; i>0; i--){
          this.pageList.push(value-i)
        }
        this.pageList.push(value)
        for(let i = 1; i<=3; i++){
          this.pageList.push(value+i)
        }
      }else{
        this.pageList = [1,2,3,4,5]
      }
    },

    fromNow(value){
      // let timestamp = moment(value).subtract(-9, 'hour').toDate();
      let fromNow = moment(value).fromNow();
      return fromNow
    },

    fromNowDay(value){

      let difference = new Date(this.globalProperties.time).getTime() - new Date(value).getTime()
      let calSecond = Math.floor(difference/1000)
      let fromNowMinute = calSecond/60
      let day = fromNowMinute / 1440;

      if(isNaN(day)){
        day = 9999
      }

      day = Number(day.toFixed(0))
      return day
    },


    toNumber(val){
      return Number(parseFloat(val).toFixed(0)).toLocaleString()
    },

    toLS(val){
      return Number(val).toLocaleString()
    },

    toB:function(val){
      return (Number(val)/1000000000).toFixed(1)
    },

    toFixed1:function(val){
      return Number(val).toFixed(1)
    },

    toFixed0:function(val){
      return Number(val).toFixed(0)
    },

    chageColor:function(val){
      let text = 'text-blue'
      if(Number(val) < 0)
        text = 'text-red'
      return text
    }



  }
}
</script>

<style scoped>
</style>

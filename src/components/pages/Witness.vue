<template>

<div class="witness container" >





<ul class="list-group mb-2" >
  <li class="d-flex justify-content-between steem-card-title">
      <p>Active witness : {{global.active_count}}</p>
      <span><small>synced {{global.synced_m}} minute ago </small></span>
  </li>
</ul>



<div v-if="showSpinner" class="sk-spinner sk-spinner-pulse"></div>


<table class="table table-hover">
  <thead>
    <tr>
      <th style="padding:0.5rem 0rem">#</th>
      <th style="padding:0.5rem 0rem">Witness</th>
      <th style="padding:0.5rem 1.1rem 0.5rem 0rem" class="text-right">Votes<small>(SP)</small></th>
      <th style="padding:0.5rem 1.1rem 0.5rem 0rem" class="text-right">Last confirmed</th>
      <th style="padding:0.5rem 1.1rem 0.5rem 0rem" class="text-right">Price feed</th>
      <th style="padding:0.5rem 1.1rem 0.5rem 0rem" class="text-right">Missed B.</th>
      <th style="padding:0.5rem 0rem " class="text-right">Version</th>
    </tr>
  </thead>
  <tbody>
    
    <tr v-bind:class="{ 'witness_disabled': !value.active }"  v-for="(value, index) in witness">
      <td style="padding:0.3rem 0.5rem 0.3rem 0rem"><b>{{value.active_rank}}</b></td>
      <td  style="padding:0.3rem 1.1rem 0.3rem 0rem">{{value.owner}}</td>
      <td class="text-right" style="padding:0.3rem 1.1rem 0.3rem 0rem">{{toLS(value.votes_sp)}}<small v-if="value.active"><br/>{{value.votes_sp_percent}}%</small></td>
      <td class="text-right" style="padding:0.3rem 1.1rem 0.3rem 0rem">{{value.last_confirmed_block_num}}<span v-bind:class="{ 'alive-2': value.last_confirmed_block_h>0.1 && value.last_confirmed_block_h<=1, 'alive-1': value.last_confirmed_block_h<=0.1}" v-if="value.active"><br/>{{value.last_confirmed_block_h}}<small>h</small></span></td>
      <td class="text-right" style="padding:0.3rem 1.1rem 0.3rem 0rem">${{parseFloat(value.sbd_exchange_rate.base)}}<span v-bind:class="{ 'alive-1': value.last_sbd_exchange_update_h<=2}" v-if="value.active"><br/>{{value.last_sbd_exchange_update_h}}<small>h</small></span></td>
      <td class="text-right" style="padding:0.3rem 1.1rem 0.3rem 0rem">{{value.total_missed}}</td>


      <td class="text-right" style="padding:0.3rem 0rem">{{value.running_version}}</td>
    </tr>
    
  </tbody>
</table> 






  </div>
</template>
<script>

var moment = require('moment');


export default {
	name: 'witness',
  data () {
    return {
      showSpinner : false,
      global : {},
      witness : {}
    }
  },
  computed: {
    // hasResult: function () {
    //   return this.posts.length > 0
    // }
  },

    mounted() {
        console.log('mounted!!')
    },

	created: function () {

		localStorage.setItem('topMenu','witness')
		this.$store.commit('topMenu','witness')

		this.showSpinner = true;
		this.getWitness();
	},

  methods: {


  	getWitness(){

	this.showSpinner = true;

      this.$http.get(this.$apiserver+'/witness')
        .then((result) => {

			let data = result.data
			let active_count = 0
			let active_rank = 0

      let activeWitnessCount = 0;

			for(let item of data.witness){

				let hAgo = (data.global.head_block_number - item.last_confirmed_block_num)*3/60/60

				if(hAgo<0.1){
					item.last_confirmed_block_h = 0
				}else{
					item.last_confirmed_block_h = Number(hAgo.toFixed(1))
				}

        // if(activeWitnessCount<20){
        //   item.last_confirmed_block_h = 0
        // }
        // activeWitnessCount++


				// item.percent = 0
				item.votes_sp_percent = Number((item.votes_sp / data.global.total_sp * 100).toFixed(1))
		        let now = new Date(data.global.time);
		        let createdTime = new Date(item.last_sbd_exchange_update);
		        let difference = now.getTime() - createdTime.getTime();
		        let calSecond = Math.floor(difference/1000);
		        let fromNowHour = calSecond/60/60;

		        fromNowHour = Number(fromNowHour.toFixed(1))
		        item.last_sbd_exchange_update_h = fromNowHour

				let version_num = item.running_version.replace(/\./gi, ""); 
				version_num = Number(version_num)

				if(version_num<=194){
					item.active = false
				}
			}

			for(let item of data.witness){
				if(item.active){
					active_count++
					item.active_rank = active_count
				}
			}




	        let now = new Date(data.global.time+'.000Z');
	        let createdTime = new Date(data.witness[0].last_updated);
	        let difference = now.getTime() - createdTime.getTime();
	        let calSecond = Math.floor(difference/1000);
	        let fromNowMin = Number((calSecond/60).toFixed(1));

	        fromNowMin = fromNowMin <0 ? '?' : fromNowMin


			this.global = {active_count:active_count,synced_m:fromNowMin}
			this.witness = data.witness

			this.showSpinner = false;

        })
        .catch(error => {
          console.log(error.response)

          this.showSpinner = false;
        });


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

<template>

<div class="steem container" >





<div class="d-flex align-items-end flex-column bd-highlight mb-3" >
  <div class="mb-1 bd-highlight">Total STEEM : {{toNumber(globalProperties.current_supply)}}</div>
  <div class="mb-1 bd-highlight">Total SP : {{toNumber(globalProperties.total_sp)}}</div>
  <div class="mt-auto mb-1 bd-highlight">Total SBD : {{toNumber(globalProperties.current_sbd_supply)}}</div>
</div>




<div class="card mb-3" v-if="postReport.post_counts">
	<div class="card-body">

		<ul class="list-group" >
          <li class="d-flex justify-content-between steem-card-title">
              <p><b>Posting Count</b><br><small>{{postReport.post_counts[0].date}} ~ {{postReport.post_counts[postReport.post_counts.length-1].date}}</small></p>
              <span>{{toLS(postReport.post_count_max)}} </span>
          </li>
        </ul>


		<div class="progress progress-bar-square"  v-for="(value, index) in postReport.post_counts">
		  <div class="progress-bar progress-bar-striped bg-info bg-opacity8" role="progressbar" v-bind:style="{width:value.percent +'%' }" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"><span class="text-left">{{toLS(value.count)}}</span></div>
		</div>
	</div>
</div>



<div class="card mb-3" v-if="userReport.account_created_counts">
	<div class="card-body">

		<ul class="list-group" >
          <li class="d-flex justify-content-between steem-card-title">
              <p><b>New Accounts</b><br><small>{{userReport.account_created_counts[0].date}} ~ {{userReport.account_created_counts[userReport.account_created_counts.length-1].date}}</small></p>
              <span>{{toLS(userReport.accountCreatedCountMax)}} </span>
          </li>
        </ul>


		<div class="progress progress-bar-square"  v-for="(value, index) in userReport.account_created_counts">
		  <div class="progress-bar progress-bar-striped bg-info bg-opacity8" role="progressbar" v-bind:style="{width:value.percent +'%' }" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"><span class="text-left">{{toLS(value.count)}}</span></div>
		</div>
	</div>
</div>




<ul class="list-group mb-2" >
  <li class="d-flex justify-content-between steem-card-title">
      <p></p>
      <span><small>Synced {{userReport.from_now_hour}} hours ago </small></span>
  </li>
</ul>

<div class="card mb-3" >
	<div class="card-body">
		<ul class="list-group" >
          <li class="d-flex justify-content-between steem-card-title">
              <p><b>Witness vote</b><br><small>Includes people with more than 10 steem.</small></p>
              <span>{{toLS(userReport.totalSteem10)}} </span>
          </li>
        </ul>
		<div>
			<ul class="list-group" >
	          <li class="d-flex justify-content-between progress-title">
	              Voted : {{toLS(userReport.witnesses_voted_for_count)}}  
	              <span>{{userReport.witnesses_voted_for_count_percent}}% </span>
	          </li>
	        </ul>
			<div class="progress vertical">
				<div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="10" v-bind:style="{width:userReport.witnesses_voted_for_count_percent +'%' }" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
		</div>

		<div>
			<ul class="list-group" >
	          <li class="d-flex justify-content-between progress-title">
	              Proxied : {{toLS(userReport.proxy_count)}}  
	              <span>{{userReport.proxy_count_percent}}% </span>
	          </li>
	        </ul> 
			<div class="progress">
				<div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="10" v-bind:style="{width:userReport.proxy_count_percent +'%' }" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
		</div>

		<div>
			<ul class="list-group" >
	          <li class="d-flex justify-content-between progress-title">
	              Voted+Proxied : {{toLS(userReport.total_vote_count)}}  
	              <span>{{userReport.total_vote_percent}}% </span>
	          </li>
	        </ul>
			<div class="progress">
				<div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="10" v-bind:style="{width:userReport.total_vote_percent +'%' }" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
		</div>



	</div>
</div>



<div class="card mb-3" >
	<div class="card-body">
		<ul class="list-group" >
          <li class="d-flex justify-content-between steem-card-title">
              <p><b>STEEM</b><br><small>Includes people with more than 50 steem.</small></p>
              <span>{{toLS(userReport.totalSteem50)}} </span>
          </li>
        </ul>
		<div v-for="(value, index) in userReport.total_steem_counts" >
		  	
		  	<ul class="list-group" >
	          <li class="d-flex justify-content-between progress-title">
	              <span>{{toLS(value.key)}}<small> STEEM</small> : {{toLS(value.value)}}</span>
	              <span>{{value.percent}}% </span>
	          </li>
	        </ul>

			<div class="progress">
				<div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="10" v-bind:style="{width:value.percent +'%' }" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
		</div>
	</div>
</div>

<div class="card mb-2" >
	<div class="card-body">
		<ul class="list-group" >
          <li class="d-flex justify-content-between steem-card-title">
              <p><b>Reputation</b><br><small>Includes people with a reputation of 26 or higher.</small></p>
              <span>{{toLS(userReport.reputationMax)}} </span>
          </li>
        </ul>

		<div v-for="(value, index) in userReport.reputation_counts" >
		  	<ul class="list-group" >
	          <li class="d-flex justify-content-between progress-title">
	              <span>{{value.key}} : {{toLS(value.value)}}</span>
	              <span>{{value.percent}}% </span>
	          </li>
	        </ul>
			<div class="progress">
				<div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="10" v-bind:style="{width:value.percent +'%' }" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
		</div>
	</div>
</div>


<div v-if="showSpinner" class="sk-spinner sk-spinner-pulse"></div>


  </div>
</template>
<script>

var moment = require('moment');


export default {
	name: 'steem',
  data () {
    return {
      showSpinner : false,
      userReport : {},
      postReport : {},
      globalProperties : {}
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

		localStorage.setItem('topMenu','')
		this.$store.commit('topMenu','steemstatus')

		this.showSpinner = true;
		
		this.getGlobalProperties()
		this.getPostReport();
		this.getUserReport();

	},

  methods: {

    getGlobalProperties(){

        this.$http.get(this.$apiserver+'/steem/cache')
        .then((result) => {
            this.globalProperties = result.data
        })
        .catch(error => {
          console.log(error.response)
        });

    },


  	getPostReport(){


      this.$http.get(this.$apiserver+'/postreport')
        .then((result) => {

			let data = result.data
			let maxCount = 0

			for(let item of data.post_counts){
				if(item.count>maxCount)
					maxCount = item.count
			}

			for(let item of data.post_counts){
				item.percent = Number((item.count / maxCount * 100).toFixed(1))
			}

			data.post_count_max = maxCount
			this.postReport = data

        })
        .catch(error => {
          console.log(error.response)
        });


  	},

    getUserReport(){

      this.$http.get(this.$apiserver+'/userreport')
        .then((result) => {

			let data = result.data
			let reputationMax = data.reputation_counts[data.reputation_counts.length-1].value
			let totalSteem10 = data.total_steem_counts[data.total_steem_counts.length-1].value
			let totalSteem50 = data.total_steem_counts[data.total_steem_counts.length-2].value


			let temp_reputation_counts = []
			for(let item of data.reputation_counts){
				if(item.key!='26'){
					item.percent = Number((item.value / reputationMax * 100).toFixed(1))
					temp_reputation_counts.push(item)
				}
			}
			data.reputation_counts = temp_reputation_counts

			let temp_total_steem_counts = []
			for(let item of data.total_steem_counts){
				if(item.key=='100000' || item.key=='10000' || item.key=='1000' || item.key=='100'){
					item.percent = Number((item.value / totalSteem50 * 100).toFixed(1))
					temp_total_steem_counts.push(item)
				}
			}
			data.total_steem_counts = temp_total_steem_counts


			let accountCreatedCountMax = 0
			for(let item of data.account_created_counts){
				if(item.count > accountCreatedCountMax ){
					accountCreatedCountMax = item.count
				}
			}

			for(let item of data.account_created_counts){
				item.percent = Number((item.count / accountCreatedCountMax * 100).toFixed(0))
			}


			let witnesses_voted_for_count_percent = Number((data.witnesses_voted_for_count / totalSteem10 * 100).toFixed(1))
			let proxy_count_percent = Number((data.proxy_count / totalSteem10 * 100).toFixed(1))


			data.witnesses_voted_for_count_percent = witnesses_voted_for_count_percent
			data.proxy_count_percent = proxy_count_percent

			data.total_vote_count = data.witnesses_voted_for_count+ data.proxy_count
			data.total_vote_percent = Number((witnesses_voted_for_count_percent + proxy_count_percent).toFixed(1))


			data.totalSteem10 = totalSteem10
			data.totalSteem50 = totalSteem50
			data.reputationMax = reputationMax
			data.accountCreatedCountMax = accountCreatedCountMax

			this.userReport = data


			this.showSpinner = false;
        })
        .catch(error => {
        	this.showSpinner = false;
          console.log(error.response)
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

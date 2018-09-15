<template>

<div class="postDetail container" >


<div class="d-flex justify-content-center" style="margin-top: 100px" v-if="showSpinner">
	<div >
	  <img :src="imageCache('loadingbot1','https://dpaystats.com/images/loadingbot.png')" style="width: 130px">
	</div>
	<div  class="sk-spinner sk-spinner-pulse position-absolute " style="margin-left: -44px;margin-top: 41px;width: 33px;height: 32px;z-index: -10"></div>
	<div v-if="showReload">too long? <button type="button" class="btn btn-link" style="margin-top: -3px;margin-left: -5px" v-on:click="reloadClick('all')">Reload</button></div >
</div>




<div v-if="!showSpinner">

	<h3 class="mt-3">{{content.title}}</h3>

	<div class="mb-2">
		<span ><router-link :to="'/@'+content.author">{{content.author}}</router-link></span> <span class="text-muted">in</span>
		<span >#{{content.category}}</span>
		<small class="text-account-ago">, {{content.ago}}</small>
	</div>


	<div v-if="!content.isPayout">
		<span >Pending payout : <span class="text-muted">${{parseFloat(content.pending_payout_value)}}</span></span>
		<!-- <span >{{content.children}}</span>  -->
	</div>
	<div v-else>
		<span>Author : <span class="text-muted">${{parseFloat(content.total_payout_value).toFixed(3)}}</span></span>,
		<span>Curator : <span class="text-muted">${{parseFloat(content.curator_payout_value)}}</span></span>

		<div v-if="content.beneficiaries.length>0">
			Beneficiaries : <span v-for="(value, index) in content.beneficiaries"><router-link :to="'/@'+value.account">{{value.account}}</router-link><small class="text-muted">(${{(value.reward).toFixed(3)}}), </small></span>
		</div>
	</div>

	<div class="mt-2">
		<span >{{content.net_votes}} votes</span> :
		<span v-for="(value, index) in content.active_votes" >
	    	<router-link :to="'/@'+value.voter">{{value.voter}}</router-link><small class="text-muted"> (${{value.bbd}}), </small>
	    </span>
	</div>


	<div class="jumbotron" style="padding: 1rem">
		<pre>{{content.body}}</pre>
	</div>

</div>








</div>
</template>



<script>

var moment = require('moment');
import Util from '../Util'


export default {
  name: 'postDetail',
  data () {
    return {
      userName : '',
      showSpinner : true,
      showReload : false,
      globalProperties : {vestingValue:0},
      content : {}
    }
  },
  computed: {
    // hasResult: function () {
    //   return this.posts.length > 0
    // }
  },

	watch:{
	    $route (to, from){
	    	console.log('postDetail route')
	        if(to){
	        	this.userName = to.path.replace("/@","")
		        // this.getAccounts()
	        }
	    }
	},

	beforeDestroy: function () {
		window.removeEventListener('resize', this.handleResize)
	},

	mounted() {
		window.addEventListener('resize', this.handleResize)
		this.showMore(window.innerWidth)
	},
	created: function () {

		this.userName = this.$route.params.id || ''
		localStorage.setItem('topMenu','account')
		this.$store.commit('topMenu','accounts')


		// this.$dpay.api.getAccountVotes('dpaylite', function(err, result) {
		// 	console.log(err, result);
		// });


		this.$dpay.api.getActiveVotes('kstop1', '8-breed-exile-rent', function(err, result) {
		  console.log(err, result);
		});


		this.getGlobalProperties();

	},

  methods: {


  	getContent(){
  		this.showSpinner = true
		this.$dpay.api.getContent(this.$route.params.id, this.$route.params.permlink, (err, result) => {
			console.log(err, result);
			if(result){

				let html = result.body.replace(/(?:\r\n|\r|\n)/g, '<br />')
				result.ago = moment(result.created+'Z').fromNow();

				result.active_votes.sort(function(a, b) {
	                return parseFloat(b.rshares) - parseFloat(a.rshares)
	            });

				// const DPAY_VOTE_REGENERATION_SECONDS = 5 * 60 * 60 * 24; // it takes 5 days to regenerate 100% voting power
				// const DPAY_100_PERCENT = 10000
				// const current_voting_power = DPAY_100_PERCENT;
				// const vote_pct_weight = DPAY_100_PERCENT;



				let last_payout = Number(result.last_payout.split('-')[0])
				result.isPayout = true

				// 페이아웃 전이면.
				if(last_payout<2000){
					result.isPayout = false
					let vote_rshares = Number(result.vote_rshares)
					let pending_payout_value = parseFloat(result.pending_payout_value)

					for(let item of result.active_votes){
			        	let percent = Number(item.rshares)/vote_rshares
			        	item.bbd = (pending_payout_value * percent).toFixed(3)
		        	}

				}else{

					let vote_rshares = 0;
					let total_payout_value = parseFloat(result.total_payout_value) + parseFloat(result.curator_payout_value)

					for(let item of result.active_votes){
			        	vote_rshares += Number(item.rshares)
		        	}

		        	for(let item of result.active_votes){
			        	let percent = Number(item.rshares)/vote_rshares
			        	item.bbd = (total_payout_value * percent).toFixed(3)
		        	}


		        	if(result.beneficiaries.length > 0){
		        		let beneficiariesSum = 0

		        		for(let item of result.beneficiaries){
				        	beneficiariesSum += item.weight
			        	}

			        	// 이전값 복사해놓기.
			        	let tmp_total_payout_value = parseFloat(result.total_payout_value)
			        	result.total_payout_value = parseFloat(result.total_payout_value) * (10000 - beneficiariesSum) * 0.0001
			        	result.total_beneficiaries = tmp_total_payout_value * beneficiariesSum * 0.0001

			        	for(let item of result.beneficiaries){
				        	item.reward = item.weight/beneficiariesSum *  result.total_beneficiaries
			        	}

			        	// 정렬.
			        	result.beneficiaries.sort(function(a, b) {
			                return b.weight - a.weight
			            });

		        	}



				}




				this.content = result

			}else{

			}

			this.showSpinner = false


		});
  	},


  	handleResize (event) {
		this.showMore(window.innerWidth)
    },

    showMore(width){
    	if(this.prevWidth!=width){
    		this.prevWidth = width
			if(width<=767){
				this.isShowMoreBtn = true
			}else if(width>767){
				this.isShowMoreBtn = false
			}
    	}
    },

    showMoreClick(value){
		this.isShowMoreBtn = value
    },


    getGlobalProperties(){
        this.$http.get(this.$apiserver + '/dpay/cache')
        .then((result) => {
            this.globalProperties = result.data
    		this.getContent()
        })
        .catch(error => {
          console.log(error.response)
        });
    },

    getVestingDelegatedFrom(){

        this.$http.get(this.$apiserver + '/users/' + this.userName +'/delegator')
        .then((result) => {

        	if(result.data.length > 0){

	        	let old_updated = 9530962288862

	        	for(let item of result.data){
		        	let obj = Util.getObject(item,'delegatee',this.userName)[0]
		        	item.vesting_shares = obj.vesting_shares
		        	item.ago = moment(obj.min_delegation_time+'Z').fromNow();

		        	if(old_updated >  new Date(item.last_updated).getTime()){
		        		old_updated = new Date(item.last_updated).getTime()
		        	}
	        	}

	        	result.data.sort(function(a, b) {
	                return parseFloat(b.vesting_shares) - parseFloat(a.vesting_shares)
	            });

	        	result.data[0].synced = moment(old_updated).fromNow()
        	}

        	this.vestingDelegatedFrom = result.data

        })
        .catch(error => {
          console.log(error.response)
        });
    },


    reloadClick(value){
    	if(value=='all'){
    		this.getAccounts()
    	}else{
    		this.getAccountHistory(this.historyFrom)
    	}
    },


	initPage(page){

		let historyFrom = -1

       if(page){
			this.page = page;

			if(page===1){
				this.historyTotal = 0
				this.historySize = 60
			}else{

				historyFrom = this.historyTotal - ((page-1)*this.historySizeIncrement)

				if(historyFrom<this.historySizeIncrement){
					this.historySize = historyFrom
				}else{
					this.historySize = this.historySizeIncrement
				}
			}
        }

        this.getAccountHistory(historyFrom)

        $('html,body').scrollTop(0);
    },

    createPageList(page){

    	let index = 60

    	if(this.historyTotal<=index){
    		this.pageList = [1]
    	}else if(this.historyTotal<= (index + this.historySizeIncrement)){
    		this.pageList = [1,2]
    	}else if(this.historyTotal<=(index + this.historySizeIncrement*2)){
    		this.pageList = [1,2,3]
    	}else if(this.historyTotal<=(index + this.historySizeIncrement*3)){
    		this.pageList = [1,2,3,4]
    	}else if(this.historyTotal<=(index + this.historySizeIncrement*4)){
    		this.pageList = [1,2,3,4,5]
    	}else if(this.historyTotal<=(index + this.historySizeIncrement*5)){
    		this.pageList = [1,2,3,4,5,6]
    	}else if(this.historyTotal<=(index + this.historySizeIncrement*6)){
    		this.pageList = [1,2,3,4,5,6,7]
    	}else{
	      if(page>4){
	        this.pageList = []
	        for(let i = 3; i>0; i--){
	          this.pageList.push(page-i)
	        }
	        this.pageList.push(page)
	        for(let i = 1; i<=3; i++){
	          this.pageList.push(page+i)
	        }
	      }else{
	        this.pageList = [1,2,3,4,5,6,7,8]
	      }
    	}

    },


    imageCache(name,url){

    	let img = localStorage.getItem(name)

    	if(img===null){
    		img = url
			this.saveImage2Cache(name,url)
    	}else{
    		img = 'data:image/png;base64,' + img
    	}
    	return img
    },

    roboCache(name,size){

    	// let img = localStorage.getItem(name+size)

    	// if(img===null){

    	// 	img = 'https://robohash.org/'+name+'.png?size='+size+'x'+size
    	// 	this.saveImage2Cache(name+size,img)

    	// 	// apply temp image for data reduce.
    	// 	if(size==54){
    	// 		img = 'https://robohash.org/'+name+'.png?size=38x38'
    	// 	}else if(80){
    	// 		img = 'https://robohash.org/'+name+'.png?size=55x55'
    	// 	}

    	// }else{
    	// 	img = 'data:image/png;base64,' + img
    	// }
    	// return img

    	let img = 'https://robohash.org/'+name+'.png?size=38x38'
		if(size==54){
			img = 'https://robohash.org/'+name+'.png?size=38x38'
		}else if(80){
			img = 'https://robohash.org/'+name+'.png?size=55x55'
		}
    	return img

    },

    saveImage2Cache(name,url){
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {
				let base = reader.result.replace(/^data:image\/(png|jpg);base64,/, '')
				localStorage.setItem(name,base)
			}
			reader.readAsDataURL(xhr.response);
		};

		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
    },


    startInterval(){
    	this.calFullIn()
    	setInterval(()=>{
			this.calFullIn()
    	}, 1000);
    },

    calFullIn(){
		this.account.voting_power_sec = this.account.voting_power_sec +0.00023146
	    this.account.voting_power_sec = this.account.voting_power_sec > 100 ? 100 : this.account.voting_power_sec
	    if(this.account.voting_power_sec<100){
		    let sec = (100 - this.account.voting_power_sec) / 0.00023146
		    let min = sec/60
		    let hour = min/60

		    // console.log(min)

		    if(min<60){
		    	this.account.voting_power_fullin = 	min.toFixed(0) + 'm'
		    }else{
		    	this.account.voting_power_fullin = 	hour.toFixed(1) + 'h'
		    }
	    }
    },


	getVotingValue(votingWeight){

	    let o=1e4;
	    let cc=this.account.effective_sp/this.globalProperties.vesting_value;
	    let powerWeight  = 100*this.account.voting_power_sec*(100*votingWeight)/o;

	    powerWeight=(powerWeight+49)/50;

	    let calResult=cc*powerWeight*100*this.globalProperties.reward_balance*this.globalProperties.bbd_dpay_quote;
	    calResult = calResult.toFixed(3)


	    return calResult;
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

    toTra(val){
    	let lists = val.split(" ")
        return parseFloat(lists[0])+" "+lists[1]
    },


    toNumber(val){
      return Number(parseFloat(val).toFixed(0)).toLocaleString()
    },


    toStr20(val){
    	if(val.length>20){
    		val = val.substring(0,20) + '...'
    	}
    	return val
    },

    toSP(val,len){
    	let sp = Number((parseFloat(val) * this.globalProperties.vesting_value).toFixed(len)).toLocaleString()
    	return sp
    },

    toLS(val){
      return Number(val).toLocaleString()
    },

    toStr5:function(val){
    	return val.substring(0,6)
    },

    toB:function(val){
      return (Number(val)/1000000000).toFixed(1)
    },

    toFixed1:function(val){
      return Number(val).toFixed(1)
    },

    toFixed2:function(val){
      return Number(val).toFixed(2)
    },

    toFixed3:function(val){
      return Number(val).toFixed(3)
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

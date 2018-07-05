<template>

<div class="account container" >

<div class="row" style="margin-top: -5px;margin-left: -15px">
	<ol class="breadcrumb bg-white float-left">
		<li class="breadcrumb-item" style="margin-top: -13px"><router-link to="/accounts">Accounts</router-link></li>
	</ol>		
</div>


<div class="d-flex justify-content-center" style="margin-top: 100px" v-if="!account.name">
	<div >
	  <img :src="imageCache('loadingbot1','https://steemst.com/images/loadingbot.png')" style="width: 130px">
	</div>
	<div  class="sk-spinner sk-spinner-pulse position-absolute " style="margin-left: -44px;margin-top: 41px;width: 33px;height: 32px;z-index: -10"></div>
	<div v-if="showReload">too long? <button type="button" class="btn btn-link" style="margin-top: -3px;margin-left: -5px" v-on:click="reloadClick('all')">Reload</button></div >
</div>


<div class="row" v-if="account.name" >
	<div class="clearfix col-md-4" style="">
		<img class="float-left" style="margin-top: -12px;width: 55px;height: 55px" :src="roboCache(account.name,80)" >
		<h3 class="float-left" style="margin-top: 11px;margin-left: 5px"> {{account.name}}</h3>
	</div>
</div>


<div class="row" style="margin-top: -5px">
          <div class="col-md-4 mb-3"  v-if="account.name" >
            <div class="bs-component">
              <ul class="list-group">
              	<li class="list-group-item ">

					<h5 class="text-center"> {{toNumber(account.effective_sp)}} SP</h5>
					<div class="text-center text-muted font-weight-light2" style="margin-top:-10px"><small>{{toNumber(account.vesting_shares_sp)}} + {{toNumber(account.received_vesting_shares_sp)}} - {{toNumber(account.delegated_vesting_shares_sp)}}</small></div>
                </li>

                <li class="list-group-item  ">
				    <div class="clearfix">
					    <div class="float-left">{{votingPowerGage}}% </div>
					    <div class="float-right">${{getVotingValue(votingPowerGage)}}</div>
					    <input type="range" class="slider" id="customRange1" v-model="votingPowerGage">
				    </div>
				    <div>
				    	<div class="text-left">{{toFixed2(account.voting_power_sec)}}%</div>
					    <div class="progress">
					      <div class="progress-bar progress-bar-striped progress-bar-animated bg-info bg-opacity8" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" v-bind:style="{width:account.voting_power_sec +'%' }"></div>
					    </div>
				    </div>
                </li>
                
                <li class="list-group-item d-flex justify-content-between align-items-center">
                	<div class="col-md-6">
                		<div class="text-center">{{account.age}}</div>
                		<div class="text-center text-muted" style="margin-top: -5px"><small>Age</small></div>
					</div>
                	<div class="col-md-6">
                		<div class="text-center">{{account.repu}}</div>
                		<div class="text-center text-muted" style="margin-top: -5px"><small>Reputation</small></div>
                	</div>
                  
                </li>

              </ul>
            </div>
          </div>
          <div class="col-md-8" >

				<div class="d-flex justify-content-center" style="margin-top: 20px" v-if="showSpinner && account.name">
					<div >
					  <img :src="imageCache('loadingbot1','https://steemst.com/images/loadingbot.png')" style="width: 130px">
					</div>
					<div  class="sk-spinner sk-spinner-pulse position-absolute " style="margin-left: -44px;margin-top: 41px;width: 33px;height: 32px;z-index: -10"></div>
					<div v-if="showReload">too long? <button type="button" class="btn btn-link" style="margin-top: -3px;margin-left: -5px" v-on:click="reloadClick('history')">Reload</button></div >
				</div>
				


            <div class="bs-component" v-if="!showSpinner">


              
            	<ul class="list-group" >
  <li class="list-group-item clearfix list-group-item-account" style="padding:0rem 0.3rem 0rem 0.3rem !important"  v-for="(value, index) in history">


  	<div  v-if="value[1].op[0]=='vote'">
	    <div v-if="value[1].op[1].voter==account.name" class="text-right">
	    	<div class="text-account-ago">{{value.ago}}</div>
	    	<div style="margin-top: 20px">{{value[1].op[1].status}} <small class="text-muted">to</small> <router-link :to="'/@'+value[1].op[1].author">{{value[1].op[1].author}}</router-link> <img class="img-robo-r" :src="roboCache(value[1].op[1].author,54)"> </div>
		    <div><a class="text-muted" href="" style="pointer-events: none" >/{{toStr20(value[1].op[1].permlink)}} </a><small class="text-muted" v-if="value[1].op[1].weight<10000
		    	">({{toFixed1(value[1].op[1].weight*0.01)}}%)</small></div>
		</div>

	    <div v-else >
	    	<div class="text-account-ago">{{value.ago}}</div>
	  		<div>{{value[1].op[1].status}} <small class="text-muted">from</small> <router-link :to="'/@'+value[1].op[1].voter">{{value[1].op[1].voter}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].voter,54)"></div>
			<a href="" class="text-muted" style="pointer-events: none" >/{{toStr20(value[1].op[1].permlink)}} </a><small class="text-muted">({{toFixed1(value[1].op[1].weight*0.01)}}%)</small>


		</div>
  	</div>


  	<div v-else-if="value[1].op[0]=='comment'">

		<div v-if="value[1].op[1].author==account.name && value[1].op[1].parent_author==''" class="text-right " >
			<div class="text-account-ago">{{value.ago}}</div>
	    	<div >Update Post</div>
		    <a href="" style="pointer-events: none" class=" text-muted">/{{toStr20(value[1].op[1].permlink)}} </a>
		</div>

		<div v-else-if="value[1].op[1].author==account.name" class="text-right ">
			<div class="text-account-ago">{{value.ago}}</div>
	    	<div  style="margin-top: 20px">Comment <small class="text-muted">to</small> <router-link :to="'/@'+value[1].op[1].parent_author">{{value[1].op[1].parent_author}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].author,54)" ></div>
		    <a href="" style="pointer-events: none" class="float-right text-muted">/{{toStr20(value[1].op[1].permlink)}} </a><br/>
	    	<div class="float-right text-muted w-75" style="word-wrap: break-word;">{{value[1].op[1].body}}</div>
		</div>


	    <div v-else >
	    	<div class="text-account-ago">{{value.ago}}</div>
	  		<div>Comment <small class="text-muted">from</small> <router-link :to="'/@'+value[1].op[1].author">{{value[1].op[1].author}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].author,54)" ></div>
			<a href="" style="pointer-events: none" class="text-muted">/{{toStr20(value[1].op[1].permlink)}} </a>
			<div class="text-muted w-75" style="word-wrap: break-word;">"{{value[1].op[1].body}}"</div>
		</div>
  	</div>



  	<div v-else-if="value[1].op[0]=='claim_reward_balance'" class="text-right ">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div >Claim Reward  <span class="text-muted">{{value[1].op[1].text}}</span></div>
  	</div>

  	<div v-else-if="value[1].op[0]=='author_reward'" class="text-right ">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div >Author Reward <span class="text-muted">{{value[1].op[1].text}}</span> </div>
	    <a class="float-right text-muted" href="" style="pointer-events: none" >/{{toStr20(value[1].op[1].permlink)}}</a>
  	</div>


  	<div v-else-if="value[1].op[0]=='curation_reward'" class="text-right ">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div  >Curation Reward <span class="text-muted">{{toSP(value[1].op[1].reward,3)}} SP </span></div>
	    <a href="" style="pointer-events: none" class="float-right text-muted">@{{value[1].op[1].comment_author}}/{{toStr20(value[1].op[1].comment_permlink)}} </a>
  	</div>

  	<div v-else-if="value[1].op[0]=='comment_benefactor_reward'" class="text-right ">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div style="margin-top: 20px">Comment Benefactor Reward <span class="text-muted"> {{toSP(value[1].op[1].reward,3)}} SP to @{{value[1].op[1].benefactor}} </span> <img class="img-robo-r" :src="roboCache(value[1].op[1].benefactor,54)" ></div>
	    
	    <a class="text-muted" href="" style="pointer-events: none" >/{{toStr20(value[1].op[1].permlink)}}</a>
  	</div>


  	<div v-else-if="value[1].op[0]=='account_witness_vote'">
		<div v-if="value[1].op[1].account==account.name" class="text-right">
			<div class="text-account-ago">{{value.ago}}</div>
			<div  style="margin-top: 20px" >{{value[1].op[1].status}} <small class="text-muted">to</small> <router-link :to="'/@'+value[1].op[1].witness">{{value[1].op[1].witness}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].witness,54)" ></div>
		</div>
	    <div v-else >
	    	<div class="text-account-ago">{{value.ago}}</div>
	  		<div>{{value[1].op[1].status}}  <small class="text-muted">from</small> <router-link :to="'/@'+value[1].op[1].account">{{value[1].op[1].account}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].account,54)" ></div>
		</div>
  	</div>

  	<div v-else-if="value[1].op[0]=='feed_publish'" class="text-right">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div>Price Feed <span class="text-muted">${{parseFloat(value[1].op[1].exchange_rate.base)}}</span></div>
  	</div>

  	<div v-else-if="value[1].op[0]=='transfer'" >
		<div v-if="value[1].op[1].from==account.name" class="text-right">
			<div class="text-account-ago">{{value.ago}}</div>
	    	<div  style="margin-top: 20px">Transfer<span class="text-muted"> {{toTra(value[1].op[1].amount)}} <small>to </small><router-link :to="'/@'+value[1].op[1].to">{{value[1].op[1].to}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].to,54)" ></div>
	    	<div class="float-right  w-75 text-account-transfer" style="word-wrap: break-word;">"{{value[1].op[1].memo}}"</div>
		</div>
	    <div v-else >
	    	<div class="text-account-ago">{{value.ago}}</div>
	  		<div >Transfer <span class="text-muted"> {{toTra(value[1].op[1].amount)}} <small>from </small><router-link :to="'/@'+value[1].op[1].from">{{value[1].op[1].from}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].from,54)"></div>
			<div class="text-account-transfer w-75 " style="word-wrap: break-word;">"{{value[1].op[1].memo}}"</div>
		</div>
  	</div>

	<div v-else-if="value[1].op[0]=='transfer_to_savings'" >
		<div v-if="value[1].op[1].from==account.name" class="text-right">
			<div class="text-account-ago">{{value.ago}}</div>
	    	<div  style="margin-top: 20px">Transfer To Savings<span class="text-muted"> {{toTra(value[1].op[1].amount)}} <small>to </small><router-link :to="'/@'+value[1].op[1].to">{{value[1].op[1].to}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].to,54)" ></div>
	    	<div class="float-right  w-75 text-account-transfer" style="word-wrap: break-word;">"{{value[1].op[1].memo}}"</div>
		</div>
	    <div v-else >
	    	<div class="text-account-ago">{{value.ago}}</div>
	  		<div >Transfer To Savings<span class="text-muted"> {{toTra(value[1].op[1].amount)}} <small>from </small><router-link :to="'/@'+value[1].op[1].from">{{value[1].op[1].from}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].from,54)"></div>
			<div class="text-account-transfer w-75 " style="word-wrap: break-word;">"{{value[1].op[1].memo}}"</div>
		</div>
  	</div>


  	<div v-else-if="value[1].op[0]=='transfer_to_vesting'">
		<div v-if="value[1].op[1].from==account.name" class="text-right">
			<div class="text-account-ago">{{value.ago}}</div>
	    	<div  style="margin-top: 20px">Power Up<span class="text-muted"> {{value[1].op[1].amount}} <small>to</small> <router-link :to="'/@'+value[1].op[1].to">{{value[1].op[1].to}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].to,54)" ></div>
		</div>
	    <div v-else >
	    	<div class="text-account-ago">{{value.ago}}</div>
	  		<div >Power Up<span class="text-muted"> {{value[1].op[1].amount}} <small>from</small> <router-link :to="'/@'+value[1].op[1].from">{{value[1].op[1].from}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].from,54)" ></div>
		</div>
  	</div>

  	<div v-else-if="value[1].op[0]=='delegate_vesting_shares'">
		<div v-if="value[1].op[1].delegator==account.name" class="text-right">
			<div class="text-account-ago">{{value.ago}}</div>
	    	<div  style="margin-top: 20px">Delegate SP <span class="text-muted"> {{toSP(value[1].op[1].vesting_shares,3)}} SP <small>to</small> <router-link :to="'/@'+value[1].op[1].delegatee">{{value[1].op[1].delegatee}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].delegatee,54)" ></div>
		</div>
	    <div v-else >
	    	<div class="text-account-ago">{{value.ago}}</div>
	  		<div >Delegate SP<span class="text-muted"> {{toSP(value[1].op[1].vesting_shares,3)}} SP <small>from</small> <router-link :to="'/@'+value[1].op[1].delegator">{{value[1].op[1].delegator}}</router-link></span><img class="img-robo-r" :src="roboCache(value[1].op[1].delegator,54)" ></div>
		</div>


  	</div>

  	<div v-else-if="value[1].op[0]=='producer_reward'" class="text-right ">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div >Producer Reward <span class="text-muted">{{toSP(value[1].op[1].vesting_shares,3)}} SP </span></div>
  	</div>


  	<div v-else-if="value[1].op[0]=='custom_json'">

		<div v-if="value[1].op[1].json_obj[0]=='follow'" class="text-right ">
			<div class="text-account-ago">{{value.ago}}</div>
	    	<div  style="margin-top: 20px"><span v-if="value[1].op[1].json_obj[1].what[0]=='blog'">Follow</span>
			<span v-else>Unfollow</span> <router-link :to="'/@'+value[1].op[1].json_obj[1].following">{{value[1].op[1].json_obj[1].following}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].json_obj[1].following,54)" ></div>
		</div>
		<div v-else-if="value[1].op[1].json_obj[0]=='reblog'">
	    	<div class="text-right " style="margin-top: 20px">Resteem<span class="text-muted"> @{{value[1].op[1].json_obj[1].author}}</span><img class="img-robo-r" :src="roboCache(value[1].op[1].json_obj[1].author,54)" ></div>
	    	<a class="float-right text-muted" href="" style="pointer-events: none" >/{{toStr20(value[1].op[1].json_obj[1].permlink)}}</a>
		</div>


  	</div>

  	<div v-else-if="value[1].op[0]=='withdraw_vesting'" class="text-right ">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div  >Power Down <span class="text-muted">{{toSP(value[1].op[1].vesting_shares,3)}} STEEM </span></div>
  	</div>

  	<div v-else-if="value[1].op[0]=='fill_vesting_withdraw'" class="text-right ">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div  >Withdraw <span class="text-muted">{{value[1].op[1].deposited}} from SP</span></div>
  	</div>

  	<div v-else-if="value[1].op[0]=='account_witness_proxy'" class="text-right">
	    <div class="text-account-ago">{{value.ago}}</div>
		<div  style="margin-top: 20px">Witness Proxy <small>to</small> <router-link :to="'/@'+value[1].op[1].proxy">{{value[1].op[1].proxy}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].proxy,54)" ></div>
  	</div>


  	<div v-else-if="value[1].op[0]=='comment_options'">
    	

  		<div v-if="value[1].op[1].extensions.length==0" class="text-right ">
  			<div class="text-account-ago">{{value.ago}}</div>
	    	<div  >Post Options <span class="text-muted"> beneficiaries</span></div>
	    	<a href="" style="pointer-events: none" class="float-right text-muted">/{{toStr20(value[1].op[1].permlink)}} </a><br/>
		    <div class="text-muted">[]</div>

		</div>
  		<div v-else-if="value[1].op[1].extensions[0][1].beneficiaries" class="text-right " >
  			<div class="text-account-ago">{{value.ago}}</div>
	    	<div >Post Options <span class="text-muted"> beneficiaries</span></div>
		    <a href="" style="pointer-events: none" class="float-right text-muted">/{{toStr20(value[1].op[1].permlink)}} </a><br/>
		    <div class="text-muted" v-for="(value, index) in value[1].op[1].extensions[0][1].beneficiaries" >
		    	<router-link :to="'/@'+value.account">{{value.account}}</router-link> : {{value.weight*0.01}}%
		    </div>
  		</div>


  	</div>

  	<div v-else-if="value[1].op[0]=='pow'">
	    <span class="float-right">{{toStr5(value[1].trx_id)}}</span>
	    <div>pow</div>
  	</div>

  	<div v-else-if="value[1].op[0]=='account_update'" class="text-right " >
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div >Account Update</div>
  	</div>

  	<div v-else-if="value[1].op[0]=='account_create'">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div style="margin-top: 20px" >Account Created <small>from</small> <router-link :to="'/@'+value[1].op[1].creator">{{value[1].op[1].creator}}</router-link><img class="img-robo-r" :src="roboCache(value[1].op[1].creator,54)" ></div>
  	</div>

  	<div v-else-if="value[1].op[0]=='account_create_with_delegation'">
	    <div>Account Create</div>
  	</div>


  	<div v-else-if="value[1].op[0]=='fill_transfer_from_savings'">
	    <span class="float-right">{{toStr5(value[1].trx_id)}}</span>
	    <div>fill_transfer_from_savings</div>
  	</div>



  	<div v-else-if="value[1].op[0]=='witness_update'" class="text-right">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div>Witness Update</div>
	    <div class="text-muted">{{value[1].op[1].url}}</div>
	    <div class="text-muted">{{value[1].op[1].block_signing_key}}</div>
	    <div class="text-muted">{{value[1].op[1].props.account_creation_fee}}, {{value[1].op[1].props.maximum_block_size}}, {{value[1].op[1].props.sbd_interest_rate}}</div>
	    <div class="text-muted">fee : {{value[1].op[1].fee}}</div>
  	</div>


  	<div v-else-if="value[1].op[0]=='limit_order_create'" class="text-right">
  		<div class="text-account-ago">{{value.ago}}</div>
	    <div>Limit Order<span class="text-muted"> {{value[1].op[1].amount_to_sell}}</span> <small class="text-muted">to</small> <span class="text-muted"> {{value[1].op[1].min_to_receive}} </span></div>
  	</div>


    <div v-else-if="value[1].op[0]=='return_vesting_delegation'">
  		<div class="text-account-ago ">{{value.ago}}</div>	    
	    <div>Return Delegation <span class="text-muted">{{toSP(value[1].op[1].vesting_shares,3)}} SP </span>	</div>
  	</div>

  	<div v-else>
	    <div>don't support function name : {{value[1].op[0]}} <br/> Please send the function name to koinbot in steem.chat</div>
  	</div>


  	






	    




  </li>
</ul>


<div class="text-right mt-2 text-muted"><small>Robots lovingly delivered by Robohash.org</small></div>


            </div>
          </div>
          
        </div>




<!-- 
<div>
  <nav aria-label="Page navigation example" style="margin-top:22px">
    <ul class="pagination justify-content-center">
      <li class="page-item"  v-for="(value, index) in pageList" v-bind:class="{ active: page==value }">
        <a class="page-link" v-on:click.prevent="pageClick(value)">{{value}}</a>
      </li>
    </ul>
  </nav>
</div> -->


<br/>



<div v-if="!showSpinner">
  <nav aria-label="Page navigation example" style="margin-top:22px">
    <ul class="pagination justify-content-center">
      <li class="page-item"  v-for="(value, index) in pageList" v-bind:class="{ active: page==value }">
        <a class="page-link" v-on:click.prevent="pageClick(value)">{{value}}</a>
      </li>
    </ul>
  </nav>
</div>





  </div>
</template>
<script>

var moment = require('moment');


export default {
  name: 'account',
  data () {
    return {
      userName : '',
      userNameInput : '',
      votingPowerGage:100,
      showSpinner : true,
      showReload : false,
      globalProperties : {vestingValue:0},
      account:{name:''},
      history:[],
      page : 1,
      historyTotal : 0,
      historySize : 60,
      historyFrom : 0,
      historySizeIncrement : 180,
      pageList : [1,2,3,4,5,6,7,8],

    }
  },
  computed: {
    // hasResult: function () {
    //   return this.posts.length > 0
    // }
  },

	watch:{
	    $route (to, from){
	        if(to){
	        	this.userName = to.path.replace("/@","")
		        this.getAccounts()
	        }
	    }
	},

	mounted() {
	},
	created: function () {

		this.userName = this.$route.params.id || ''
		// localStorage.setItem('accountName',this.userName)

		console.log('this.userName : ' + this.userName)

		localStorage.setItem('topMenu','account')
		this.$store.commit('topMenu','accounts')

		this.getGlobalProperties();
	},

  methods: {

    getGlobalProperties(){

        this.$http.get(this.$apiserver + '/steem/cache')
        .then((result) => {
            this.globalProperties = result.data

            console.log(this.globalProperties)

          if(this.userName!==''){
            this.getAccounts()

          }

        })
        .catch(error => {
          console.log(error.response)
        });


    },

    getAccounts(){

	    this.showSpinner = true

		this.$steem.api.getAccounts([this.userName], (err, result)=> {
		  	if(result){

		  		localStorage.setItem('accountName',this.userName)

		  		let account = result[0]

		  		let vesting_shares = parseFloat(account.vesting_shares)
		  		let received_vesting_shares = parseFloat(account.received_vesting_shares)
		  		let delegated_vesting_shares = parseFloat(account.delegated_vesting_shares)

		        let vesting = vesting_shares + received_vesting_shares - delegated_vesting_shares
		        let effective_sp = vesting * this.globalProperties.vesting_value


		  		account.effective_sp = effective_sp
		  		account.vesting_shares_sp = vesting_shares * this.globalProperties.vesting_value
		  		account.received_vesting_shares_sp = received_vesting_shares * this.globalProperties.vesting_value
		  		account.delegated_vesting_shares_sp = delegated_vesting_shares * this.globalProperties.vesting_value


		        let now = new Date(this.globalProperties.time);
		        let createdTime = new Date(account.created);
		        let difference = now.getTime() - createdTime.getTime();
		        let calSecond = Math.floor(difference/1000);
		        let fromNowHour = calSecond/60/60;
		        let fromNowYear = fromNowHour/24/365;

		        account.age = fromNowYear.toFixed(1)
		        account.repu = this.$steem.formatter.reputation(account.reputation);

	            let lastvotetime = account.last_vote_time+'.000Z';
	            now = new Date();

	            createdTime = new Date(lastvotetime);
	            difference = now.getTime() - createdTime.getTime();
	            calSecond = Math.floor(difference/1000);
	            let lastMinute = calSecond/60;

		        account.voting_power_sec = account.voting_power*0.01 + (lastMinute * 0.013888)
				account.voting_power_sec = account.voting_power_sec > 100 ? 100 : account.voting_power_sec

				// console.log(account.voting_power_sec)

		  		// console.log(fromNowYear)
		  		// this.secTimer()

		  		this.account=account
		  	}else{
				console.log(' getAccounts ERROR@!!!!')
				// this.getAccounts()
		  	}

		});

		this.initPage(1)

    },


    getAccountHistory(historyFrom){

    	this.showSpinner = true;
    	this.showReload = false;

    	this.historyFrom = historyFrom

		setTimeout(() => {
            this.showReload = true;
        }, 2700);

		this.$steem.api.getAccountHistory(this.userName, historyFrom, this.historySize, (err, result) => {

			// console.log(err,result)

			if(result){

				result.sort(function(a, b) {
                    return b[0] - a[0];
                });


				for(let value of result){

					if(this.historyTotal===0){
						this.historyTotal = value[0]
					}

					value.ago = moment(value[1].timestamp+'.000Z').fromNow();

					if(value[1].op[0]=='vote'){
						if(value[1].op[1].weight>=0){
							value[1].op[1].status = 'Upvote'
						}else{
							value[1].op[1].status = 'Downvote'
						}
					
					}else if(value[1].op[0]=='claim_reward_balance'){

						let text = ''

						if(parseFloat(value[1].op[1].reward_steem)>0){
							text+=value[1].op[1].reward_steem+', '
						}

						if(parseFloat(value[1].op[1].reward_sbd)>0){
							text+=value[1].op[1].reward_sbd+', '
						}

						if(parseFloat(value[1].op[1].reward_vests)>0){
							text+= (parseFloat(value[1].op[1].reward_vests) * this.globalProperties.vesting_value).toFixed(3)+' SP' 
						}

						value[1].op[1].text = text

					}else if(value[1].op[0]=='account_witness_vote'){
						if(value[1].op[1].approve){
							value[1].op[1].status = 'Approve Witness'
						}else{
							value[1].op[1].status = 'Uapprove Witness'
						}
					}else if(value[1].op[0]=='author_reward'){

						let text = ''

						if(parseFloat(value[1].op[1].steem_payout)>0){
							text+=value[1].op[1].steem_payout+', '
						}

						if(parseFloat(value[1].op[1].sbd_payout)>0){
							text+=value[1].op[1].sbd_payout+', '
						}

						if(parseFloat(value[1].op[1].vesting_payout)>0){
							text+= (parseFloat(value[1].op[1].vesting_payout) * this.globalProperties.vesting_value).toFixed(3)+'SP' 
						}

						value[1].op[1].text = text

					}else if(value[1].op[0]=='custom_json'){
						value[1].op[1].json_obj = JSON.parse(value[1].op[1].json)
					}
				}

				// console.log(result)

				this.history = result


				this.createPageList(this.page)


			}else{
				console.log(' history ERROR@!!!!')
				// this.getAccountHistory(historyFrom)
			}

			this.showSpinner = false;
		});
    },


    reloadClick(value){
    	if(value=='all'){
    		this.getAccounts()
    	}else{
    		this.getAccountHistory(this.historyFrom)	
    	}
    },

    pageClick(value){
    	console.log(value)
    	this.initPage(value)
      // this.getUsers(value)
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


    secTimer(){
    	setInterval(()=>{ 
    		this.account.voting_power_sec = this.account.voting_power_sec +0.00023146
		    this.account.voting_power_sec = this.account.voting_power_sec > 100 ? 100 : this.account.voting_power_sec
    	}, 1000);

    },


	getVotingValue(votingWeight){

	    let o=1e4;
	    let cc=this.account.effective_sp/this.globalProperties.vesting_value;
	    let powerWeight  = 100*this.account.voting_power_sec*(100*votingWeight)/o;

	    powerWeight=(powerWeight+49)/50;

	    let calResult=cc*powerWeight*100*this.globalProperties.reward_balance*this.globalProperties.sbd_steem_quote;
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
    	return (parseFloat(val) * this.globalProperties.vesting_value).toFixed(len)
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

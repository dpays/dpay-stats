import Vue from 'vue'
import Router from 'vue-router'

import Accounts from '@/components/pages/Accounts'
import Account from '@/components/pages/Account'

import Steem from '@/components/pages/Steem'
import Witness from '@/components/pages/Witness'


Vue.use(Router)



const User = {
  template: '<div>User</div>'
}

export default new Router({
  mode: 'history', 
  routes: [

	{
      path: '/',
      name: 'steem',
      component: Steem
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: Accounts
    },
    {
      path: '/witness',
      name: 'witness',
      component: Witness
    },
    {
      path: '/@:id',
      name: 'account',
      component: Account
    }

  ]
})

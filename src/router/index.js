import Vue from 'vue'
import Router from 'vue-router'

import Accounts from '@/components/pages/Accounts'
import Account from '@/components/pages/Account'

import PostDetail from '@/components/pages/PostDetail'


import DPay from '@/components/pages/DPay'
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
      name: 'dpay',
      component: DPay
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
    },
    {
      path: '/@:id/:permlink',
      name: 'postDetail',
      component: PostDetail
    },
    { path: '/:tag/@:id/:permlink',
      redirect: { name: 'postDetail' }
    }



  ]
})

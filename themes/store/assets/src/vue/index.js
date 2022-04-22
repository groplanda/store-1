import Vue from 'vue';
import Checkout from './components/Checkout';
import Search from './components/Search';
import Account from './components/Account';
import minicart from './components/MiniCart';
import VueMask from 'v-mask';
import store from './store';

Vue.use(VueMask);
Vue.prototype.$sprite_path = process.env.MIX_SPRITE_PATH;

const checkoutEl = document.getElementById("checkout");

if (checkoutEl) {
  new Vue({
    el: checkoutEl,
    store,
    components: { Checkout }
  })
}

const searchEl = document.getElementById("search");

if (searchEl) {
  new Vue({
    el: searchEl,
    components: { Search }
  })
}

const accountEl = document.getElementById("account");

if (accountEl) {
  new Vue({
    el: accountEl,
    components: { Account }
  })
}

const miniCartEl = document.getElementById("mini-cart");

if (miniCartEl) {

  store.dispatch('init').then(() => {
    new Vue({
      el: miniCartEl,
      store,
      components: { minicart }
    })
  })

}


import Vue from 'vue';
import Vuex from 'vuex';
import products from './products';
import user from './user';
import currency from './currency';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    init({ dispatch }) {
      return new Promise((resolve) => {
        dispatch('updateCurrency').then(() => {
          resolve();
        })
      })
    },
  },
  modules: {
    products,
    user,
    currency
  }
})

import Vue from 'vue';
import Vuex from 'vuex';
import products from './products';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {

  },
  modules: {
    products,
    user
  }
})

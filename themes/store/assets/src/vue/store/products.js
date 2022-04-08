import { createProductData, getProductsIds, getProductsIdsWithOptions } from '@/src/utils/product';
import axios from "axios";
import { Cart } from '@/src/plugins/Cart';

export default {
  state: () => ({
    products: [],
    total: 0,
    cart: new Cart(".js-cart-count"),
    loading: false
  }),
  mutations: {
    SET_PRODUCTS(state, payload) {
      state.products = payload;
    },

    PUSH_PRODUCT(state, payload) {
      state.products.push(payload);
    },

    UPDATE_PRODUCT(state, payload) {
      state.products = state.products.map(product => {
        if(+product.id == +payload.id) {
          product.amount = payload.amount;
        }
        return product;
      })
    },

    DELETE_PRODUCT(state, payload) {
      state.products = state.products.filter(product => +product.id !== +payload);
    },

    SET_LOADING(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async fillProducts({ commit, dispatch }, payload) {
      let products = await dispatch('fetchProducts', payload);
      commit('SET_PRODUCTS', products);
    },

    async fetchProducts(_, payload) {
      const options = getProductsIdsWithOptions(payload);

      return await axios.get("/api/products/" + getProductsIds(payload), { params: { options } })
        .then(response => {
          return response.data.map((product, index) => createProductData(product, index, payload));
        })
        .catch(e => {
          console.log(e);
          throw new Error('Error: ' + e.message);
        })
    },

    changeAmount({ commit, state }, payload) {
      commit('UPDATE_PRODUCT', payload);
      state.cart.changeToCart(payload);
    },

    deleteProduct({ commit, state }, payload) {
      commit('DELETE_PRODUCT', payload.id);
      state.cart.removeFromCart(payload.id, false);
    },

    removeProducts({ commit }) {
      if (localStorage.getItem(process.env.MIX_STORE)) {
        localStorage.removeItem(process.env.MIX_STORE);
      }
      commit('SET_PRODUCTS', []);
    },

    async updateProducts({ commit, getters, dispatch }, payload) {
      let products = getters.getProducts;
      if (products.length === payload.data.length && products.length > 0) {
        if (payload.changed) {
          const changed = payload.data.find(product => +product.id === +payload.changed);
          commit('UPDATE_PRODUCT', changed);
        }
      } else {
        const data = payload.data.filter(item => +item.id === +payload.changed);
        const result = await dispatch('fetchProducts', data);
        result.forEach(product => {
          commit('PUSH_PRODUCT', product);
        });
      }
    },

    setLoading({ commit }, payload) {
      commit('SET_LOADING', payload);
    }
  },
  getters: {
    getProducts (state) {
      return state.products;
    },

    hasProducts (state) {
      return state.products.length
    },

    getTotal (state) {
      return state.products.reduce((sum, product) => {
        return sum + (+product.amount * (+product.sale_price > 0 ? +product.sale_price : +product.price));
      }, 0)
    },

    getSum (state) {
      return state.products.reduce((sum, product) => sum + (+product.amount * +product.price), 0)
    },

    getProductCount (state) {
      return state.products.reduce((sum, el) => sum + el.amount, 0);
    },

    getLoading (state) {
      return state.loading;
    },
  }
}

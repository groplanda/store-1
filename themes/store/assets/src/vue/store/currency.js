import axios from "axios";

export default {
  state: () => ({
    currency: 1
  }),
  mutations: {
    SET_CURRENCY(state, payload) {
      state.currency = payload;
    },
  },
  actions: {
    async updateCurrency({ commit}) {
      const currencyData = await axios.get("/api/currency");
      const response = await currencyData.data;
      commit('SET_CURRENCY', response.value);
      localStorage.setItem('currency', response.value);
    },
  },
  getters: {
    getCurrency(state) {
      return state.currency;
    }
  }
}

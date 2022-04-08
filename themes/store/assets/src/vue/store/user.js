import axios from "axios";

export default {
  state: () => ({
   user: null
  }),
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    getUser({dispatch}) {
      axios.get("/api/user/isUserLogin")
      .then(response => {
        if (response.data) {
          dispatch('getUserdata');
        }
      })
    },
    getUserdata({commit}) {
      axios.get("/api/user/userdata")
      .then(response => {
        const data = response.data;
        if (response.status === 200 && data.status === "success") {
          commit('SET_USER', data.user);
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          console.log('403');
        }
        if (error.response.status === 500) {
          console.log('500');
        }
      })
    }
  },
  getters: {
    getUser (state) {
      return state.user;
    },
  }
}

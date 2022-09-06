import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    TREMDGOL_BACKEND_URL: "https://api.tremdgol.com",
    appBackgroundColor: "grey lighten-4",
  },
  getters: {},
  mutations: {
    setAppBackgroundColor(state, newColor) {
      state.appBackgroundColor = newColor;
    },
  },
  actions: {},
  modules: {},
});

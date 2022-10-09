import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    TREMDGOL_BACKEND_URL: "https://api.tremdgol.com",
    appBackgroundColor: "grey lighten-4",
    showTeamsMarketValues: false,
  },
  getters: {},
  mutations: {
    setAppBackgroundColor(state, newColor) {
      state.appBackgroundColor = newColor;
    },
    setShowTeamsMarketValues(state, newValue) {
      console.log("showTeamsMarketValues switched to ", newValue);
      state.showTeamsMarketValues = newValue;
    },
  },
  actions: {},
  modules: {},
});

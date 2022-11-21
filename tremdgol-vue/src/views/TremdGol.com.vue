<template>
  <v-sheet class="d-flex flex-column align-center justify-center grey lighten-4 elevation-0 rounded-lg">
    <v-sheet v-if="$vuetify.breakpoint.width < 600" class="ma-5 py-10 d-flex flex-column align-center text-center transparent">
      <v-sheet class="mb-10 transparent d-flex align-center justify-space-around">
        <TremdGolLogo />
      </v-sheet>
      <v-sheet class="transparent" max-width="360">
        <h5 class="mb-10">Use this app in a desktop device for better user experience.</h5>
        You can try the Android TremdGol app. <br />
        Available on
        <a href="https://play.google.com/store/apps/details?id=com.bolanarede.tremdgol_free" target="_blank"> Google Play Store</a>
      </v-sheet>
      <br />
      or
      <v-sheet class="mt-5 text-center transparent">
        Rotate your device
        <v-icon large color="grey darken-1"> mdi-phone-rotate-landscape </v-icon>
      </v-sheet>
    </v-sheet>
    <v-sheet v-else class="pa-3 d-flex flex-column align-center transparent text-wrap elevation-0" width="600">
      <v-sheet class="mb-1 d-flex align-center justify-center elevation-0 transparent" width="400" height="8">
        <v-progress-linear v-if="loading" indeterminate rounded color="primary" height="3"></v-progress-linear>
      </v-sheet>
      <v-sheet class="px-3 d-flex flex-row align-center justify-space-around transparent elevation-0" width="600">
        <v-sheet class="d-flex transparent align-center justify-center elevation-0" width="150">
          <TremdGolLogo />
        </v-sheet>
        <v-sheet class="d-flex transparent text--h2 font-weight-medium align-center justify-center elevation-0" width="200">
          {{ events.length === 0 ? "no live events" : events.length === 1 ? events.length + " live event" : events.length + " live events" }}
        </v-sheet>
        <v-sheet class="px-3 d-flex transparent align-center justify-end elevation-0" width="150">
          <SettingsMenu />
        </v-sheet>
      </v-sheet>
      <v-sheet class="d-flex flex-column align-center mx-10 px-7 py-3 transparent elevation-0" :width="$vuetify.breakpoint.width * 0.97">
        <v-sheet class="transparent mb-2" width="520">
          <h2>Welcome!</h2>
          <h4 class="font-weight-regular">Choose one event from the list below to see more details and live stats.</h4>
        </v-sheet>
        <v-sheet
          v-if="events.filter((ev) => selectedMatchDictionary[ev.id]).length > 0"
          class="mt-0 transparent elevation-0 d-flex justify-center"
          :width="$vuetify.breakpoint.width * 0.97"
        >
          <TremdgolEventsList
            :eventsArray="events.filter((ev) => selectedMatchDictionary[ev.id])"
            :typeStarredOrNormalList="'starred'"
            @toggleSelectedMatch="toggleSelectedMatch"
          />
        </v-sheet>

        <v-sheet class="mt-0 transparent">
          <TremdgolEventsList
            :eventsArray="events.filter((ev) => !selectedMatchDictionary[ev.id])"
            :typeStarredOrNormalList="'normal'"
            @toggleSelectedMatch="toggleSelectedMatch"
          />
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
import axios from "axios";
// STACKOVERFLOW  https://forum.vuejs.org/t/how-to-use-helper-functions-for-imported-modules-in-vuejs-vue-template/6266
import * as conversorsAndParsersLib from "../services/auxiliary/conversorsAndParsers";
import * as parseEventData_LIB from "../services/parseEventData";
// STACKOVERFLOW https://stackoverflow.com/questions/43608457/how-to-import-functions-from-different-js-file-in-a-vuewebpackvue-loader-proje

import TremdGolLogo from "../components/TremdGolLogo.vue";
import TremdgolEventsList from "../components/TremdgolEventsList.vue";
import SettingsMenu from "../components/SettingsMenu.vue";

export default {
  name: "TremdGol.com",
  components: {
    TremdGolLogo,
    TremdgolEventsList,
    SettingsMenu,
  },
  data() {
    return {
      loading: true,
      isAutoCollectON: true,
      isAutoCollect_upComingEvents_ON: true,
      events: [], //events to show
      bfEventsApiResponse: { version: null, totalExecutionTime: null, response: [] },
      loadingMarketData: false,
      eventSearchText: "",
      selectedMatchDictionary: {},
      totalTremdGolUpcomingEvents: 0,
      tremdgolUpcomingEvents: [],
      showOnlyHotPickedOrStarredEvents: true,
      sortEventsByKOtime: true,
      bsfInplayEvents: [],
      totalBSFinplayEvents: 0,
    };
  },
  created() {
    this.$store.commit("setAppBackgroundColor", "grey lighten-4 ");
  },
  destroyed() {
    //this.$store.commit("setAppBackgroundColor", "grey lighten-4 ");
  },
  mounted() {
    this.getTremdgolLiveEvents("showLoadingProgressBar");
    this.autoLoad_getTremdgolLiveEvents();
  },
  computed: {
    now: function () {
      return Date.now();
    },
  },
  methods: {
    autoLoad_getTremdgolLiveEvents() {
      // STACKOVERFLOW https://stackoverflow.com/questions/43335477/how-to-use-setinterval-in-vue-component
      this.timer = setInterval(
        function () {
          if (this.isAutoCollect_upComingEvents_ON) {
            //this.getEventBFoverMarketsData();
            this.getTremdgolLiveEvents();
          } else {
            console.warn("isAutoCollect_upComingEvents_ON OFF🔴");
          }
        }.bind(this),
        1000 * 30 * 1 // default is 1 minute here
      );
    },
    getTremdgolLiveEvents(showLoadingProgressBar) {
      console.log(`getTremdgolLiveEvents() --- START ${conversorsAndParsersLib.getDatehhmmss(new Date())} `);
      if (showLoadingProgressBar) this.loading = true;
      axios
        .get(this.$store.state.TREMDGOL_BACKEND_URL + "/events/1")
        .then((response) => {
          console.warn("💲 response.length = " + JSON.stringify(response.data).length);
          //console.error(JSON.stringify(response.data));
          //console.log("response.data = ", response.data);

          //response.data.response.result.liveEvents = parseEventData_LIB.getDemoEvents(); // uncomment this line to load DEMO DEFAULT DATA

          response.data.response.result.liveEvents.map((ev) => {
            console.warn(ev.fullName);
            parseEventData_LIB.parseEventData(ev);
            //ev.isSelectedToTop = this.selectedMatchDictionary[ev.id] ? true : false;
          });
          if (true || this.events.length === 0) {
            this.events = JSON.parse(JSON.stringify(response.data.response.result.liveEvents)); // only set the tremdgolUpcomingEvents array once to void memory leak issue
            // STACKOVERFLOW CAREFUL HERE multiple download to the same variable is causing memory leaks :
            //  (this.tremdgolUpcomingEvents or even at the vuex store) => https://github.com/vuejs/core/issues/4738
            //this.tremdgolUpcomingEvents = JSON.parse(JSON.stringify(response.data.response.result)); => memory leak error (storing multiple times doesnt release de memory)
            //this.$store.commit("setTremdgolUpcomingEvents", JSON.parse(JSON.stringify(response.data.response.result)));
          }
          //this.events = response.data.response.result.length;
          //this.setTremdgolUpcomingEventsOfBFevents(response.data.response.result); // instead of set the data, pass to this function that loops trough existing array (this.bfEventsApiResponse.response)
          //this.applyFilters();
          this.loading = false;
          console.log(`getTremdgolLiveEvents() --- END ${conversorsAndParsersLib.getDatehhmmss(new Date())} `);
        })
        .catch((error) => {
          console.error(error);
          console.error("Something went wrong with the getTremdgolLiveEvents endpoint");
          //alert("something went wrong with the getTremdgolLiveEvents endpoint");
          this.loading = false;
          console.log(`getTremdgolLiveEvents() --- END ${conversorsAndParsersLib.getDatehhmmss(new Date())} `);
        });
    },
    toggleSelectedMatch(event) {
      console.error("this.selectedMatchDictionary = " + JSON.stringify(this.selectedMatchDictionary));
      this.selectedMatchDictionary[event.id] = !this.selectedMatchDictionary[event.id];
      console.error("this.selectedMatchDictionary = " + JSON.stringify(this.selectedMatchDictionary));
      this.$forceUpdate(); // $forceUpdate() is much faster than forceRerender()
      //this.forceRerender();
    },
  },
};
</script>

<style></style>

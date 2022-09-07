<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-sheet class="d-flex opacity-full flex-column justify-start align-center" v-bind="attrs" v-on="on" height="25">
        <v-hover v-slot="{ hover }">
          <v-sheet
            :class="'mb-n7 font-weight-medium text-h5 px-1 rounded-xl ' + (hover ? ' grey lighten-3' : ' transparent ')"
            :elevation="hover ? 3 : 0"
            style="z-index: 1"
          >
            €
          </v-sheet>
        </v-hover>
        <v-sheet class="d-flex opacity-full flex-row elevation-0 justify-space-around align-center rounded-lg text-center" width="420">
          <v-sheet class="opacity-full font-weight-bold elevation-0 text-right" width="75">{{ event.homeClubValue }}</v-sheet>
          <v-sheet class="d-flex flex-row justify-center elevation-0" width="260">
            <v-sheet
              class="d-flex ml-3 opacity-full flex-row justify-center align-center primary"
              height="11"
              :width="(260 * event.tm_stats.total_market_value[0]) / (event.tm_stats.total_market_value[0] + event.tm_stats.total_market_value[1])"
            >
            </v-sheet>
            <v-sheet
              class="d-flex mr-3 opacity-full flex-row justify-center align-center grey"
              height="11"
              :width="(260 * event.tm_stats.total_market_value[1]) / (event.tm_stats.total_market_value[0] + event.tm_stats.total_market_value[1])"
            >
            </v-sheet>
          </v-sheet>
          <v-sheet class="opacity-full font-weight-bold elevation-0 text-left" width="75">{{ event.awayClubValue }}</v-sheet>
        </v-sheet>
      </v-sheet>
    </template>
    <span class="text-center" style="white-space: pre">
      <h3>Total team players market value (euro)</h3>
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: "TeamMarketValue",

  components: {},

  props: ["event"],

  data() {
    return {};
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>

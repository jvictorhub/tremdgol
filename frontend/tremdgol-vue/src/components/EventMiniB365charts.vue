<template>
  <v-sheet class="white rounded-lg">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-sheet v-bind="attrs" v-on="on" class="d-flex opacity-full flex-column justify-center align-center">
          <span class="mb-n5" style="z-index: 1">🎯</span>
          <v-sheet class="d-flex opacity-full flex-row elevation-0 justify-space-around align-center rounded-lg text-center" width="300">
            <v-sheet class="opacity-full" width="33">{{ event.points.on_target_home }}</v-sheet>
            <v-sheet class="d-flex flex-row justify-center elevation-0" width="220">
              <v-sheet
                class="d-flex ml-3 opacity-full flex-row justify-center align-center blue darken-3"
                height="10"
                :width="(200 * event.points.on_target_home) / (event.points.on_target_home + event.points.on_target_away)"
              >
                <span class="transparent--text">🎯</span>
              </v-sheet>
              <v-sheet
                class="d-flex mr-3 opacity-full flex-row justify-center align-center grey"
                height="10"
                :width="(200 * event.points.on_target_away) / (event.points.on_target_home + event.points.on_target_away)"
              >
                <span class="transparent--text">🎯</span>
              </v-sheet>
            </v-sheet>
            <v-sheet class="opacity-full" width="33">{{ event.points.on_target_away }}</v-sheet>
          </v-sheet>
          <span class="mb-n5" style="z-index: 1">
            <h4>👟</h4>
          </span>
          <v-sheet class="d-flex opacity-full flex-row elevation-0 justify-space-around align-center rounded-lg text-center" width="300">
            <v-sheet class="opacity-full" width="33">{{ event.points.off_target_home }}</v-sheet>
            <v-sheet class="d-flex flex-row justify-center elevation-0" width="220">
              <v-sheet
                class="d-flex ml-3 opacity-full flex-row justify-center align-center blue darken-3"
                height="10"
                :width="(200 * event.points.off_target_home) / (event.points.off_target_home + event.points.off_target_away)"
              >
                <span class="transparent--text">👟</span>
              </v-sheet>
              <v-sheet
                class="d-flex mr-3 opacity-full flex-row justify-center align-center grey"
                height="10"
                :width="(200 * event.points.off_target_away) / (event.points.off_target_home + event.points.off_target_away)"
              >
                <span class="transparent--text">👟</span>
              </v-sheet>
            </v-sheet>
            <v-sheet class="opacity-full" width="33">{{ event.points.off_target_away }}</v-sheet>
          </v-sheet>
          <v-sheet class="mt-2 mb-0 d-flex opacity-full flex-row justify-center align-center elevation-0 rounded-lg">
            <v-sheet
              :class="'mx-3 d-flex flex-column align-center ' + (event.points.att_home === 0 && event.points.att_away === 0 ? ' opacity-half ' : ' ')"
            >
              <v-sheet class="opacity-full d-flex flex-row align-center">
                <v-sheet class="text-right" width="20">{{ event.points.att_home }}</v-sheet>
                <v-progress-circular
                  class="mx-1"
                  :rotate="180 - event.points.att_home_pct * 1.8"
                  background-color="grey lighten-1"
                  :size="40"
                  :width="7"
                  :value="event.points.att_home_pct > 0 ? event.points.att_home_pct : 0"
                  color="primary"
                  style="$progress-circular-underlay-stroke: rgba(map-get($red, 'base'), 0.4) !default"
                >
                  att
                </v-progress-circular>
                <v-sheet class="text-left" width="20">{{ event.points.att_away }}</v-sheet>
              </v-sheet>
            </v-sheet>

            <v-sheet
              :class="
                'mx-3 d-flex flex-column align-center ' + (event.points.datt_home === 0 && event.points.datt_away === 0 ? ' opacity-half ' : ' ')
              "
            >
              <v-sheet class="opacity-full d-flex flex-row align-center">
                <v-sheet class="text-right" width="20">{{ event.points.datt_home }}</v-sheet>
                <v-progress-circular
                  class="mx-1"
                  :rotate="180 - event.points.datt_home_pct * 1.8"
                  background-color="pink lighten-3"
                  :size="50"
                  :width="10"
                  :value="event.points.datt_home_pct > 0 ? event.points.datt_home_pct : 0"
                  color="primary"
                >
                  🔥
                </v-progress-circular>
                <v-sheet class="text-left" width="20">{{ event.points.datt_away }}</v-sheet>
              </v-sheet>
            </v-sheet>

            <v-sheet
              :class="
                'mx-3 d-flex flex-column align-center ' +
                (event.points.possession_home === 0 && event.points.possession_away === 0 ? ' opacity-half ' : ' ')
              "
            >
              <v-sheet class="d-flex flex-row align-center">
                <v-sheet class="text-right" width="20">{{ event.points.possession_home }}</v-sheet>
                <v-progress-circular
                  class="mx-1"
                  :rotate="180 - event.points.possession_home * 1.8"
                  background-color="pink lighten-3"
                  :size="40"
                  :width="7"
                  :value="event.points.possession_home"
                  color="primary"
                >
                  %
                </v-progress-circular>
                <v-sheet class="text-left" width="20">{{ event.points.possession_away }}</v-sheet>
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </template>
      <span style="white-space: pre">
        <h3>🎯 on target shots</h3>
        <h3>👟 off target shots</h3>
        <h3>🔥 dangerous attacks</h3>
      </span>
    </v-tooltip>
  </v-sheet>
</template>

<script>
export default {
  name: "EventMiniB365charts",

  components: {},

  props: ["event"],

  data() {
    return {};
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.opacity-half {
  opacity: 0.5;
}
</style>

<template>
  <v-sheet
    :class="
      'transparent d-flex ' +
      (typeStarredOrNormalList === 'starred' ? 'flex-row  elevation-0 pa-0 overflow-x-auto align-start ' : ' flex-column align-center ')
    "
  >
    <v-sheet
      v-for="(event, i) in eventsArray"
      :key="'monthGoal_' + i"
      class=""
      :class="
        'd-flex flex-column elevation-0 transparent align-center justify-center rounded-lg ' +
        (typeStarredOrNormalList === 'starred' ? 'px-1' : 'mx-0')
      "
      min-width="525"
      max-width="544"
      :color="typeStarredOrNormalList === 'starred' ? 'transparent lighten-4' : ''"
    >
      <v-hover v-slot="{ hover }">
        <v-sheet width="100%" class="d-flex flex-column transparent elevation-0">
          <v-sheet class="d-flex flex-row transparent align-center justify-center elevation-0">
            <v-sheet v-if="hover || typeStarredOrNormalList === 'starred'" class="elevation-10" width="30"></v-sheet>
            <v-sheet class="d-flex align-center justify-center transparent elevation-0" style="z-index: 1">
              <v-sheet class="mt-1 mb-n1 px-2 text-center elevation-2 grey lighten-2 rounded-xl" style="z-index: 1">
                <h5>{{ event.minuteClock }}</h5>
              </v-sheet>
            </v-sheet>
            <!-- 
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-sheet class="d-flex align-center justify-center transparent elevation-0" style="z-index: 1">
                  <v-sheet class="mt-1 mb-n1 px-2 text-center elevation-2 grey lighten-2 rounded-xl" style="z-index: 1" v-bind="attrs" v-on="on">
                    <h5>{{ event.minuteClock }}</h5>
                  </v-sheet>
                </v-sheet>
              </template>
              <v-sheet class="pa-2 d-flex flex-column grey lighten-3 text-caption">
                {{ event }}
              </v-sheet>
            </v-menu>
            -->

            <v-tooltip bottom v-if="hover || typeStarredOrNormalList === 'starred'">
              <template v-slot:activator="{ on, attrs }">
                <v-sheet
                  v-bind="attrs"
                  v-on="on"
                  class="mt- mb-n1 px-1 text-center elevation-0 transparent lighten-2 rounded-xl"
                  style="z-index: 1"
                  width="30"
                  @click="toggleSelectedMatch(event)"
                >
                  <v-icon :color="typeStarredOrNormalList === 'starred' ? 'yellow darken-3' : 'black'" dense> mdi-star </v-icon>
                </v-sheet>
              </template>
              Favourite this match (add to top)
            </v-tooltip>
          </v-sheet>
          <div
            :style="
              'width:100%; border: 0px solid transparent; border-radius: 20px; margin-bottom:4px;' +
              (hover ? ' box-shadow: 0px 0px 23px -10px grey; ' : ' ')
            "
          >
            <v-sheet
              :class="
                'd-flex flex-row justify-space-between align-center elevation-10 rounded-lg ' +
                (typeStarredOrNormalList === 'starred' ? 'mb-0 ' : 'mb-0 ')
              "
              width="100%"
              min-height="82"
              :elevation="typeStarredOrNormalList === 'starred' ? '3' : '3'"
            >
              <v-sheet class="pa-1 rounded-lg text-center elevation-0 d-flex flex-column align-center justify-center" width="13%" height="100%">
                <v-sheet class="mx-2 pa-2 d-flex flex-column align-center justify-center">
                  <v-img
                    :src="'https://assets.b365api.com/images/team/m/' + event.home.image_id + '.png'"
                    :style="'width: ' + logoSizePx + 'px; height: ' + logoSizePx + 'px'"
                    transition="scale-transition"
                  />
                </v-sheet>
              </v-sheet>
              <v-sheet
                class="mt-0 mx-1 d-flex flex-column align-center transparent elevation-0"
                min-height="75"
                width="73%"
                @click="toggleMatchDetailsVisible(event)"
              >
                <v-sheet class="mb-n3 mt-2 elevation-0">
                  <h5 class="grey--text">{{ event.league.name }}</h5>
                </v-sheet>
                <v-sheet class="mt-0 d-flex flex-row flex-wrap text-wrap elevation-0 rounded-lg justify-space-between transparent" width="100%">
                  <v-sheet class="pt-2 d-flex flex-column text-center align-center justify-center elevation-0 transparent" width="39%">
                    <h3>{{ event.home.name }}</h3>
                  </v-sheet>
                  <v-sheet
                    class="pt-3 d-flex flex-column text-center align-center justify-center elevation-0 transparent"
                    width="20%"
                    min-height="55"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-sheet v-bind="attrs" v-on="on" class="transparent">
                          <h2 class="my-n1">
                            {{ event.ss }}
                          </h2>
                        </v-sheet>
                      </template>
                      <EventTimelineMINI :event="event" :width="420" :showClock="false" :elevation="0" />
                    </v-tooltip>
                  </v-sheet>
                  <v-sheet class="pt-2 d-flex flex-column text-center align-center justify-center elevation-0 transparent" width="39%">
                    <h3>{{ event.away.name }}</h3>
                  </v-sheet>
                </v-sheet>
              </v-sheet>
              <v-sheet class="pa-1 rounded-lg text-center elevation-0 d-flex flex-column align-center justify-center" width="13%" height="100%">
                <v-sheet class="mx-2 pa-2 d-flex flex-column align-center justify-center">
                  <v-img
                    :src="'https://assets.b365api.com/images/team/m/' + event.away.image_id + '.png'"
                    :style="'width: ' + logoSizePx + 'px; height: ' + logoSizePx + 'px'"
                    transition="scale-transition"
                  />
                </v-sheet>
              </v-sheet>
            </v-sheet>
          </div>
        </v-sheet>
      </v-hover>
      <v-sheet
        v-if="matchDetailsVisibleDictionary[event.id]"
        class="mt-0 px-3 pb-1 mb-3 rounded-b-lg d-flex flex-column align-center elevation-3"
        width="440"
      >
        <v-sheet
          v-if="
            $store.state.showTeamsMarketValues &&
            event.tm_stats &&
            event.tm_stats.total_market_value[0] > 0 &&
            event.tm_stats.total_market_value[1] > 0
          "
          class="mx-1 mb-0 pa-1 py-3 elevation-0 d-flex flex-column align-center"
        >
          <TeamMarketValue :event="event" />
        </v-sheet>
        <v-sheet class="d-flex pa-1 rounded-lg">
          <EventSoccerOppsMapLoggerMINI
            :event="event"
            :canvasSizeFactor="0.8"
            :showPressureSlider="false"
            :twoTrianglesControls="false"
            :lockedToInsertNewShapes="false"
            :hidePOBsCharts="true"
            :showMinuteInsideCanvas="true"
            :showPobsScoreBelowCanvas="false"
            :showMissedGreatChancesBelowCanvas="false"
            :showPaceSliderBelowCanvas="false"
          />
        </v-sheet>
        <v-sheet class="pt-4 pb-2">
          <EventTimelineMINI :event="event" :width="360" :showClock="false" :elevation="0" />
        </v-sheet>
        <v-sheet class="mx-1 mb-0 pa-2 elevation-0 d-flex flex-column align-center">
          <EventMiniB365charts :event="event" :key="event.fullName + '_bsfEventData_' + event.enClock" />
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
import * as parseEventData_LIB from "../services/parseEventData";

import EventSoccerOppsMapLoggerMINI from "./EventSoccerOppsMapLoggerMINI";
import EventMiniB365charts from "./EventMiniB365charts";
import EventTimelineMINI from "./EventTimelineMINI";
import TeamMarketValue from "./TeamMarketValue";

export default {
  name: "TremdgolEventsList",

  props: ["eventsArray", "typeStarredOrNormalList"],

  components: {
    EventSoccerOppsMapLoggerMINI,
    EventMiniB365charts,
    EventTimelineMINI,
    TeamMarketValue,
  },

  data() {
    return {
      matchDetailsVisibleDictionary: {},
      showOverlay: false,
      logoSizePx: 44,
    };
  },
  computed: {},
  watch: {
    $props: {
      handler(val) {
        console.log("EventsList changed");
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    setOverlayDialogEvent(new_value) {
      this.showOverlay = new_value;
      console.log("this.showOverlay switched to= " + this.showOverlay);
    },
    toggleSelectedMatch(event) {
      this.$emit("toggleSelectedMatch", event);
    },
    toggleMatchDetailsVisible(event) {
      console.log("this.matchDetailsVisibleDictionary = " + JSON.stringify(this.matchDetailsVisibleDictionary));
      //console.error("clicou toggleMatchDetailsVisible = " + this.matchDetailsVisibleDictionary[event.id]);
      this.matchDetailsVisibleDictionary[event.id] = !this.matchDetailsVisibleDictionary[event.id];
      //console.error("clicou toggleMatchDetailsVisible = " + this.matchDetailsVisibleDictionary[event.id]);

      if (event.bsfEventData) {
        parseEventData_LIB.createLocalStorageEventNotesOfEvents([event.bsfEventData]);
      } else if (event.tremdgolUpcomingEvent) {
        parseEventData_LIB.createLocalStorageEventNotesOfEvents([event.tremdgolUpcomingEvent]);
      }
      //this.matchStatsVisibleDictionary[event.id] = true;
      //this.matchEventLogoAndScoreVisibleDictionary[event.id] = true;
      console.log("this.matchDetailsVisibleDictionary = " + JSON.stringify(this.matchDetailsVisibleDictionary));
      this.$forceUpdate(); // $forceUpdate() is much faster than forceRerender()
      //this.forceRerender();
    },
  },
};
</script>

<style></style>

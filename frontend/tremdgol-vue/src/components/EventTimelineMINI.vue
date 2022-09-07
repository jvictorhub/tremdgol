<template>
  <v-sheet class="mx-1 my-0 rounded-xl d-flex flex-column align-center" :elevation="elevation">
    <v-sheet class="white lighten-3 d-flex flex-column elevation-0 rounded-lg" :width="width">
      <v-sheet class="pt-5 transparent lighten-5 elevation-0 d-flex flex-column rounded-xl" id="HOME EVENTS">
        <v-sheet
          class="d-flex flex-row transparent elevation-0"
          v-for="ev in eventsToShow.filter((e) => e.minuteSequential && e.homeOrAway === 'H')"
          :key="ev.id + '_'"
        >
          <v-sheet class="opacity-full" :width="((Number(ev.minuteToUse) - 2) / 90) * 100 + '%'" height="0"></v-sheet>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-sheet class="d-flex align-end" height="0">
                <span v-bind="attrs" v-on="on" :class="ev.class" style="z-index:1"> {{ ev.symbolToShow }} </span>
              </v-sheet>
            </template>
            <v-sheet class="px-2 text-h6 rounded-lg"> {{ ev.text }} </v-sheet>
            <span class="pa-5 text-caption" style="white-space: pre-wrap">{{ ev }}</span>
          </v-tooltip>
        </v-sheet>
      </v-sheet>

      <v-menu offset-y open-on-hover :close-on-content-click="false" content-class="pa-1 elevation-0">
        <template v-slot:activator="{ on, attrs }">
          <v-sheet class="d-flex flex-column transparent elevation-2" :key="'eventTimeLineBAR_' + event.id + '_'" v-bind="attrs" v-on="on">
            <v-sheet class="d-flex white lighten-1" id="HT BAR" :width="(45 / 90) * 100 + '%'" height="0">
              <v-sheet class="transparent lighten-1" :width="width / 2" height="11"></v-sheet>
              <v-sheet class="black lighten-1" width="4" height="11" style="z-index:1"></v-sheet>
            </v-sheet>
            <v-sheet class="d-flex">
              <v-sheet class="d-flex green lighten-1" id="TIME BAR" :width="(matchMinuteToUse / 90) * 100 + '%'" height="11"> </v-sheet>
              <v-sheet v-if="showClock" :class="'mt-n1 mb-n3 opacity-full d-flex text-caption ' + (matchMinuteToUse > 86 ? 'mx-n6' : 'mx-4')">
                {{ matchMinuteToUse > 0 ? matchMinuteToUse : "" }}
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </template>
        <v-sheet class="transparent pa-1 elevation-0 d-flex flex-column align-center">
          <v-sheet class="grey rounded pa-1 elevation-4">
            <v-sheet class="px-1 d-flex flex-row align-center justify-space-around elevation-0 rounded-t">
              <v-switch
                class="mt-0"
                v-model="onlyGoals"
                :label="`⚽ Only (${totals.goals})`"
                dense
                hide-details
                @change="toggleOnlyGoals()"
              ></v-switch>
            </v-sheet>
            <v-sheet class="px-1 d-flex flex-row align-center justify-space-around elevation-0 rounded-b">
              <v-checkbox class="mr-3 my-1" v-model="corners" :label="`${cornerChar}${totals.corners}`" @change="applyFilters()" dense hide-details
                >aa</v-checkbox
              >
              <v-checkbox
                class="mr-3 my-1"
                v-model="yellowCards"
                :label="`🟨 (${totals.yellowCards})`"
                @change="applyFilters()"
                dense
                hide-details
              ></v-checkbox>
              <v-checkbox
                class="mr-3 my-1"
                v-model="redCards"
                :label="`🟥 (${totals.redCards})`"
                @change="applyFilters()"
                dense
                hide-details
              ></v-checkbox>
              <v-checkbox
                class="mr-3 my-1"
                v-model="shotsOnTarget"
                :label="`🎯 (${totals.shotsOnTarget})`"
                @change="applyFilters()"
                dense
                hide-details
              ></v-checkbox>
              <v-checkbox
                class="my-1"
                v-model="shotsOffTarget"
                :label="`🥾 (${totals.shotsOffTarget})`"
                @change="applyFilters()"
                dense
                hide-details
              ></v-checkbox>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </v-menu>

      <v-sheet class="mt-n0 pb-5 transparent lighten-3 elevation-0 rounded-lg" id="AWAY EVENTS" height="0">
        <v-sheet
          class="d-flex flex-row transparent"
          v-for="ev in eventsToShow.filter((e) => e.minuteSequential && e.homeOrAway === 'A')"
          :key="ev.id + '_'"
        >
          <v-sheet class="opacity-full" :width="((Number(ev.minuteToUse) - 2) / 90) * 100 + '%'" height="0"></v-sheet>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-sheet class="d-flex align-start" height="0">
                <span v-bind="attrs" v-on="on" :class="ev.class" style="z-index:1"> {{ ev.symbolToShow }} </span>
              </v-sheet>
            </template>
            <v-sheet class="text-h4"> {{ ev.text }} </v-sheet>
            <span class="pa-5" style="white-space: pre-wrap">{{ ev }}</span>
          </v-tooltip>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  name: "EventTimelineMINI",

  components: {},

  props: ["event", "width", "elevation", "showClock"],

  data() {
    return {
      matchMinuteToUse: 0,
      eventsToShow: [],
      cornerChar: "⛳", // ⛳🚩🏁🏴🏳‍🌈🏳
      corners: false,
      redCards: true,
      yellowCards: false,
      shotsOnTarget: false,
      shotsOffTarget: false,
      onlyGoals: false,
      totals: {
        corners: 0,
        redCards: 0,
        yellowCards: 0,
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        goals: 0,
      },
    };
  },
  created() {},
  mounted() {
    this.applyFilters();
  },
  watch: {
    $props: {
      handler(props_newValues) {
        console.warn("%cprops changed EventTimelineMINI ", "color:orange");
        this.applyFilters();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    toggleOnlyGoals() {
      console.warn("toggleOnlyGoals()");
      console.warn("this.onlyGoals =", this.onlyGoals);
      if (this.onlyGoals) {
        this.corners = false;
        this.redCards = false;
        this.yellowCards = false;
        this.shotsOnTarget = false;
        this.shotsOffTarget = false;
      } else {
        this.corners = true;
        this.redCards = true;
        this.yellowCards = true;
        this.shotsOnTarget = true;
        this.shotsOffTarget = true;
      }
      this.applyFilters();
    },
    applyFilters() {
      //console.warn("applyFilters()");
      //this.event.minute = 1 // TESTING
      this.matchMinuteToUse = this.event.minute - 1; // TESTING
      this.event.eventsToShow_2.eventsToShow.map((ev) => {
        ev.minuteToUse = ev.minute;
        if (ev.minuteSequential >= 14500 && ev.minuteSequential < 20000) {
          ev.minuteToUse = 45.5; // 1H stoppagetime goal/card/corners/etc
        }
      });
      this.eventsToShow = JSON.parse(JSON.stringify(this.event.eventsToShow_2.eventsToShow.filter((e) => e.symbolToShow)));
      this.eventsToShow.map((e) => {
        if (e.symbolToShow === "⚽") e.class = "ml-n2 my-n2 text-h6";
        else if (e.symbolToShow === "🎯") e.class = "my-n2 text-subtitle-1";
        else if (e.symbolToShow === "🟨") e.class = "my-n2 text-caption";
        else if (e.symbolToShow === "🟥") e.class = "my-n2 text-subtitle-1";
        else if (e.symbolToShow === "🥾") e.class = "my-n2 text-subtitle-2";
        else if (e.symbolToShow === this.cornerChar) e.class = "my-n2 text-subtitle-2";
        else e.class = "";
      });
      this.totals.corners = this.eventsToShow.filter((e) => e.text.includes("Corner - ")).length;
      this.totals.yellowCards = this.eventsToShow.filter((e) => e.symbolToShow === "🟨").length;
      this.totals.redCards = this.eventsToShow.filter((e) => e.symbolToShow === "🟥").length;
      this.totals.shotsOnTarget = this.eventsToShow.filter((e) => e.symbolToShow === "🎯").length;
      this.totals.shotsOffTarget = this.eventsToShow.filter((e) => e.symbolToShow === "🥾").length;
      this.totals.goals = this.eventsToShow.filter((e) => e.symbolToShow === "⚽").length;
      if (!this.corners) this.eventsToShow = this.eventsToShow.filter((e) => e.symbolToShow !== this.cornerChar);
      if (!this.yellowCards) this.eventsToShow = this.eventsToShow.filter((e) => e.symbolToShow !== "🟨");
      if (!this.redCards) this.eventsToShow = this.eventsToShow.filter((e) => e.symbolToShow !== "🟥");
      if (!this.shotsOnTarget) this.eventsToShow = this.eventsToShow.filter((e) => e.symbolToShow !== "🎯");
      if (!this.shotsOffTarget) this.eventsToShow = this.eventsToShow.filter((e) => e.symbolToShow !== "🥾");
      // TEST EVENT BELOW:
      if (false) {
        this.eventsToShow.push({
          id: "TEST ID",
          text: "TEST GOAL' - 1st Goal - Redmond (Southampton) - Shot",
          symbolToShow: "⚽",
          minuteToShow: "54'",
          minuteSequential: 15400,
          brClock: "1T 55:00",
          homeOrAway: "H",
          minute: 55,
          minuteToUse: 45.5,
          class: "ml-n2 my-n2 text-h6",
        });
      }
      this.$forceUpdate();
    },
  },
};
</script>

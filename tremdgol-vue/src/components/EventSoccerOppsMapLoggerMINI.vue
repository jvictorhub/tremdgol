<template>
  <v-sheet>
    <v-sheet class="mt-0 mb-0 mx-1 d-flex flex-column justify-start align-center elevation-0 transparent">
      <!-- :height="470 + (show_TOBPOBminiDash_pobsCharts ? 720 : 0) + (show_SoccerOppsMap ? 100 : 0)" -->
      <v-sheet class="mt-0 d-flex flex-row justify-center align-center transparent">
        <v-tooltip v-if="showPressureSlider" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-container fluid>
              <v-sheet class="elevation-0 d-flex flex-column text-center align-center rounded-lg" width="11" v-bind="attrs" v-on="on">
                <h2>{{ pressure0to7_emojis[pressure0to7_home] }}</h2>
                <v-slider v-model="pressure0to7_home" :thumb-size="33" vertical max="7" min="0" inverse-label :disabled="lockedToInsertNewShapes">
                  <template v-slot:thumb-label="{ value }">
                    <span class="text-h5">{{ pressure0to7_emojis[value] }}</span>
                  </template>
                </v-slider>
              </v-sheet>
            </v-container>
          </template>
          <span style="white-space: pre">
            <h3>{{ pressureSlider_tooltip_text }}</h3>
          </span>
        </v-tooltip>
        <v-sheet class="d-flex flex-column elevation-0 transparent">
          <canvas ref="canvas1" class="canvas"></canvas>
        </v-sheet>
        <v-tooltip v-if="showPressureSlider" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-container fluid>
              <v-sheet class="elevation-0 d-flex flex-column text-center align-center rounded-lg" width="11" v-bind="attrs" v-on="on">
                <h2>{{ pressure0to7_emojis[pressure0to7_away] }}</h2>
                <v-slider v-model="pressure0to7_away" :thumb-size="33" vertical max="7" min="0" inverse-label :disabled="lockedToInsertNewShapes">
                  <template v-slot:thumb-label="{ value }">
                    <span class="text-h5">{{ pressure0to7_emojis[value] }}</span>
                  </template>
                </v-slider>
              </v-sheet>
            </v-container>
          </template>
          <span style="white-space: pre">
            <h3>{{ pressureSlider_tooltip_text }}</h3>
          </span>
        </v-tooltip>
      </v-sheet>

      <v-hover v-slot="{ hover }">
        <v-card :class="{ 'on-hover': hover } + ` mt-n1 `" class="mx-auto">
          <v-sheet class="mt-n9 mb-0 d-flex flex-row elevation-0 transparent">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="grey lighten-0 d-flex flex-row rounded-xl"
                  :x-small="!hover"
                  :small="hover"
                  dark
                  @click="removeLastShape()"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="mx-1">mdi-undo</v-icon>
                </v-btn>
              </template>
              Undo last shape
            </v-tooltip>
            <v-menu
              offset-y
              transition="scale-transition"
              direction="right"
              :close-on-content-click="false"
              open-on-hover
              :nudge-width="300"
              z-index="999"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="primary rounded-xl" dark :x-small="!hover" :small="hover" v-bind="attrs" v-on="on">
                  <v-icon class="mx-1" :size="hover ? 18 : 18">mdi-cog</v-icon>
                </v-btn>
              </template>
              <v-sheet class="pa-2 elevation-3 rounded-lg grey lighten-1" max-width="590">
                <v-sheet class="pa-1 text-subtitle-2 rounded-lg">
                  <v-sheet class="pa-2">
                    1. Register events by clicking on the football pitch. No worry if you refresh the page, events registered still in LOCAL
                    STORAGE.<br />
                    2. Press "control" key to switch events insertion mode: shape or emoji (❌: Great Goal Chance Missed). <br />
                    3. Different mouse buttons will draw different shapes: <br />left click -> triangle<br />middle button -> square <br />
                    right click -> circle<br />
                    4. Press number key to change shape color (1-5) <br />
                    5. Available soon: Download the events as a csv (spreadsheet).
                  </v-sheet>
                  <v-sheet>
                    <v-sheet class="px-2 d-flex flex-row elevation-0 justify-space-between align-center" id="▶▶▶ COLORS ◀◀◀">
                      <v-radio-group class="mt-0 mb-0" v-model="radios_color" row dense hide-details>
                        <template v-slot:label> </template>
                        <v-radio value="yellow" dense>
                          <template v-slot:label> <strong class="yellow--text text--darken-3">Yellow (1)</strong> </template>
                        </v-radio>
                        <v-radio value="blue" dense>
                          <template v-slot:label> <strong class="primary--text">Blue (2)</strong> </template>
                        </v-radio>
                        <v-radio value="red" dense>
                          <template v-slot:label> <strong class="error--text text--darken-1">Red (3)</strong> </template>
                        </v-radio>
                        <v-radio value="black">
                          <template v-slot:label> <strong class="black--text">Black (4)</strong> </template>
                        </v-radio>
                        <v-radio value="grey">
                          <template v-slot:label> <strong class="grey--text text--darken-1">Grey (5)</strong> </template>
                        </v-radio>
                      </v-radio-group>
                    </v-sheet>
                    <v-sheet class="pa-3 d-flex flex-row elevation-0 justify-space-between align-center">
                      <v-sheet class="tooltip">
                        INFO
                        <span class="tooltiptext"> image source: https://pt.m.wikipedia.org/wiki/Ficheiro:Soccer_field_-_empty.svg<br /> </span>
                      </v-sheet>
                    </v-sheet>
                  </v-sheet>
                  <v-sheet class="px-2 d-flex flex-row elevation-0 justify-space-between align-center">
                    <v-btn v-if="twoTrianglesControls" color="ma-0 pa-1 grey lighten-2" small @click="clearAndRedraw()">
                      refresh
                      <v-icon class="mx-2">mdi-refresh</v-icon>
                    </v-btn>
                    <v-sheet v-if="twoTrianglesControls" class="ml-5 my-3 d-flex flex-row elevation-0 align-center" height="30" width="33%">
                      Two Triangles
                      <v-switch class="my-1 mx-2" v-model="drawTwoBigTrianglesBol" inset dense hide-details></v-switch>
                    </v-sheet>
                    <v-sheet v-if="twoTrianglesControls" class="ml-5 my-3 d-flex flex-row elevation-0 align-center" height="30" width="43%">
                      Force 2nd half GREY
                      <v-switch class="my-1 mx-2" v-model="forceAllShapesCreatedAt2ndHalfToGrey" inset dense hide-details></v-switch>
                    </v-sheet>
                  </v-sheet>
                </v-sheet>
              </v-sheet>
            </v-menu>
          </v-sheet>
        </v-card>
      </v-hover>

      <v-sheet
        v-if="showPobsScoreBelowCanvas || showMissedGreatChancesBelowCanvas || showPaceSliderBelowCanvas"
        class="d-flex flex-row align-center justify-center elevation-0"
      >
        <v-sheet v-if="showPaceSliderBelowCanvas" class="mx-1 my-1 d-flex elevation-3 rounded-lg" width="155">
          <v-container fluid class="mt-5 mb-n8 elevation-0">
            <v-slider v-model="currentPace012" :thumb-size="28" thumb-label="always" max="2" min="0">
              <template v-slot:thumb-label="{ value }">
                <span class="text-h6">{{ pace123emojis[value] }}</span>
              </template>
            </v-slider>
          </v-container>
        </v-sheet>
        <v-sheet v-if="showPobsScoreBelowCanvas" class="mx-1 d-flex flex-row align-end justify-end elevation-0">
          <span class="mx-3 text-h3">
            <b>{{ allShapes.filter((shape) => shape.type === "square" && shape.home_or_away === "H").length }}</b>
          </span>
          <span class="align-self-center text-h3">
            <v-icon color="black"> mdi-square </v-icon>
          </span>
          <span class="mx-3 text-h3">
            <b>{{ allShapes.filter((shape) => shape.type === "square" && shape.home_or_away === "A").length }}</b>
          </span>
        </v-sheet>
        <v-sheet v-if="showMissedGreatChancesBelowCanvas" class="mx-1 d-flex flex-column align-center justify-end elevation-0">
          <v-sheet class="d-flex mt-0 pt-1 mb-n1 justify-center align-center elevation-0">
            <v-menu offset-y transition="scale-transition" direction="right" :close-on-content-click="false" open-on-hover>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="error lighten-1 text-h5 rounded-xl"
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="addShape(canvas.width * 0.25, 0, radios_color, 'ppa_h')"
                >
                  {{ allShapes.filter((shape) => shape.type === "ppa_h").length }}
                </v-btn>
              </template>
              <v-sheet class="grey darken-3 d-flex align-center justify-center">
                <v-btn icon color="blue">
                  <v-icon class="mx-0" @click="removeLastShapeByType('ppa_h')">mdi-minus</v-icon>
                </v-btn>
              </v-sheet>
            </v-menu>
            <v-menu offset-y transition="scale-transition" direction="right" :close-on-content-click="false" open-on-hover :nudge-width="13">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="pa-0 ma-n2 grey darken-2 text-subtitle-1 rounded-xl" dark x-small v-bind="attrs" v-on="on" style="z-index: 999">
                  x
                </v-btn>
              </template>
              <v-sheet>
                <h2>TOTAL POSSIBLE PENALTY ATTACKS</h2>
                <b>
                  Possible Penalty Attacks: eventNotes.totalPossiblePenaltiesAttacks (
                  {{ Math.round(totalPossiblePenaltiesAttacks_perMinute * 100) / 100 + "" + totalPossiblePenaltiesAttacks_perMinute_emoji }}
                  )
                </b>
              </v-sheet>
            </v-menu>
            <v-menu offset-y transition="scale-transition" direction="right" :close-on-content-click="false" open-on-hover>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="error lighten-1 text-h5 rounded-xl"
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="addShape(canvas.width * 0.75, 0, radios_color, 'ppa_a')"
                >
                  {{ allShapes.filter((shape) => shape.type === "ppa_a").length }}
                </v-btn>
              </template>
              <v-sheet class="grey darken-3 d-flex align-center justify-center">
                <v-btn icon color="blue">
                  <v-icon class="mx-0" @click="removeLastShapeByType('ppa_a')">mdi-minus</v-icon>
                </v-btn>
              </v-sheet>
            </v-menu>
            {{ Math.round(totalPossiblePenaltiesAttacks_perMinute * 100) / 100 + "" + totalPossiblePenaltiesAttacks_perMinute_emoji }}
          </v-sheet>
          <v-sheet class="d-flex mb-n3 align-center">
            <span class="mx-1 text-h4">
              <b>{{ allShapes.filter((shape) => shape.type === "greatChanceMissed" && shape.home_or_away === "H").length }}</b>
            </span>
            <v-tooltip v-if="showPressureSlider" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-container fluid>
                  <v-sheet class="elevation-0 d-flex flex-column text-center align-center rounded-lg" width="11" v-bind="attrs" v-on="on">
                    <span class="align-self-center text-h6"> ❌ </span>
                  </v-sheet>
                </v-container>
              </template>
              <v-sheet class="pa-2 rounded d-flex flex-column flex-wrap text-wrap" max-width="800">
                <h1>GOLPERDIDO.COM <br />Missed Great Chances [10+% xG]</h1>
                <br />
                <h2>
                  Missed Great Chance = any dangerous attacks that has a chance of scoring greater than 10% (xG). Don't have to be a shot. Not all
                  great chances comes from shots.
                </h2>
                <h2>In other words: an attack that if repeats 10 times, at least 1 become a goal.</h2>
                <h2>A good match to over goals has 3 MGC for each 10 minutes (0.33 per minute)</h2>
                <br />
                <v-sheet
                  class="d-flex my-1 pa-2 elevation-2"
                  v-for="shape in allShapes.filter((shape) => shape.type === 'greatChanceMissed')"
                  :key="shape.x + '_' + shape.y + '_' + shape.date"
                >
                  <h3>{{ shape }}</h3>
                </v-sheet>
              </v-sheet>
            </v-tooltip>
            <span class="mx-1 text-h4">
              <b>{{ allShapes.filter((shape) => shape.type === "greatChanceMissed" && shape.home_or_away === "A").length }}</b>
            </span>
            {{ Math.round(totalMissedGreatChances_perMinute * 100) / 100 }}
            <span class="ml-2 text-h5">
              <b>{{ totalMissedGreatChances_perMinute_emoji }}</b>
            </span>
          </v-sheet>
          <v-sheet class="d-flex mb-n2 align-center">
            <span class="mx-1 text-h4">
              <b>{{ allShapes.filter((shape) => shape.type === "attackWithSpace" && shape.home_or_away === "H").length }}</b>
            </span>
            <v-tooltip v-if="showPressureSlider" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-container fluid>
                  <v-sheet class="elevation-0 d-flex flex-column text-center align-center rounded-lg" width="11" v-bind="attrs" v-on="on">
                    <span class="align-self-center text-"> ⏪⏩ </span>
                  </v-sheet>
                </v-container>
              </template>
              <v-sheet class="pa-2 rounded d-flex flex-column flex-wrap text-wrap" max-width="800">
                <h1>attackWithSpace <br />attackWithSpace</h1>
                <br />
                <h2>attackWithSpace= any dangerous attacks that has free/open space. the most important thing to detect goals in a soccer match.</h2>
                <br />
                <v-sheet
                  class="d-flex my-1 pa-2 elevation-2"
                  v-for="shape in allShapes.filter((shape) => shape.type === 'attackWithSpace')"
                  :key="shape.x + '_' + shape.y + '_' + shape.date"
                >
                  <h3>{{ shape }}</h3>
                </v-sheet>
              </v-sheet>
            </v-tooltip>
            <span class="mx-1 text-h4">
              <b>{{ allShapes.filter((shape) => shape.type === "attackWithSpace" && shape.home_or_away === "A").length }}</b>
            </span>
            {{ Math.round(totalAttackWithSpace_perMinute * 100) / 100 }}
            <span class="ml-2 text-h5">
              <b>{{ totalAttackWithSpace_perMinute_emoji }}</b>
            </span>
          </v-sheet>
        </v-sheet>
      </v-sheet>
      <v-sheet v-if="allShapesList">
        <v-sheet class="mx-2 elevation-3 rounded-lg" width="100%" @click="isAllShapesListVisible = !isAllShapesListVisible" max-width="500">
          All Shapes list
          <v-icon class="mx-2">{{ isAllShapesListVisible ? "mdi-eye" : "mdi-eye-off" }}</v-icon>
        </v-sheet>
        <v-sheet v-if="isAllShapesListVisible" max-width="500">
          <v-sheet
            class="d-flex my-1 pa-2 elevation-2 text-wrap text-subtitle-2"
            v-for="shape in allShapes"
            :key="shape.x + '_' + shape.y + '_' + new Date(shape.date).toISOString()"
          >
            {{ shape }}
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  // STACKOVERFLOW https://medium.com/@scottmatthew/using-html-canvas-with-vue-js-493e5ae60887
  // STACKOVERFLOW
  name: "EventSoccerOppsMapLoggerMINI",

  components: {},

  props: [
    "event",
    "canvasSizeFactor",
    "showPressureSlider",
    "twoTrianglesControls",
    "lockedToInsertNewShapes",
    "hidePOBsCharts",
    "showMinuteInsideCanvas",
    "showPobsScoreBelowCanvas",
    "showMissedGreatChancesBelowCanvas",
    "showPaceSliderBelowCanvas",
    "allShapesList",
  ],

  data() {
    return {
      lastEventUpdated_at: null,
      //homeColors: 'rgba(255, 0, 0, 0.5)', // vuetify doesnt work for hexadecimal colors or RGBA for v-sheet component
      homeColors: "blue darken-3",
      awayColors: "grey",
      canvas: null,
      ctx: null,
      allShapes: [],
      allEventsShapesFromStorage: { description: "local storage for event canvas shapes", events: [] },
      background: null,
      radios_color: "yellow",
      show_TOBPOBminiDash_pobsCharts: true,
      show_SoccerOppsMap: false,
      pace123emojis: ["❄", "😶", "🔥"],
      currentPace012: 1,
      pressure0to7_emojis: ["🥴", "😩", "😕", "😶", "🙂", "🤓", "😎", "🔥"],
      pressure0to7_home: 3,
      pressure0to7_away: 3,
      pressureSlider_tooltip_text: `Nível 1 🥴 - todo fechado não sai do campo defesa
Nível 2 😩- predominantemente recuado, mas alguns contra ataques
Nível 3 😕- defende mais do que ataca
Nível 4 😶- trocacao ataca e defende
Nível 5 🙂- ataca mais do que defende
Nível 6 🤓- propõe o jogo, mas ainda é atacado lá atrás
Nível 7 😎- padrão aa, só ataque
Nível 8 🔥 - padrão só ataque com entradas em posse na área e gols perdidos sem parar`,
      drawTwoBigTrianglesBol: true,
      forceAllShapesCreatedAt2ndHalfToGrey: false,
      totalMissedGreatChances_perMinute: 0,
      totalMissedGreatChances_perMinute_emoji: "⚪",
      totalAttackWithSpace_perMinute: 0,
      totalAttackWithSpace_perMinute_emoji: "⚪",
      isAllShapesListVisible: false,
      totalPossiblePenaltiesAttacks_perMinute: 0,
      totalPossiblePenaltiesAttacks_perMinute_emoji: "⚪",
    };
  },
  mounted() {
    this.lastEventUpdated_at = this.event.updated_at;
    //this.canvas = document.getElementById("canvas1");
    this.canvas = this.$refs["canvas1"];
    this.ctx = this.canvas.getContext("2d");
    //console.log(this.canvas);
    //console.log(this.ctx);

    //this.canvas.width = 105 * 4.2; // 105 x 68m
    //this.canvas.height = 68 * 4.2;
    this.canvas.width = 105 * 4.2 * this.canvasSizeFactor; // 105 x 68m
    this.canvas.height = 68 * 4.2 * this.canvasSizeFactor;

    document.addEventListener("contextmenu", function (event) {
      // only to prevent contextmenu to open (Right click)
      event.preventDefault();
      console.log("event contextmenu " + event);
    });
    /*
     */
    this.canvas.addEventListener("mousedown", (event) => {
      // STACKOVERFLOW https://stackoverflow.com/questions/47737404/detecting-left-and-right-mouse-events-for-a-canvas-game
      // STACKOVERFLOW https://stackoverflow.com/questions/1795734/triggering-onclick-event-using-middle-click
      // STACKOVERFLOW https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
      // STACKOVERFLOW https://www.w3schools.com/jsref/obj_mouseevent.asp
      //console.error(event);
      event.preventDefault();

      if (event.button === 0) {
        // left click
        if (this.canvas.classList.contains("canvasCrossCursor")) {
          console.log("left click = {x:" + event.offsetX + ", y:" + event.offsetY + "}");
          this.addShape(event.offsetX + 3, event.offsetY + 7, this.radios_color, "greatChanceMissed");
          //this.toggleCanvasCrossCursor();
        } else {
          console.log("left click = {x:" + event.offsetX + ", y:" + event.offsetY + "}");
          this.addShape(event.offsetX, event.offsetY, this.radios_color, "triangle");
        }
      } else if (event.button === 1) {
        console.log("aux (middle) click = {x:" + event.offsetX + ", y:" + event.offsetY + "}");
        this.addShape(event.offsetX, event.offsetY, this.radios_color, "square");
      } else if (event.button === 2) {
        if (this.canvas.classList.contains("canvasCrossCursor")) {
          console.log("right click = {x:" + event.offsetX + ", y:" + event.offsetY + "}");
          this.addShape(event.offsetX + 3, event.offsetY + 7, this.radios_color, "attackWithSpace");
          //this.toggleCanvasCrossCursor();
        } else {
          console.log("right click = {x:" + event.offsetX + ", y:" + event.offsetY + "}");
          this.addShape(event.offsetX, event.offsetY, this.radios_color, "circle");
        }
      }
    });

    this.canvas.addEventListener("mousemove", (event) => {
      // STACKOVERFLOW https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
      let cursorTypeToApply = "copy";
      this.allShapes.map((shape) => {
        if (shape.x - event.offsetX < 10 && shape.x - event.offsetX >= 0 && shape.y - event.offsetY < 10 && shape.y - event.offsetY >= 0) {
          console.log("mouse over shape x:", shape.x, shape.x - event.offsetX, "y:", shape.y, shape.y - event.offsetY, shape);
          cursorTypeToApply = "pointer"; // none , copy etc
        }
      });
      document.querySelector(":root").style.setProperty("--canvasCursor", cursorTypeToApply);
    });
    this.canvas.addEventListener("mouseover", (event) => {
      // STACKOVERFLOW https://developer.mozilla.org/pt-BR/docs/Web/API/Element/mouseover_event
      console.log("mouseover x:", event.offsetX, "y:", event.offsetY);
    });
    this.canvas.addEventListener("mouseout", (event) => {
      // STACKOVERFLOW https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event
      console.log("mouseout x:", event.offsetX, "y:", event.offsetY);
    });

    // Add event listener on keydown
    document.addEventListener("keydown", (event) => {
      const NAME = event.key;
      const CODE = event.code;
      // Alert the key name and key code on keydown
      console.log(`Key pressed ${NAME} \r\n Key code value: ${CODE}`);
      switch (NAME) {
        case "1":
          //document.getElementById("radio_yellow").checked = true;
          this.radios_color = `yellow`;
          break;
        case "2":
          this.radios_color = `blue`;
          break;
        case "3":
          this.radios_color = `red`;
          break;
        case "4":
          this.radios_color = `black`;
          break;
        case "5":
          this.radios_color = `grey`;
          break;
        case "Control":
          console.warn("Control pressed", this.canvas.classList);
          this.toggleCanvasCrossCursor();
          break;
        default:
          break;
      }
    });
    this.background = new Image();
    this.background.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Soccer_field_-_empty.svg";

    // Make sure the image is loaded first otherwise nothing will draw.
    this.background.onload = function () {
      //this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    };

    this.home_image = new Image();
    this.home_image.src = "https://assets.b365api.com/images/team/m/" + this.event.home.image_id + ".png";
    this.away_image = new Image();
    this.away_image.src = "https://assets.b365api.com/images/team/m/" + this.event.away.image_id + ".png";
    this.drawBackground();

    this.loadDataFromBrowserLocalStorage();
    this.clearAndRedraw();
    //code before the pause
    console.warn("waiting 0.5s to force rerender...");
    setTimeout(() => {
      this.clearAndRedraw();
      this.$forceUpdate();
      console.log("0.5s passed!");
    }, 500);
    this.canvas.classList.add("canvasCrossCursor");
  },
  watch: {
    forceAllShapesCreatedAt2ndHalfToGrey(newValue) {
      console.warn("forceAllShapesCreatedAt2ndHalfToGrey switched = " + newValue);
      this.clearAndRedraw();
    },
    allShapes(allShapes_newValue) {
      if (this.allEventsShapesFromStorage.events.filter((ev) => ev.event_id === this.event.id).length > 0) {
        const event = this.allEventsShapesFromStorage.events.filter((ev) => ev.event_id === this.event.id)[0];
        event.allShapes = allShapes_newValue;
      } else {
        this.allEventsShapesFromStorage.events.push({
          event: this.event.fullNameStringedWithClock,
          event_id: this.event.id,
          allShapes: allShapes_newValue,
        });
      }
      if (this.allEventsShapesFromStorage.events.length > 50) {
        // removing old events from the local storage (trash)
        this.allEventsShapesFromStorage.events = this.allEventsShapesFromStorage.events.splice(25); // splice removes the first X elements
      }
      localStorage.tremdgolWebAllEventsShapes = JSON.stringify(this.allEventsShapesFromStorage);
      this.calculateMGCandPPAaverages();
    },
    drawTwoBigTrianglesBol: function (new_value) {
      this.clearAndRedraw();
    },
    isOpen: function (new_value) {
      if (new_value === false) {
        this.$emit("set-overlay-dialog", new_value);
      } else {
        this.$emit("set-overlay-dialog", new_value);
      }
      console.log("%cset-overlay-dialog:" + new_value, "color:orange");
    },
    $props: {
      handler(val) {
        if (this.lastEventUpdated_at === this.event.updated_at) {
          // event did not update, nothing to do
        } else {
          this.lastEventUpdated_at = this.event.updated_at;
          setTimeout(() => {
            this.clearAndRedraw();
            this.$forceUpdate();
            console.log("1s passed!");
            console.timeLog("toggleVisibleNewTremdGolEventsComponents");
          }, 1000);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    toggleCanvasCrossCursor() {
      // STACKOVERFLOW https://developer.mozilla.org/pt-BR/docs/Web/API/Element/classList
      //if (this.canvas.classList.contains("canvasCrossCursor")) {
      if (this.canvas.classList.contains("canvasCrossCursor")) {
        this.canvas.classList.remove("canvasCrossCursor");
      } else {
        this.canvas.classList.add("canvasCrossCursor");
        //this.canvas.classList.add("canvasArrowRightCursor");
      }
    },
    loadDataFromBrowserLocalStorage() {
      // STACKOVERFLOW https://br.vuejs.org/v2/cookbook/client-side-storage.html
      if (localStorage.tremdgolWebAllEventsShapes) {
        this.allEventsShapesFromStorage = JSON.parse(localStorage.tremdgolWebAllEventsShapes);
        if (this.allEventsShapesFromStorage.events.filter((ev) => ev.event_id === this.event.id).length > 0) {
          this.allShapes = this.allEventsShapesFromStorage.events.filter((ev) => ev.event_id === this.event.id)[0].allShapes;
        }
      }
    },
    drawBackground() {
      this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
      // STACKOVERFLOW https://stackoverflow.com/questions/2916938/how-to-draw-transparent-image-with-html5-canvas-element
      // STACKOVERFLOW https://stackoverflow.com/questions/2359537/how-to-change-the-opacity-alpha-transparency-of-an-element-in-a-canvas-elemen
      this.ctx.globalAlpha = 0.55;
      const logosWidth = 77 * this.canvasSizeFactor;
      const logosHeight = 77 * this.canvasSizeFactor;
      const logosMarginTop = 113 * this.canvasSizeFactor;
      const homeLogoMarginLeft = this.canvas.width / 4.25;
      const awayLogoMarginLeft = this.canvas.width / 1.7;
      if (this.event.home.image_id) this.ctx.drawImage(this.home_image, homeLogoMarginLeft, logosMarginTop, logosWidth, logosHeight); // home logo
      if (this.event.away.image_id) this.ctx.drawImage(this.away_image, awayLogoMarginLeft, logosMarginTop, logosWidth, logosHeight); // away logo
      this.ctx.globalAlpha = 1;
    },
    addShape(x, y, color, type) {
      console.log("addShape: " + type + " | " + this.event.fullName);
      if (!this.lockedToInsertNewShapes) {
        this.allShapes.push({
          x: x,
          y: y,
          //color: document.querySelector('input[name="input_radio_color"]:checked').value,
          color: color,
          //type: document.querySelector('input[name="input_radio_type"]:checked').value,
          type: type,
          clock: this.event.minute,
          period: this.event.enClock.includes("2nd") ? 2 : 1,
          date: new Date(),
          home_or_away: x < this.canvas.width / 2 ? "H" : "A",
          pace: this.currentPace012,
          stars123: 0,
        });
        this.clearAndRedraw();
      } else {
        console.warn("lockedToInsertNewShapes === true");
      }
    },
    deleteShape(value) {
      console.warn("chegou evento = " + value);
      console.warn("typeof value = " + typeof value);
      this.allShapes = this.allShapes.filter((s) => s.date !== value);
      this.clearAndRedraw();
    },
    removeLastShapeByType(shapeType) {
      const lastShapeWithSpecificType = this.allShapes.filter((s) => s.type === shapeType).pop();
      if (lastShapeWithSpecificType) {
        this.allShapes = this.allShapes.filter((s) => s.date !== lastShapeWithSpecificType.date);
      }
    },
    clearAndRedraw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBackground();
      this.drawAllShapes();
      this.drawScoresAndClock();
      this.calculateMGCandPPAaverages();
    },
    drawScoresAndClock() {
      this.ctx.font = "50px Comic Sans MS";
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(255, 255, 255, " + 0.36 + ")";
      this.ctx.fillText(
        "" + (this.event.ss ? this.event.ss.substring(0, this.event.ss.indexOf("-")) : "0"),
        this.canvas.width / 3.1,
        this.canvas.height / 3.75
      );
      this.ctx.fillText(
        "" + (this.event.ss ? this.event.ss.substring(this.event.ss.indexOf("-") + 1, this.event.ss.length) : "0"),
        this.canvas.width / 1.48,
        this.canvas.height / 3.75
      );
      if (this.showMinuteInsideCanvas) {
        this.ctx.font = "25px Comic Sans MS";
        this.ctx.fillStyle = "rgba(255, 255, 255, " + 0.97 + ")";
        const minuteTextToFill = this.event.enClock === "half-time" ? "HT" : this.event.enClock === "FT" ? "FT" : this.event.minute + "'";
        this.ctx.fillText(minuteTextToFill, this.canvas.width / 2, this.canvas.height / 1.25);
      }
    },
    removeLastShape() {
      if (!this.lockedToInsertNewShapes) {
        this.allShapes.pop();
        this.clearAndRedraw();
      } else {
        console.warn("lockedToInsertNewShapes === true");
      }
    },
    drawAllShapes() {
      this.allShapes.map((shape) => {
        const borderAdjustment = 9;
        let colorToUse = shape.color;
        if (this.forceAllShapesCreatedAt2ndHalfToGrey && shape.period === 2) {
          colorToUse = `grey`;
        }
        switch (shape.type) {
          case "square":
            //this.drawSquare(shape.x-this.canvas.getBoundingClientRect().left, shape.y-this.canvas.getBoundingClientRect().top, shape.color);
            this.drawSquare(shape.x + borderAdjustment, shape.y + borderAdjustment, colorToUse);
            break;
          case "circle":
            this.drawCircle(shape.x + borderAdjustment, shape.y + borderAdjustment, colorToUse);
            break;
          case "triangle":
            this.drawTriangle(shape.x + borderAdjustment, shape.y + borderAdjustment, colorToUse);
            break;
          case "greatChanceMissed":
            this.drawEmoji(shape.x + borderAdjustment, shape.y + borderAdjustment, "❌", 18);
            break;
          case "attackWithSpace":
            if (shape.home_or_away === "A") this.drawEmoji(shape.x + borderAdjustment, shape.y + borderAdjustment, "⏩", 13);
            // ← → ▶ ➡ ⏩ ⏪ ◀  ⬅
            else if (shape.home_or_away === "H") this.drawEmoji(shape.x + borderAdjustment, shape.y + borderAdjustment, "⏪", 13);
            break;
          default:
            break;
        }
      });
      console.log("total shapes = " + this.allShapes.length);
      this.drawTwoBigTriangles();
    },
    drawCircle(x, y, color) {
      const circleRadius = 3;
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(x - circleRadius * 3, y - circleRadius * 3, circleRadius * 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    },
    drawSquare(x, y, color) {
      console.log("drawSquare()");
      const sideSize = 10;
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.rect(x - sideSize * 1.4, y - sideSize * 1.4, sideSize, sideSize);
      this.ctx.fill();
      this.ctx.stroke();
    },
    drawTriangle(x, y, color) {
      const sideSize = 12;
      const newX = x - (sideSize * 2) / 3;
      const newY = y - sideSize * 1.5;
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(newX, newY);
      this.ctx.lineTo(newX + sideSize / 2, newY + sideSize);
      this.ctx.lineTo(newX - sideSize / 2, newY + sideSize);
      this.ctx.lineTo(newX, newY);
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.closePath();
    },
    drawTwoBigTriangles() {
      if (this.twoTrianglesControls && this.drawTwoBigTrianglesBol) {
        this.ctx.strokeStyle = "#ff8080";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(21 * this.canvasSizeFactor, 50 * this.canvasSizeFactor);
        this.ctx.lineTo(120 * this.canvasSizeFactor, 143 * this.canvasSizeFactor);
        this.ctx.lineTo(21 * this.canvasSizeFactor, 235 * this.canvasSizeFactor);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(421 * this.canvasSizeFactor, 50 * this.canvasSizeFactor);
        this.ctx.lineTo(320 * this.canvasSizeFactor, 143 * this.canvasSizeFactor);
        this.ctx.lineTo(421 * this.canvasSizeFactor, 235 * this.canvasSizeFactor);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    },
    drawEmoji(x, y, emoji, size) {
      this.ctx.font = size + "px Comic Sans MS";
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(50, 50, 255, " + 0.89 + ")";
      this.ctx.fillText(emoji, x, y);
    },
    calculateMGCandPPAaverages() {
      this.totalMissedGreatChances_perMinute = this.allShapes.filter((shape) => shape.type === "greatChanceMissed").length / this.event.minute;
      this.totalMissedGreatChances_perMinute_emoji =
        this.totalMissedGreatChances_perMinute >= 0.25 ? "🟢" : this.totalMissedGreatChances_perMinute >= 0.13 ? "🟡" : "🔴";
      this.totalAttackWithSpace_perMinute = this.allShapes.filter((shape) => shape.type === "attackWithSpace").length / this.event.minute;
      this.totalAttackWithSpace_perMinute_emoji =
        this.totalAttackWithSpace_perMinute >= 0.5 ? "🟢" : this.totalAttackWithSpace_perMinute >= 0.23 ? "🟡" : "🔴";
      this.totalPossiblePenaltiesAttacks_perMinute = this.allShapes.filter((shape) => shape.type.includes("ppa_")).length / this.event.minute;
      this.totalPossiblePenaltiesAttacks_perMinute_emoji =
        this.totalPossiblePenaltiesAttacks_perMinute >= 0.85 ? "🟢" : this.totalPossiblePenaltiesAttacks_perMinute >= 0.55 ? "🟡" : "🔴";
    },
  },
};
</script>
<style scoped>
:root {
  /* STACKOVERFLOW https://www.w3schools.com/css/css3_variables_javascript.asp */
  /* STACKOVERFLOW https://www.w3schools.com/cssref/pr_class_cursor.asp */
  --canvasCursor: copy;
}

.canvas {
  cursor: var(--canvasCursor);
}

.canvasCrossCursor {
  /* STACKOVERFLOW https://www.youtube.com/watch?v=ANkVAvvBHLU */
  cursor: url("data:image/svg+xml;utf-8, <svg xmlns = 'http://www.w3.org/2000/svg' width='32' height='32' viewport='0 0 100 100' style='fill:black; font-size:18px;'><text y= '50%' >❌</text></svg>"),
    auto;
}

/* STACKOVERFLOW https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_custom_scrollbar2 */
/* width */
::-webkit-scrollbar {
  width: 7px;
}
/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(228, 225, 225);
  border-radius: 10px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(228, 225, 225);
  border-radius: 10px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(182, 178, 178);
}

/* STAFCKOVERFLOW  https://www.w3schools.com/css/css_tooltip.asp */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted rgb(199, 193, 193);
}

.tooltip .tooltiptext {
  font-size: 80%;
  visibility: hidden;
  width: 465px;
  background-color: rgb(223, 217, 217);
  color: rgb(37, 37, 37);
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>

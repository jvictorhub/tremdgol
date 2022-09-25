<template>
  <v-menu offset-y :close-on-content-click="false" open-on-hover>
    <template v-slot:activator="{ on, attrs }">
      <v-sheet class="mx-2 d-flex flex-column justify-center transparent" v-bind="attrs" v-on="on">
        <v-btn color="ma-0 pa-1 grey lighten-2 " x-small fab>
          <v-icon class="mx-2">mdi-dots-vertical</v-icon>
        </v-btn>
      </v-sheet>
    </template>
    <v-sheet class="px-5 py-4 white lighten-2 d-flex flex-column align-center text-center">
      <v-sheet
        class="d-flex flex-row align-center justify-space-around text-caption text-center pa-1 px-2 elevation-2 black--text font-weight-medium grey lighten-3 rounded-lg"
      >
        Team market values
        <v-sheet class="ml-1 d-flex flex-column align-center justify-center elevation-0 transparent" width="44">
          <v-switch
            :value="this.$store.state.showTeamsMarketValues"
            class="mt-0 ml-2"
            inset
            dense
            hide-spin-buttons
            hide-details
            @change="toggleShowTeamsMarketValues"
          ></v-switch>
        </v-sheet>
      </v-sheet>
      <v-sheet class="mt-4">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey lighten-3" v-bind="attrs" small v-on="on"> ABOUT </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> About this app</v-card-title>

            <v-card-text>
              <v-sheet class="mt-5 mx-5 text-wrap text-center text-caption text--secondary">
                Responsive web page built with <b>VUE.JS</b>, using <b>JAVASCRIPT</b>, <b>HTML</b> and <b>CSS</b>. In addition, to faster and beauty
                design I used <b>VUETIFY</b> UI library and some <b>MATERIAL DESIGN ICONS</b>. Hosted in a Linux <b>UBUNTU</b> dedicated server at
                <b>DIGITALOCEAN</b> cloud infraestructure. Version control by <b>GIT</b> and <b>GITHUB</b>. Reverse proxy with <b>NGINX</b>.
                <b>SSL</b> certification with <b>CERTBOT</b> and Linux process management with <b>PM2</b>. <br />Screen res:
                {{ $vuetify.breakpoint.width }}x{{ $vuetify.breakpoint.height }} <br /><br />No data is collected from your device.
              </v-sheet>
              <v-sheet class="mt-3 text-caption text-center">
                Try the Android TremdGol app. Available on
                <a href="https://play.google.com/store/apps/details?id=com.bolanarede.tremdgol_free" target="_blank"> Google Play Store</a>
              </v-sheet>
              <v-sheet class="mt-3 text-caption text-center"> 2022 <a href="https://github.com/jvictorjs" target="_blank">@jvictorjs</a> </v-sheet>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-sheet>
    </v-sheet>
  </v-menu>
</template>

<script>
export default {
  name: "SettingsMenu",

  components: {},

  props: [],

  data() {
    return {
      dialog: false,
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    toggleShowTeamsMarketValues() {
      this.$store.commit("setShowTeamsMarketValues", !this.$store.state.showTeamsMarketValues);
    },
  },
};
</script>

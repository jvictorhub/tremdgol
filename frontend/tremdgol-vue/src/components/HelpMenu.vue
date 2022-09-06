<template>
  <v-menu offset-y :close-on-content-click="true">
    <template v-slot:activator="{ on, attrs }">
      <v-sheet class="mx-2 d-flex flex-column justify-center transparent" v-bind="attrs" v-on="on">
        <v-btn color="ma-0 pa-1 grey lighten-2 " x-small fab>
          <v-icon class="mx-2">mdi-help</v-icon>
        </v-btn>
      </v-sheet>
    </template>
    <v-sheet class="px-5 py-4 white d-flex flex-column align-center">
      <v-sheet class="text-subtitle-2">
        Try the Android TremdGol app.
        <br />
        Available on
        <a href="https://play.google.com/store/apps/details?id=com.bolanarede.tremdgol_free" target="_blank"> Google Play Store</a>
      </v-sheet>
      <v-sheet class="ma-3">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey lighten-2" v-bind="attrs" small v-on="on"> ABOUT </v-btn>
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
                <br />
                2022 <a href="https://github.com/jvictorjs" target="_blank">@jvictorjs</a>
              </v-sheet>
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
  name: "TremdGolLogo",

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
  methods: {},
};
</script>

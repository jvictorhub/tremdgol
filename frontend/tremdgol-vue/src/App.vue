<template>
  <v-app>
    <v-sheet fluid fill-height :class="this.$store.state.appBackgroundColor + ' fill-height'">
      <v-main>
        <router-view />
      </v-main>
    </v-sheet>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

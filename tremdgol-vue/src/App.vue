<template>
  <v-app>
    <v-container
      :class="'d-flex align-start justify-center ' + $store.state.appBackgroundColor"
      fluid
      fill-height
      :height="$vuetify.breakpoint.height - 20"
      :width="$vuetify.breakpoint.width - 20"
    >
      <v-main>
        <router-view />
      </v-main>
    </v-container>
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

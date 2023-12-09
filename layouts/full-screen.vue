<template>
  <v-app
    :style="{
      background: $vuetify.theme.themes[theme].background,
      color: $vuetify.theme.themes[theme].foreground,
      // text color
      fontColor: $vuetify.theme.themes[theme].fontColor,
    }"
  >
    <v-container fill-height>
      <nuxt />
    </v-container>
  </v-app>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    },
  },
}
</script>
<style scoped>
#app {
  font-family: 'Noto Sans Thai', sans-serif;
}
</style>

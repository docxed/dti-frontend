<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-squeegee</v-icon>
      </v-btn>
    </template>
    <v-card max-width="224px">
      <v-card-text>
        <v-row justify="center">
          <v-col
            cols="4"
            class="text-center"
            v-for="(color, index) in colors"
            :key="`color-${index}`"
          >
            <v-btn :color="color" icon @click="changeThemePrimaryColor(color)">
              <v-icon>mdi-square</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  data() {
    return {
      colors: [
        '#D32F2F',
        '#FF3F80',
        '#9C27B0',
        '#673AB6',
        '#3849AB',
        '#1876D1',
        '#00A8F4',
        '#00BCD4',
        '#4DB6AC',
        '#4CAF4F',
        '#FF9800',
        '#FFC007',
      ],
    }
  },
  methods: {
    changeThemePrimaryColor(color) {
      this.$vuetify.theme.themes.light.primary = color
      this.$vuetify.theme.themes.dark.primary = color
      this.saveToLocalStorage(color)
    },
    saveToLocalStorage(color) {
      localStorage.setItem('theme-primary-color', color)
    },
  },
}
</script>

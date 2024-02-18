<template>
  <v-dialog
    :value="value"
    :scrollable="!$vuetify.breakpoint.xsOnly && !fullscreen"
    max-width="1200px"
    :fullscreen="$vuetify.breakpoint.xsOnly || fullscreen"
    persistent
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        <v-spacer />

        <v-btn color="red" small fab @click="$emit('update:value', false)">
          <v-icon color="white">mdi-close-circle</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-5">
        <slot v-if="value" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

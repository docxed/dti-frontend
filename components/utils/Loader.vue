<template>
  <v-dialog v-model="visible" persistent max-width="300">
    <v-card color="primary" dark>
      <v-card-text class="pa-3">
        <p>
          <strong>{{ title }}</strong>
        </p>
        <p>{{ description }}</p>
        <v-progress-linear indeterminate color="white" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('loader', ['visible', 'title', 'description']),
  },
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="cancel()">ยกเลิก</v-btn>
        <v-btn color="primary" text @click="confirm()">ยืนยัน</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('confirm', ['showDialog', 'title', 'message']),
  },
  methods: {
    confirm() {
      this.$store.dispatch('confirm/confirm')
    },
    cancel() {
      this.$store.dispatch('confirm/cancel')
    },
  },
}
</script>

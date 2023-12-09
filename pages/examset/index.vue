<template>
  <div>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>ชุดแบบทดสอบ</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <v-row justify="end">
          <v-col cols="12" sm="4">
            <v-btn block color="success" @click="dialogCreate = true">
              <v-icon left>mdi-plus</v-icon>สร้างชุดแบบทดสอบ</v-btn
            >
          </v-col>
        </v-row>
        <utils-data-table />
      </v-card-text>
    </v-card>
    <dialog-form :value.sync="dialogCreate" title="สร้างชุดแบบทดสอบ">
      <examset-form :headers="headers" :items="items" @close="dialogCreate = false" />
    </dialog-form>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: 'ชุดแบบทดสอบ',
    }
  },
  data() {
    return {
      items: [],
      dialogCreate: false,
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'ชื่อชุดแบบทดสอบ',
          value: 'title',
        },
      ]
    },
  },
}
</script>

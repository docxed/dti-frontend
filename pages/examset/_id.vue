<template>
  <div>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ item.title }}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <p><strong>รายละเอียด</strong> <v-quill-viewer :data="item.description" /></p>
        <p><strong>เวลาทำ</strong> {{ item.time }} นาที</p>
        <p><strong>รหัสผ่าน</strong> {{ item.is_password ? item.password : '-' }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: this.item.title || this.title,
    }
  },
  mounted() {
    this.fetch()
  },
  data() {
    return {
      title: 'ข้อมูลชุดแบบทดสอบ',
      item: {},
    }
  },
  methods: {
    async fetch() {
      try {
        this.$loader.show()
        const { data } = await this.$axios.get(`/examset/${this.$route.params.id}`)
        this.item = data
      } catch (err) {
        this.$router.push('/examset')
      } finally {
        this.$loader.hide()
      }
    },
  },
}
</script>

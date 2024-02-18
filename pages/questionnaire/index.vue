<template>
  <div>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="py-10">
        <div v-if="isDone">
          <p class="text-h5 text-center">ทำแบบสอบถามเรียบร้อยแล้ว</p>
        </div>
        <div v-else>
          <v-row justify="center">
            <v-col cols="12" sm="4">
              <v-btn block color="success" @click="dialog = true">เริ่มทำแบบสอบถาม</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <dialog-form :value.sync="dialog" :title="title">
      <questionnaire-form
        :type="this.$route.query.type"
        @on-create="fetch()"
        @close="dialog = false"
      />
    </dialog-form>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    if (!this.$route.query.type) {
      this.$router.replace('/home')
    }
    this.title =
      this.$route.query.type === 'ก่อน' ? 'แบบสอบถามก่อนทำแบบทดสอบ' : 'แบบสอบถามหลังทำแบบทดสอบ'
    this.fetch()
  },
  data() {
    return {
      title: '',
      items: [],
      isDone: false,
      dialog: false,
    }
  },
  watch: {
    $route() {
      this.title =
        this.$route.query.type === 'ก่อน' ? 'แบบสอบถามก่อนทำแบบทดสอบ' : 'แบบสอบถามหลังทำแบบทดสอบ'
      this.fetch()
    },
  },
  methods: {
    async fetch() {
      try {
        this.$loader.show()
        const { data } = await this.$axios.get('/reviewset', {
          params: {
            type: this.$route.query.type,
            user_id: this.$auth.user.id,
          },
        })
        this.items = data
        if (this.items.length > 0) {
          this.isDone = true
        } else {
          this.isDone = false
        }
      } catch (err) {
      } finally {
        this.$loader.hide()
      }
    },
  },
}
</script>

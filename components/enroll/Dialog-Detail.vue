<template>
  <div>
    <p><strong>รายละเอียด</strong> <v-quill-viewer :data="enroll.examset.description" /></p>
    <p><strong>เวลาทำ</strong> {{ enroll.examset.time }} นาที</p>
    <p><strong>จำนวนครั้งที่สามารถทำได้</strong> {{ enroll.examset.max_attempt }} ครั้ง</p>
    <p>
      <strong>จำนวนข้อ</strong>
      <v-progress-circular indeterminate color="primary" size="24" v-if="loadingExamsetitem" />
      <span v-else>{{ examsetitems.length }} ข้อ</span>
    </p>
    <v-row justify="center">
      <v-col cols="12" sm="4">
        <v-btn block color="success" @click="startEnroll()">
          <v-icon left>mdi-play</v-icon>เริ่มทำแบบทดสอบ</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    enroll: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.fetchExamsetitem()
  },
  data() {
    return {
      loadingExamsetitem: false,
      examsetitems: [],
    }
  },
  methods: {
    async fetchExamsetitem() {
      try {
        this.loadingExamsetitem = true
        const { data } = await this.$axios.get(`/examsetitem`, {
          params: {
            examset_id: this.enroll.examset._id,
            del_flag: false,
          },
        })
        this.examsetitems = data
      } catch (err) {
      } finally {
        this.loadingExamsetitem = false
      }
    },
    async startEnroll() {
      return this.$router.push(`/exam/my/${this.enroll.id}`)
    },
    isEnrollTimeOut(start, end) {
      // use this.$moment
      const now = this.$moment()
      return now.isAfter(end)
    },
  },
}
</script>

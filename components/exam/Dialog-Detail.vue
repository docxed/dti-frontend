<template>
  <div>
    <p><strong>รายละเอียด</strong> <v-quill-viewer :data="examset.description" /></p>
    <p><strong>เวลาทำ</strong> {{ examset.time }} นาที</p>
    <p><strong>จำนวนครั้งที่สามารถทำได้</strong> {{ examset.max_attempt }} ครั้ง</p>

    <p>
      <strong>จำนวนข้อ</strong>
      <v-progress-circular indeterminate color="primary" size="24" v-if="loadingExamsetitem" /><span
        v-else
        >{{ examsetitems.length }} ข้อ</span
      >
    </p>
    <v-row justify="center">
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="passcode"
          label="รหัสผ่าน"
          counter="4"
          maxlength="4"
          filled
          v-if="examset.is_password && is_lock"
        >
          <template v-slot:append>
            <v-btn icon color="primary" @click="unlocking()"> <v-icon>mdi-lock-open</v-icon></v-btn>
          </template>
        </v-text-field>
        <v-btn block color="success" @click="createEnroll()" :loading="loadingCreateEnroll" v-else>
          <v-icon left>mdi-play</v-icon>เริ่มทำแบบทดสอบ</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    examset: {
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
      loadingCreateEnroll: false,
      passcode: '',
      is_lock: true,
      loadingCreateEnroll: false,
    }
  },
  methods: {
    unlocking() {
      if (this.passcode !== this.examset.password) {
        this.$toast.error('รหัสผ่านไม่ถูกต้อง')
        return
      }
      this.$toast.success('ปลดล็อกสำเร็จ')
      this.is_lock = false
    },
    async fetchExamsetitem() {
      try {
        this.loadingExamsetitem = true
        const { data } = await this.$axios.get(`/examsetitem`, {
          params: {
            examset_id: this.examset.id,
            del_flag: false,
          },
        })
        this.examsetitems = data
      } catch (err) {
      } finally {
        this.loadingExamsetitem = false
      }
    },
    async createEnroll() {
      try {
        this.loadingCreateEnroll = true
        const { data } = await this.$axios.post(`/enroll`, {
          examset_id: this.examset.id,
        })
        this.$toast.success('เริ่มทำแบบทดสอบ')
        this.$router.replace(`/exam/my/${data.id}`)
      } catch (err) {
      } finally {
        this.loadingCreateEnroll = false
      }
    },
  },
}
</script>

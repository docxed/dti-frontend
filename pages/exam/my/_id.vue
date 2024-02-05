<template>
  <div v-if="enroll.examset">
    <v-row>
      <v-col cols="12" sm="3">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title> เวลาที่เหลือ </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <p>
              <strong>จำนวนครั้งที่สามารถทำได้</strong>
              {{ enroll.examset.max_attempt }} ครั้ง
            </p>
            <p>
              <strong>ระยะเวลา</strong> {{ enroll.examset.time }} นาที ({{
                this.$moment(enroll.start_datetime).format('HH:mm')
              }}
              - {{ this.$moment(enroll.end_datetime).format('HH:mm น.') }})
            </p>
            <p>
              <strong>คงเหลือ</strong>
              {{ remainingTime(enroll.start_datetime, enroll.end_datetime) }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" small @click="fetchEnrollAndExamsetItemAndAns()"
              ><v-icon>mdi-reload</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="9">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{ enroll.examset?.title }}</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-stepper v-model="current" flat alt-labels v-if="examsetitems.length > 0">
              <v-stepper-header>
                <template v-for="(question, index) in examsetitems">
                  <v-stepper-step :step="index + 1" :key="`header-${index + 1}`">
                    ข้อที่ {{ index + 1 }}
                  </v-stepper-step>
                  <v-divider
                    v-if="index !== examsetitems.length - 1"
                    :key="`divider-${index + 1}`"
                  />
                </template>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content
                  v-for="(question, index) in examsetitems"
                  :key="`content-${index + 1}`"
                  :step="index + 1"
                >
                  <v-card>
                    <v-card-text>
                      <p><v-quill-viewer :data="question.question" /></p>
                    </v-card-text>

                    <v-row justify="center">
                      <v-col cols="6" sm="4" v-if="index !== 0">
                        <v-btn block color="light" @click="current = current - 1"> กลับ </v-btn>
                      </v-col>
                      <v-col cols="6" sm="4" v-if="index !== examsetitems.length - 1">
                        <v-btn block color="primary" @click="current = current + 1">
                          ข้อถัดไป
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initialize()
  },
  data() {
    return {
      enroll: {},
      examsetitems: [],
      enrollitems: [],
      current: 1,
    }
  },
  methods: {
    initialize() {
      this.fetchEnrollAndExamsetItemAndAns()
    },
    async fetchEnrollAndExamsetItemAndAns() {
      try {
        this.$loader.show()
        const { data: enroll } = await this.$axios.get(`/enroll/${this.$route.params.id}`)
        this.enroll = enroll
        const { data: examsetitems } = await this.$axios.get(`/examsetitem`, {
          params: {
            examset_id: enroll.examset._id,
            del_flag: false,
          },
        })
        this.examsetitems = examsetitems
        const { data: enrollitems } = await this.$axios.get(`/enrollitem`, {
          params: {
            enroll_id: enroll.id,
            del_flag: false,
          },
        })
        this.enrollitems = enrollitems
      } catch (err) {
        this.$router.push('/exam/my')
      } finally {
        this.$loader.hide()
      }
    },
    remainingTime(start, end) {
      if (!start || !end) return ''
      const now = this.$moment()
      if (now.isBefore(start)) return 'ยังไม่ถึงเวลาทำแบบทดสอบ'
      if (now.isAfter(end)) return 'เวลาทำแบบทดสอบหมดแล้ว'
      return this.$moment(end).fromNow()
    },
  },
}
</script>

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
            <!-- <p>
              <strong>คงเหลือ</strong>
              {{ remainingTime(enroll.start_datetime, enroll.end_datetime) }}
            </p> -->
            <p class="error--text">
              <strong>*หากออกจากหน้านี้ หรือหากเวลาหมด ระบบจะไม่บันทึกคำตอบ</strong>
            </p>
          </v-card-text>
        </v-card>
        <v-card class="mt-3">
          <v-toolbar dark color="primary">
            <v-toolbar-title> จำนวนข้อ ({{ examsetitems.length }})</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-row dense>
              <v-col
                class="text-center"
                cols="3"
                sm="4"
                md="3"
                lg="3"
                xl="2"
                v-for="(question, index) in examsetitems"
                :key="`head-${index}`"
              >
                <v-chip
                  :color="current === index + 1 || question.answer.length > 0 ? 'primary' : 'light'"
                  @click="current = index + 1"
                >
                  <span v-if="question.answer.length > 0">
                    <v-icon small>mdi-check</v-icon>
                  </span>
                  <span v-else>
                    {{ index + 1 }}
                  </span>
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
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
              <!-- <v-stepper-header>
                <template v-for="(question, index) in examsetitems">
                  <v-stepper-step
                    editable
                    :step="index + 1"
                    :key="`header-${index + 1}`"
                    :complete="question.answer.length > 0"
                  >
                    ข้อที่ {{ index + 1 }}
                  </v-stepper-step>
                  <v-divider
                    v-if="index !== examsetitems.length - 1"
                    :key="`divider-${index + 1}`"
                  />
                </template>
              </v-stepper-header> -->
              <v-stepper-items>
                <v-stepper-content
                  v-for="(question, index) in examsetitems"
                  :key="`content-${index + 1}`"
                  :step="index + 1"
                >
                  <v-card>
                    <v-card-text>
                      <p><strong>ข้อที่</strong> {{ question.no }}</p>
                      <p><v-quill-viewer :data="question.question" /></p>
                      <br />
                      <form-file-field
                        :value="question.answer"
                        :accept="accept"
                        showSize
                        filled
                        :hint="fileHint"
                        persistentHint
                        autoUpload
                        @input="question.answer.push($event)"
                        @remove="
                          (index) =>
                            (question.answer = question.answer.filter((_, i) => i !== index))
                        "
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-row justify="center">
                        <v-col cols="6" sm="4" v-if="index !== 0">
                          <v-btn block color="light" @click="current = current - 1"> กลับ </v-btn>
                        </v-col>
                        <v-col cols="6" sm="4" v-if="index !== examsetitems.length - 1">
                          <v-btn block color="primary" @click="current = current + 1">
                            ข้อถัดไป
                          </v-btn>
                        </v-col>
                        <v-col cols="6" sm="4" v-if="index === examsetitems.length - 1">
                          <v-btn block color="success" @click="submit()">
                            <v-icon left> mdi-check </v-icon> ส่งคำตอบ
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-actions>
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
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    this.initialize()
  },
  data() {
    return {
      enroll: {},
      examsetitems: [],
      enrollitems: [],
      current: 1,
      fileHint: `รองรับไฟล์รูปภาพ, ไฟล์เอกสาร Word ขนาดไม่เกิน 5 MB`,
      accept: [
        'image/*',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      title: 'ทำแบบทดสอบ',
    }
  },
  methods: {
    async submit() {
      const notAnswered = []
      this.examsetitems.forEach((item, index) => {
        if (item.answer.length === 0) {
          notAnswered.push(index + 1)
        }
      })
      const message =
        notAnswered.length > 0
          ? `คุณยังไม่ได้ตอบข้อที่ ${notAnswered.map((item) => item).join(', ')}`
          : ''
      if (
        await this.$store.dispatch('confirm/showConfirmDialog', {
          title: 'ยืนยันการส่งคำตอบ',
          message,
        })
      ) {
        try {
          this.$loader.show()
          const enrollitems = this.examsetitems.map((item) => {
            return {
              enroll_id: this.enroll.id,
              examset_id: this.enroll.examset._id,
              examsetitem_id: item.id,
              answer: item.answer.length > 0 ? item.answer[0] : null,
            }
          })
          await this.$axios.post(`/enrollitem/bulk`, {
            enroll_id: this.enroll.id,
            enrollitems,
          })
          this.$toast.success('ส่งคำตอบสำเร็จ')
          this.$router.push('/exam/my')
        } catch (err) {
        } finally {
          this.$loader.hide()
        }
      }
    },
    async initialize() {
      this.fetchEnrollAndExamsetItemAndAns()
    },
    async fetchEnrollAndExamsetItemAndAns() {
      try {
        this.$loader.show()
        const { data: enroll } = await this.$axios.get(`/enroll/${this.$route.params.id}`)
        const { data: examsetitems } = await this.$axios.get(`/examsetitem`, {
          params: {
            examset_id: enroll.examset._id,
            del_flag: false,
          },
        })
        await this.$axios.post(`/enroll/validate`, {
          enroll_id: enroll.id,
        })
        this.enroll = enroll
        this.examsetitems = examsetitems.map((item) => {
          return {
            ...item,
            answer: [],
          }
        })
        this.title = enroll.examset.title
      } catch (err) {
        this.$router.replace('/exam/my')
      } finally {
        this.$loader.hide()
      }
    },
    // remainingTime(start, end) {
    //   if (!start || !end) return ''
    //   const now = this.$moment()
    //   if (now.isBefore(start)) return 'ยังไม่ถึงเวลาทำแบบทดสอบ'
    //   if (now.isAfter(end)) return 'เวลาทำแบบทดสอบหมดแล้ว'
    //   return this.$moment(end).fromNow()
    // },
  },
}
</script>

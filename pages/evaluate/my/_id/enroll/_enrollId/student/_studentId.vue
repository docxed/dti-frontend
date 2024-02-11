<template>
  <div v-if="enrollitems.length > 0">
    <v-row>
      <v-col cols="12" sm="3">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title> จำนวนข้อ ({{ enrollitems.length }})</v-toolbar-title>
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
                v-for="(question, index) in enrollitems"
                :key="`head-${index}`"
              >
                <v-chip
                  :color="
                    current === index + 1 || question.evaluate.score !== null ? 'success' : 'light'
                  "
                  @click="current = index + 1"
                >
                  <span v-if="question.evaluate.score !== null">
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
        <v-card class="mt-3">
          <v-toolbar dark color="primary">
            <v-toolbar-title> เพิ่มเติม </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <p>
              <v-icon>mdi-information</v-icon> ตรวจสอบเกณฑ์การประเมิน
              <a
                href="https://docs.google.com/document/d/1U15UeHEUpoXGSNXFolu7rUgefrl654MI/edit?usp=drive_link&ouid=104097543360671598514&rtpof=true&sd=true"
                target="_blank"
                >คลิกที่นี่</a
              >
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="9">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-stepper v-model="current" flat alt-labels v-if="enrollitems.length > 0">
              <v-stepper-items>
                <v-stepper-content
                  v-for="(question, index) in enrollitems"
                  :key="`content-${index + 1}`"
                  :step="index + 1"
                >
                  <v-card>
                    <v-card-text>
                      <p><strong>ข้อที่</strong> {{ question.no }}</p>
                      <p><v-quill-viewer :data="question.examsetitem.question" /></p>
                      <v-card>
                        <v-toolbar dark color="primary">
                          <v-toolbar-title> ส่วนประเมิน </v-toolbar-title>
                          <v-spacer />
                        </v-toolbar>
                        <v-card-text class="mx-auto">
                          <p>
                            <strong>องค์ประกอบ</strong>
                            <v-chip label color="primary">{{
                              question.examsetitem.category_id.name
                            }}</v-chip>
                          </p>
                          <p>
                            <strong>คำตอบ</strong>
                            <v-chip
                              label
                              color="info"
                              v-if="question.answer"
                              @click="openFile(question.answer)"
                            >
                              <v-icon left>mdi-paperclip</v-icon>
                              {{ truncateString(question.answer, 30) }}
                            </v-chip>
                            <v-chip label color="error" v-else>ไม่ได้ตอบ</v-chip>
                          </p>
                          <v-radio-group v-model="question.evaluate.score">
                            <v-radio
                              v-for="n in [0, 1, 2, 3, 4, 5]"
                              :key="n"
                              :label="`${n} คะแนน`"
                              :value="n"
                              :disabled="!question.answer"
                            />
                          </v-radio-group>

                          <v-textarea
                            v-model="question.evaluate.comment"
                            label="หมายเหตุ (ถ้ามี)"
                            outlined
                            auto-grow
                            clearable
                            rows="1"
                            :disabled="!question.answer"
                          />
                        </v-card-text>
                      </v-card>
                    </v-card-text>
                    <v-card-actions>
                      <v-row justify="center">
                        <v-col cols="6" sm="4" v-if="index !== 0">
                          <v-btn block color="light" @click="current = current - 1"> กลับ </v-btn>
                        </v-col>
                        <v-col cols="6" sm="4" v-if="index !== enrollitems.length - 1">
                          <v-btn block color="primary" @click="current = current + 1">
                            ข้อถัดไป
                          </v-btn>
                        </v-col>
                        <v-col cols="6" sm="4" v-if="index === enrollitems.length - 1">
                          <v-btn block color="success" @click="submit()">
                            <v-icon left> mdi-check </v-icon> ส่งการประเมิน
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
import { truncateString } from '~/utils/format'
export default {
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    this.fetchEnrollItem()
  },
  data() {
    return {
      enrollitems: [],
      current: 1,
      title: '',
    }
  },
  methods: {
    async submit() {
      const notAnswered = []
      const zeroScore = []
      this.enrollitems.forEach((item, index) => {
        if (item.evaluate.score === null) {
          notAnswered.push(index + 1)
        } else if (item.evaluate.score === 0) {
          zeroScore.push(index + 1)
        }
      })
      const message =
        zeroScore.length > 0 ? `ข้อที่ให้คะแนนเป็น 0 ได้แก่ ${zeroScore.join(', ')}` : ``
      if (notAnswered.length > 0) {
        this.$toast.warning(`คุณยังไม่ได้ประเมินข้อที่ ${notAnswered.join(', ')}`)
      } else if (
        !(await this.$store.dispatch('confirm/showConfirmDialog', {
          title: 'ยืนยันส่งการประเมิน',
          message,
        }))
      ) {
        return
      } else {
        try {
          this.$loader.show()
          await this.$axios.post(`/evaluateitem/bulk`, {
            evaluate_id: this.$route.params.id,
            enroll_id: this.$route.params.enrollId,
            evaluateitems: this.enrollitems.map((item) => ({
              evaluate_id: this.$route.params.id,
              enrollitem_id: item.id,
              enroll_id: this.$route.params.enrollId,
              examset_id: item.examsetitem.examset_id,
              score: item.evaluate.score,
              comment: item.evaluate.comment,
            })),
          })
          this.$toast.success('ประเมินเรียบร้อย')
          this.$router.push(`/evaluate/my/${this.$route.params.id}`)
        } catch (err) {
          this.$toast.error('เกิดข้อผิดพลาด')
        } finally {
          this.$loader.hide()
        }
      }
    },
    truncateString,
    async fetchEnrollItem() {
      try {
        this.$loader.show()
        const { data } = await this.$axios.get(`/enrollitem`, {
          params: {
            enroll_id: this.$route.params.enrollId,
            user_id: this.$route.params.studentId,
            del_flag: false,
          },
        })
        this.enrollitems = data.map((item, index) => ({
          ...item,
          no: index + 1,
          evaluate: {
            score: item.answer ? null : 0,
            comment: item.answer ? '' : 'ไม่ได้ตอบ',
          },
        }))
        this.title = `${this.enrollitems[0].user.prefix} ${this.enrollitems[0].user.firstname} ${this.enrollitems[0].user.lastname} (${this.enrollitems[0].user.school})`
      } catch (err) {
        console.error(err)
        this.$router.push(`/evaluate/my/${this.$route.params.id}`)
      } finally {
        this.$loader.hide()
      }
    },
    openFile(file) {
      return window.open(`${this.$config.prodURL}/file/media/${file}`, '_blank')
    },
  },
}
</script>

<template>
  <div v-if="Object.keys(evaluate).length > 0">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>แบบทดสอบ : {{ title }} </v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <p><strong>รายละเอียด</strong> <v-quill-viewer :data="evaluate.examset.description" /></p>
        <p><strong>เวลาทำ</strong> {{ evaluate.examset.time }} นาที</p>
        <p><strong>จำนวนครั้งที่สามารถทำได้</strong> {{ evaluate.examset.max_attempt }} ครั้ง</p>
        <p>
          <strong>จำนวนข้อ</strong>
          <v-progress-circular indeterminate color="primary" size="24" v-if="loadingExamsetitem" />
          <span v-else>{{ examsetitems.length }} ข้อ</span>
        </p>
        <v-card>
          <v-toolbar color="primary" dark v-if="title">
            <v-toolbar-title> รายชื่อนักเรียนที่ลงทะเบียน </v-toolbar-title>
          </v-toolbar>
          <examsetitem-student-list :examsetId="this.evaluate.examset._id" @click-evaluate="">
            <template v-slot:td-action="{ item }">
              <v-progress-circular
                indeterminate
                color="primary"
                size="24"
                v-if="loadingEvaluateitem"
              />
              <span v-else>
                <v-chip color="light" small v-if="item.attempt === 0">รอดำเนินการ</v-chip>
                <v-chip color="success" small v-else-if="evaluateitems.includes(item.id)"
                  >เสร็จสิ้น</v-chip
                >
                <v-btn
                  color="primary"
                  small
                  @click="
                    $router.push(
                      `/evaluate/my/${evaluate.id}/enroll/${item.id}/student/${item.user._id}`,
                    )
                  "
                  v-else
                  ><v-icon left>mdi-text-box-edit</v-icon>ประเมิน</v-btn
                >
              </span>
            </template>
          </examsetitem-student-list>
        </v-card>
      </v-card-text>
    </v-card>
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
      evaluate: {},
      title: '',
      loadingExamsetitem: false,
      examsetitems: [],
      loadingEvaluateitem: false,
      evaluateitems: [],
    }
  },
  methods: {
    async initialize() {
      this.fetchEvaluateitem()
      await this.fetch()
      this.fetchExamsetitem()
    },
    async fetchEvaluateitem() {
      try {
        this.loadingEvaluateitem = true
        const { data } = await this.$axios.get(`/evaluateitem/distinct`, {
          params: {
            evaluate_id: this.$route.params.id,
            del_flag: false,
          },
        })
        this.evaluateitems = data
      } catch (err) {
      } finally {
        this.loadingEvaluateitem = false
      }
    },
    async fetch() {
      try {
        this.$loader.show()
        const { data } = await this.$axios.get(`/evaluate/${this.$route.params.id}`)
        this.evaluate = data
        this.title = data.examset.title
      } catch (error) {
        this.$router.push('/evaluate/my')
      } finally {
        this.$loader.hide()
      }
    },
    async fetchExamsetitem() {
      try {
        this.loadingExamsetitem = true
        const { data } = await this.$axios.get(`/examsetitem`, {
          params: {
            examset_id: this.evaluate.examset._id,
            del_flag: false,
          },
        })
        this.examsetitems = data
      } catch (err) {
      } finally {
        this.loadingExamsetitem = false
      }
    },
  },
}
</script>

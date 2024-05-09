<template>
  <div>
    <utils-base-report
      :reportTitle="title"
      :headers="headers"
      :items="reports"
      :loading="loading"
      :expand="true"
      @click-search="search()"
    >
      <template v-slot:report-form>
        <v-row dense>
          <v-col>
            <v-autocomplete
              v-model="seletctExamset"
              :rules="[$rules.required]"
              :items="examsets"
              :loading="loadingExamsets"
              item-text="title"
              item-value="id"
              label="เลือกชุดแบบทดสอบ"
              filled
            ></v-autocomplete>
          </v-col>
        </v-row>
      </template>
      <template v-slot:td-enroll_count="{ item }">
        <td>{{ item.evaluates.length }}</td>
      </template>
      <template v-slot:td-action="{ item }">
        <td>
          <v-btn small color="warning" @click="exportCSV(item)">
            <v-icon left>mdi-file-excel</v-icon> ส่งออกข้อมูล
          </v-btn>
        </td>
      </template>
      <template v-slot:table-expand-panel="{ item }">
        <v-expansion-panels accordion>
          <v-expansion-panel
            v-for="(student, indexStudent) in item.evaluates"
            :key="`student-${indexStudent}`"
          >
            <v-expansion-panel-header>
              <strong>
                <v-icon small left>mdi-account</v-icon> {{ indexStudent + 1 }}.
                {{ student.enroll.student }} ({{ student.enroll.school }})</strong
              >
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="my-2">
                <v-col>
                  <v-card>
                    <v-toolbar color="primary" dark>
                      <v-toolbar-title> จำนวนข้อ </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="text-center">
                      <strong>{{ student.total_question }}</strong>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="mb-2">
                    <v-toolbar color="primary" dark>
                      <v-toolbar-title> คะแนนรวม </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="text-center">
                      <strong>{{ student.total_score }}</strong>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <v-toolbar color="primary" dark>
                      <v-toolbar-title> คะแนนเฉลี่ย </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="text-center">
                      <strong>{{ student.avg_score.toFixed(2) }}</strong>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <utils-data-table
                class="elevation-1"
                :headers="[
                  {
                    text: 'ข้อที่',
                    value: 'question_no',
                  },
                  {
                    text: 'องค์ประกอบ',
                    value: 'category',
                  },
                  {
                    text: 'คำตอบ',
                    value: 'answer',
                  },
                  {
                    text: 'คะแนน',
                    value: 'score',
                  },
                  {
                    text: 'หมายเหตุ',
                    value: 'comment',
                  },
                ]"
                :items="student.evs"
              >
                <template v-slot:td-answer="{ item }">
                  <td>
                    <v-chip
                      color="success"
                      label
                      small
                      @click="openLink(item.answer)"
                      v-if="item.answer"
                    >
                      <v-icon left small>mdi-information</v-icon>ตอบแล้ว
                    </v-chip>
                    <v-chip color="error" label small v-else>ไม่ได้ตอบ</v-chip>
                  </td>
                </template>
              </utils-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </utils-base-report>
  </div>
</template>
<script>
import * as XLSX from 'xlsx'
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
      title: 'รายงานชุดแบบทดสอบ',
      examsets: [],
      loadingExamsets: false,
      seletctExamset: null,
      loading: false,
      reports: [],
    }
  },
  computed: {
    headers() {
      return [
        { text: 'ลงทะเบียนเมื่อ', value: 'create_date' },
        { text: 'ครู', value: 'teacher' },
        { text: 'โรงเรียน', value: 'school' },
        { text: 'จำนวนนักเรียน', value: 'enroll_count' },
        { text: '', value: 'action', sortable: false },
      ]
    },
  },
  methods: {
    exportCSV(item) {
      const wsData = []
      wsData.push(['แบบทดสอบ', this.examsets.find((e) => e.id === this.seletctExamset).title])
      wsData.push(['ผู้ประเมิน', item.teacher])
      wsData.push(['โรงเรียน', item.school])
      wsData.push(['จำนวนนักเรียน', item.evaluates.length])
      for (const evaluate of item.evaluates) {
        let rowOfStudent = ['นักเรียน', 'โรงเรียน', 'เพศ', 'คะแนน DQ', 'เกรดวิทยาการคำนวณม.2']
        for (const ev of evaluate.evs) {
          rowOfStudent.push(`ข้อที่ ${ev.question_no}`)
        }
        wsData.push(rowOfStudent)
        rowOfStudent = []
        rowOfStudent.push(evaluate.enroll.student)
        rowOfStudent.push(evaluate.enroll.school)
        rowOfStudent.push(evaluate.enroll.gender)
        rowOfStudent.push(evaluate.enroll.dq_score)
        rowOfStudent.push(evaluate.enroll.m2_score)
        for (const ev of evaluate.evs) {
          rowOfStudent.push(ev.score)
        }
        rowOfStudent.push(evaluate.total_score)
        wsData.push(rowOfStudent)
      }
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      let csv = XLSX.utils.sheet_to_csv(ws)
      csv = '\ufeff' + csv
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `รายงานการประเมิน_${item.teacher}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    async search() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/report/examset', {
          params: {
            examset_id: this.seletctExamset,
          },
        })
        this.reports = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    initialize() {
      this.fetchExamsets()
    },
    async fetchExamsets() {
      try {
        this.loadingExamsets = true
        const { data } = await this.$axios.get('/examset', {
          params: {
            del_flag: false,
          },
        })
        this.examsets = data
      } catch (err) {
      } finally {
        this.loadingExamsets = false
      }
    },
    openLink(link) {
      window.open(link, '_blank')
    },
  },
}
</script>

<template>
  <div>
    <utils-base-report
      :reportTitle="title"
      :headers="headers"
      :items="items"
      :loading="loading"
      :search="searchText"
      @click-search="search()"
    >
      <template v-slot:report-form>
        <v-row dense>
          <v-col>
            <v-autocomplete
              v-model="user_id"
              :rules="[$rules.required]"
              :items="students"
              label="นักเรียน"
              item-text="fullname_with_school"
              item-value="id"
              return-object
              filled
            />
          </v-col>
          <v-col>
            <v-select v-model="type" multiple :items="['ก่อน', 'หลัง']" label="ประเภท" clearable />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-text-field v-model="searchText" label="ค้นหา" clearable />
          </v-col>
        </v-row>
      </template>
      <template v-slot:button>
        <v-col cols="12" sm="12">
          <v-btn block color="warning" :disabled="!user_id" @click="exportCSV()">
            <v-icon left>mdi-file-excel</v-icon> ส่งออกข้อมูล
          </v-btn>
        </v-col>
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
    this.fetchStudent()
  },
  data() {
    return {
      title: 'แบบสอบถามก่อน/หลังรายนักเรียน',
      items: [],
      type: null,
      user_id: null,
      searchText: null,
      loading: false,
      students: [],
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'ประเภท',
          value: 'type',
        },
        {
          text: 'รายการประเมิน',
          value: 'question',
        },
        {
          text: 'คำตอบ',
          value: 'answer',
        },
      ]
    },
  },
  methods: {
    async exportCSV() {
      await this.search()
      const wsData = []
      wsData.push([
        'นักเรียน',
        'โรงเรียน',
        'เพศ',
        'คะแนน DQ',
        'เกรดวิทยาการคำนวณม.2',
        'ประเภท',
        'รายการประเมิน',
        'ผลประเมิน',
      ])
      for (const review of this.items) {
        wsData.push([
          `${review.user_id.prefix}${review.user_id.firstname} ${review.user_id.lastname}`,
          review.user_id.school,
          review.user_id.gender === 'M' ? 1 : 2,
          review.user_id.dq_score,
          review.user_id.m2_score,
          review.type,
          review.question,
          review.answer,
        ])
      }
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      let csv = XLSX.utils.sheet_to_csv(ws)
      csv = '\ufeff' + csv
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `รายงานการประเมิน_${this.user_id.fullname_with_school}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    async search() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/report/reviewset', {
          params: {
            type: this.type,
            user_id: this.user_id.id,
          },
        })
        this.items = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async fetchStudent() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/user', {
          params: {
            groups: ['นักเรียน'],
            del_flag: false,
          },
        })
        this.students = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

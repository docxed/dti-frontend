<template>
  <div>
    <utils-data-table :loading="loading" :headers="headers" :items="enrolls">
      <template v-slot:td-name="{ item }">
        <td>{{ `${item.user.prefix} ${item.user.fullname}` }}</td>
      </template>
      <template v-slot:td-school="{ item }">
        <td>{{ item.user.school }}</td>
      </template>
      <template v-slot:td-is_submitted="{ item }">
        <td>
          <v-chip :color="item.is_submitted ? 'success' : 'secondary'" small>{{
            item.is_submitted
              ? 'ส่งแล้ว'
              : `กำลังสอบเหลือเวลา ${calRemainTime(item.start_datetime, item.end_datetime)}`
          }}</v-chip>
        </td>
      </template>
      <template v-slot:td-attempt="{ item }">
        <td>{{ item.attempt }}/{{ item.examset.max_attempt }}</td>
      </template>
    </utils-data-table>
  </div>
</template>
<script>
export default {
  props: {
    examsetId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.fetchEnroll()
  },
  data() {
    return {
      loading: false,
      enrolls: [],
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'ลงทะเบียนเมื่อ',
          value: 'create_date',
          type: 'datetime',
        },
        {
          text: 'ชื่อ',
          value: 'name',
        },
        {
          text: 'โรงเรียน',
          value: 'school',
        },
        {
          text: 'สถานะการสอบ',
          value: 'is_submitted',
        },
        {
          text: 'จำนวนครั้งที่สอบ',
          value: 'attempt',
        },
      ]
    },
  },
  methods: {
    async fetchEnroll() {
      try {
        this.loading = true
        const { data } = await this.$axios.get(`/enroll`, {
          params: {
            examset_id: this.examsetId,
            del_flag: false,
          },
        })
        this.enrolls = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    calRemainTime(startDate, endDate) {
      const now = this.$moment()
      const start = this.$moment(startDate)
      const end = this.$moment(endDate)
      if (now.isAfter(end)) {
        return `0 นาที`
      } else {
        const duration = this.$moment.duration(end.diff(now))
        return `${duration.asMinutes() < 1 ? 'น้อยกว่า 1' : Math.floor(duration.asMinutes())} นาที`
      }
    },
  },
}
</script>

<template>
  <div>
    <v-row justify="end" class="mt-1">
      <v-col cols="12" sm="4">
        <v-text-field v-model="searchText" label="ค้นหา" clearable />
      </v-col>
    </v-row>
    <utils-data-table :loading="loading" :headers="headers" :items="enrolls" :search="searchText">
      <template v-slot:td-name="{ item }">
        <td>{{ `${item.user.prefix} ${item.user.fullname}` }}</td>
      </template>
      <template v-slot:td-school="{ item }">
        <td>{{ item.user.school }}</td>
      </template>
      <template v-slot:td-is_submitted="{ item }">
        <td>
          <v-chip :color="item.is_submitted ? 'success' : 'light'" small>{{
            item.is_submitted ? 'ส่งแล้ว' : 'ยังไม่ส่ง'
          }}</v-chip>
        </td>
      </template>

      <template v-slot:td-attempt="{ item }">
        <td>{{ item.attempt }}/{{ item.examset.max_attempt }}</td>
      </template>
      <template v-slot:td-action="{ item }">
        <td>
          <slot name="td-action" :item="item"></slot>
          <v-btn icon small @click="deleteEnroll(item)" v-if="$auth.user.groups.includes('แอดมิน')"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </td>
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
    hideAction: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.fetchEnroll()
  },
  data() {
    return {
      searchText: null,
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
          text: 'จำนวนครั้งที่สอบ',
          value: 'attempt',
        },
        {
          text: 'สถานะการส่ง',
          value: 'is_submitted',
        },

        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ]
    },
  },
  methods: {
    async deleteEnroll(item) {
      if (await this.$store.dispatch('confirm/showConfirmDialog')) {
        try {
          this.$loader.show()
          await this.$axios.delete(`/enroll/${item.id}`)
          this.$toast.success('ลบข้อมูลสำเร็จ')
          this.enrolls.splice(this.enrolls.indexOf(item), 1)
        } catch (err) {
        } finally {
          this.$loader.hide()
        }
      }
    },
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
    // calRemainTime(startDate, endDate) {
    //   const now = this.$moment()
    //   const start = this.$moment(startDate)
    //   const end = this.$moment(endDate)
    //   if (now.isAfter(end)) {
    //     return `0 นาที`
    //   } else {
    //     const duration = this.$moment.duration(end.diff(now))
    //     return `${duration.asMinutes() < 1 ? 'น้อยกว่า 1' : Math.floor(duration.asMinutes())} นาที`
    //   }
    // },
  },
}
</script>

<template>
  <div>
    <utils-base-report
      :reportTitle="title"
      :loading="loading"
      :search="searchText"
      :headers="headers"
      :items="enrolls"
      @click-search="search()"
    >
      <template v-slot:report-form>
        <v-row>
          <v-col>
            <v-text-field v-model="searchText" label="ค้นหา" clearable />
          </v-col>
        </v-row>
      </template>
      <template v-slot:td-title="{ item }">
        <td>
          {{ item.examset.title }}
        </td>
      </template>
      <template v-slot:td-time="{ item }">
        <td>
          {{ item.examset.time }}
        </td>
      </template>
      <template v-slot:td-max_attempt="{ item }">
        <td>{{ item.examset.max_attempt }}</td>
      </template>
      <template v-slot:td-action="{ item }">
        <td>
          <v-btn
            color="primary"
            small
            @click="
              enrollDetail = item
              dialogDetail = true
            "
            ><v-icon left>mdi-information</v-icon>รายละเอียด</v-btn
          >
        </td>
      </template>
    </utils-base-report>
    <dialog-form :value.sync="dialogDetail" :title="enrollDetail?.examset?.title || ''">
      <enroll-dialog-detail :enroll="enrollDetail" @close="dialogDetail = false" />
    </dialog-form>
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
    this.search()
  },
  data() {
    return {
      title: 'แบบทดสอบของฉัน',
      loading: false,
      enrolls: [],
      searchText: null,
      dialogDetail: false,
      enrollDetail: {},
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'วันที่ลงทะเบียน',
          value: 'create_date',
          type: 'datetime',
        },
        {
          text: 'ชื่อชุดแบบทดสอบ',
          value: 'title',
        },
        {
          text: 'ระยะเวลา (นาที)',
          value: 'time',
        },
        {
          text: 'จำนวนครั้งที่สามารถทำได้',
          value: 'max_attempt',
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
    async search() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/enroll', {
          params: {
            user_id: this.$auth.user.id,
            del_flag: false,
          },
        })
        this.enrolls = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

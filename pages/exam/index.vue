<template>
  <div>
    <utils-base-report
      :reportTitle="title"
      :loading="loading"
      :search="searchText"
      :headers="headerExamset"
      :items="examsets"
      @click-search="search()"
    >
      <template v-slot:report-form>
        <v-row>
          <v-col>
            <v-text-field v-model="searchText" label="ค้นหา" clearable />
          </v-col>
        </v-row>
      </template>
      <template v-slot:td-action="{ item }">
        <td class="text-center">
          <v-btn
            color="primary"
            small
            @click="
              dialogDetail = true
              examsetDetail = item
            "
          >
            รายละเอียด
          </v-btn>
        </td></template
      >
    </utils-base-report>
    <dialog-form :value.sync="dialogDetail" :title="examsetDetail?.title || ''">
      <exam-dialog-detail :examset="examsetDetail" @close="dialogDetail = false" />
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
      title: 'แบบทดสอบ',
      loading: false,
      examsets: [],
      searchText: null,
      dialogDetail: false,
      examsetDetail: {},
    }
  },
  computed: {
    headerExamset() {
      return [
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
        const { data } = await this.$axios.get('/examset', {
          params: {
            is_published: true,
            del_flag: false,
          },
        })
        const { data: examsetme } = await this.$axios.get('/enroll', {
          params: {
            user_id: this.$auth.user.id,
            del_flag: false,
          },
        })
        this.examsets = data.filter((examset) => {
          return !examsetme.find((item) => item.examset._id === examset.id)
        })
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <div>
    <utils-base-report
      :reportTitle="title"
      :loading="loading"
      :search="searchText"
      :headers="headers"
      :items="evaluates"
      :has-search="false"
      @click-search="search()"
    >
      <template v-slot:divider>
        <v-row justify="end">
          <v-col cols="12" sm="6">
            <v-text-field v-model="searchText" label="ค้นหา" clearable />
          </v-col>
        </v-row>
      </template>
      <template v-slot:td-title="{ item }">
        <td>
          {{ item.examset.title }}
        </td>
      </template>
      <template v-slot:td-action="{ item }">
        <td>
          <v-btn color="primary" small @click="$router.push(`/evaluate/my/${item.id}`)"
            ><v-icon left>mdi-information</v-icon>รายละเอียด</v-btn
          >
        </td>
      </template>
    </utils-base-report>
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
    this.fetch()
  },
  data() {
    return {
      title: 'ประเมินแบบทดสอบ',
      searchText: null,
      loading: false,
      evaluates: [],
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'ชื่อแบบทดสอบ',
          value: 'title',
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
    async fetch() {
      try {
        this.loading = true
        const { data } = await this.$axios.get(`/evaluate`, {
          params: {
            user_id: this.$auth.user.id,
            del_flag: false,
          },
        })
        this.evaluates = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

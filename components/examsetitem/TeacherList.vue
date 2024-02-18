<template>
  <div>
    <v-row justify="end" class="mt-1">
      <v-col cols="12" sm="4">
        <v-btn block color="success" @click="dialogCreateEvaluate = true"
          ><v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ประเมิน
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="12" sm="4">
        <v-text-field v-model="searchText" label="ค้นหา" clearable />
      </v-col>
    </v-row>
    <utils-data-table :loading="loading" :headers="headers" :items="evaluates" :search="searchText">
      <template v-slot:td-name="{ item }">
        <td>{{ `${item.user.prefix} ${item.user.fullname}` }}</td>
      </template>
      <template v-slot:td-school="{ item }">
        <td>{{ item.user.school }}</td>
      </template>
      <template v-slot:td-action="{ item }"
        ><td>
          <v-btn icon small @click="deleteEvaluate(item)"><v-icon>mdi-delete</v-icon></v-btn>
        </td>
      </template>
    </utils-data-table>
    <dialog-form :value.sync="dialogCreateEvaluate" :title="`เพิ่มผู้ประเมิน`">
      <v-form @submit.prevent="createEvaluate()">
        <v-autocomplete
          v-model="selectedTeacher"
          :rules="[$rules.required]"
          :items="teachers"
          label="เลือกผู้ประเมิน"
          item-text="fullname_with_school"
          item-value="id"
          clearable
        />
        <v-row justify="center">
          <v-col cols="6" sm="4">
            <v-btn block @click="dialogCreateEvaluate = false">ยกเลิก</v-btn>
          </v-col>
          <v-col cols="6" sm="4">
            <v-btn
              block
              color="success"
              :laodingCreateEvaluate="laodingCreateEvaluate"
              type="submit"
              >บันทึก</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </dialog-form>
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
    this.fetch()
    this.fetchTeacher()
  },
  data() {
    return {
      searchText: null,
      loading: false,
      evaluates: [],
      dialogCreateEvaluate: false,
      laodingCreateEvaluate: false,
      selectedTeacher: null,
      teachers: [],
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
          text: '',
          value: 'action',
          sortable: false,
        },
      ]
    },
  },
  methods: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/evaluate`, {
          params: {
            examset_id: this.examsetId,
            del_flag: false,
          },
        })
        this.evaluates = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async fetchTeacher() {
      try {
        const { data } = await this.$axios.get(`/user`, {
          params: {
            groups: ['ครู'],
            del_flag: false,
          },
        })
        this.teachers = data
      } catch (err) {}
    },
    async createEvaluate() {
      try {
        this.laodingCreateEvaluate = true
        const { data } = await this.$axios.post(`/evaluate`, {
          examset_id: this.examsetId,
          user_id: this.selectedTeacher,
        })
        this.selectedTeacher = null
        this.dialogCreateEvaluate = false
        this.evaluates.unshift(data)
        this.$toast.success('เพิ่มผู้ประเมินสำเร็จ')
      } catch (err) {
      } finally {
        this.laodingCreateEvaluate = false
      }
    },
    async deleteEvaluate(item) {
      if (await this.$store.dispatch('confirm/showConfirmDialog')) {
        try {
          this.$loader.show()
          await this.$axios.delete(`/evaluate/${item.id}`)
          this.evaluates.splice(this.evaluates.indexOf(item), 1)
          this.$toast.success('ลบผู้ประเมินสำเร็จ')
        } catch (err) {
        } finally {
          this.$loader.hide()
        }
      }
    },
  },
}
</script>

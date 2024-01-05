<template>
  <div>
    <v-row justify="end">
      <v-col cols="12" sm="4">
        <v-btn block color="success" @click="dialogCreateExamsetitem = true"
          ><v-icon left>mdi-plus</v-icon>เพิ่มโจทย์</v-btn
        >
      </v-col>
    </v-row>
    <utils-data-table class="mt-3" :headers="examsetitemHeaders" :items="examsetitems">
      <template v-slot:td-question="{ item }">
        <td>
          <v-quill-viewer :data="truncateString(item.question, 50)" />
        </td>
      </template>
      <template v-slot:td-category.name="{ item }">
        <td>
          {{ item.category.name }}
        </td>
      </template>
      <template v-slot:td-action="{ item }">
        <td>
          <v-btn
            icon
            small
            @click="
              () => {
                updateExamsetitem = { ...item }
                dialogUpdateExamsetitem = true
              }
            "
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
          <v-btn icon small @click="deleteExamsetitem(item)"><v-icon>mdi-delete</v-icon></v-btn>
        </td>
      </template>
    </utils-data-table>
    <dialog-form :value.sync="dialogUpdateExamsetitem" :title="`แก้ไขโจทย์`">
      <examsetitem-form
        :examsetId="examsetId"
        isUpdate
        :updateItem="updateExamsetitem"
        @on-update="
          examsetitems.splice(
            examsetitems.findIndex((i) => i.id === updateExamsetitem.id),
            1,
            $event,
          )
        "
        @close="dialogUpdateExamsetitem = false"
      />
    </dialog-form>
    <dialog-form :value.sync="dialogCreateExamsetitem" :title="`เพิ่มโจทย์`">
      <examsetitem-form
        :examsetId="examsetId"
        @on-create="examsetitems.push($event)"
        @close="dialogCreateExamsetitem = false"
      />
    </dialog-form>
  </div>
</template>
<script>
import { truncateString } from '~/utils/format'
export default {
  props: {
    examsetId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.fetchExamsetitems()
  },
  data() {
    return {
      dialogCreateExamsetitem: false,
      loadingExamsetitem: false,
      examsetitems: [],
      dialogUpdateExamsetitem: false,
      updateExamsetitem: {},
    }
  },
  computed: {
    examsetitemHeaders() {
      return [
        {
          text: 'สร้างเมื่อ',
          value: 'create_date',
          type: 'datetime',
        },
        {
          text: 'แก้ไขเมื่อ',
          value: 'update_date',
          type: 'datetime',
        },
        {
          text: 'โจทย์',
          value: 'question',
          sortable: false,
        },
        {
          text: 'องค์ประกอบ',
          value: 'category.name',
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
    async deleteExamsetitem(item) {
      if (await this.$store.dispatch('confirm/showConfirmDialog')) {
        try {
          this.$loader.show()
          await this.$axios.delete(`/examsetitem/${item.id}`)
          this.$toast.success('ลบข้อมูลสำเร็จ')
          this.examsetitems.splice(this.examsetitems.indexOf(item), 1)
        } catch (err) {
        } finally {
          this.$loader.hide()
        }
      }
    },
    async fetchExamsetitems() {
      try {
        this.loadingExamsetitem = true
        const { data } = await this.$axios.get(`/examsetitem`, {
          params: {
            examset_id: this.examsetId,
            del_flag: false,
          },
        })
        this.examsetitems = data
      } catch (err) {
      } finally {
        this.loadingExamsetitem = false
      }
    },
    truncateString,
  },
}
</script>

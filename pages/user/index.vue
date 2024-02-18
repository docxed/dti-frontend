<template>
  <div>
    <utils-base-report
      :reportTitle="title"
      :headers="headers"
      :items="users"
      :loading="loading"
      :search="searchText"
      @click-search="search()"
    >
      <template v-slot:report-form>
        <v-row dense>
          <v-col>
            <v-autocomplete
              v-model="groups"
              :items="groupItem"
              multiple
              item-text="text"
              item-value="value"
              clearable
              label="เลือกกลุ่มผู้ใช้"
            />
          </v-col>
          <v-col>
            <v-text-field v-model="searchText" label="ค้นหา" clearable />
          </v-col>
        </v-row>
      </template>
      <template v-slot:button>
        <v-col color="12" sm="12">
          <v-btn block color="success" @click="dialogCreate = true">
            <v-icon left>mdi-plus</v-icon>เพิ่มผู้ใช้
          </v-btn>
        </v-col>
      </template>
      <template v-slot:td-groups="{ item }">
        <td>
          <v-chip
            v-for="(group, indexGroup) in item.groups"
            :key="`group-${indexGroup}`"
            color="primary"
            class="ma-1"
            small
          >
            {{ group }}
          </v-chip>
        </td>
      </template>
      <template v-slot:td-action="{ item }">
        <td>
          <v-btn
            icon
            small
            @click="
              updateItem = item
              dialogUpdate = true
            "
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
        </td>
      </template>
    </utils-base-report>
    <dialog-form :value.sync="dialogCreate" title="เพิ่มผู้ใช้">
      <user-manage-form @on-create="search()" @close="dialogCreate = false" />
    </dialog-form>
    <dialog-form :value.sync="dialogUpdate" title="แก้ไขผู้ใช้">
      <user-manage-form
        :item="updateItem"
        isUpdate
        @on-update="search()"
        @close="dialogUpdate = false"
      />
    </dialog-form>
  </div>
</template>
<script>
import { GROUP } from '~/constants/user'
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
      title: 'เพิ่มผู้ใช้',
      users: [],
      loading: false,
      groups: ['ครู'],
      groupItem: GROUP,
      dialogCreate: false,
      searchText: null,
      updateItem: null,
      dialogUpdate: false,
    }
  },
  computed: {
    headers() {
      return [
        { text: 'อีเมล', value: 'email' },
        { text: 'ชื่อ', value: 'fullname_with_prefix' },
        { text: 'โรงเรียน', value: 'school' },
        { text: 'เพศ', value: 'gender' },
        { text: 'คะแนน DQ', value: 'dq_score', align: 'right' },
        { text: 'กลุ่ม', value: 'groups' },
        { text: '', value: 'action', sortable: false },
      ]
    },
  },
  methods: {
    initialize() {
      this.search()
    },
    async search() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/user', {
          params: {
            del_flag: false,
            groups: this.groups,
          },
        })
        this.users = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

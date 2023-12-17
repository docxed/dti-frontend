<template>
  <div>
    <utils-base-report
      :reportTitle="title"
      :form.sync="searchFrom"
      :headers="headers"
      :items="items"
      :loading="loading"
      :search="searchText"
      :pagination.sync="pagination"
      @click-search="search()"
    >
      <template v-slot:button>
        <v-col color="12" sm="12">
          <v-btn block color="success" @click="dialogCreate = true">
            <v-icon left>mdi-plus</v-icon>สร้างชุดแบบทดสอบ
          </v-btn>
        </v-col>
      </template>
      <template v-slot:divider>
        <v-row justify="end">
          <v-col cols="12" sm="4">
            <v-text-field v-model="searchText" label="ค้นหา" clearable />
          </v-col>
        </v-row>
      </template>
      <template v-slot:td-is_password="{ item }">
        <td>
          {{ item.is_password ? item.password : '-' }}
        </td>
      </template>
      <template v-slot:td-is_published="{ item }">
        <td>
          <v-switch
            :label="item.is_published ? 'เปิดใช้งาน' : 'ปิดใช้งาน'"
            :input-value="item.is_published"
            @change="toggleIsPublished(item)"
          />
        </td>
      </template>
      <template v-slot:td-action="{ item }">
        <td>
          <v-btn icon small @click="$router.push(`/examset/${item.id}`)"
            ><v-icon>mdi-information</v-icon></v-btn
          >
          <v-btn icon small @click="deleteItem(item)"><v-icon>mdi-delete</v-icon></v-btn>
        </td>
      </template>
    </utils-base-report>

    <dialog-form :value.sync="dialogCreate" title="สร้างชุดแบบทดสอบ">
      <examset-form
        :headers="headers"
        :items="items"
        @on-create="items.unshift($event)"
        @close="dialogCreate = false"
      />
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
    const now = new Date()
    this.searchFrom.start_date = this.$moment(now).subtract(4, 'months').format('YYYY-MM-DD')
    this.searchFrom.end_date = this.$moment(now).format('YYYY-MM-DD')
    this.search()
  },
  data() {
    return {
      title: 'ชุดแบบทดสอบ',
      searchFrom: {
        start_date: null,
        end_date: null,
        del_flag: false,
        is_published: true,
      },
      loading: false,
      items: [],
      dialogCreate: false,
      searchText: null,
      pagination: {
        page: 1,
        itemsPerPage: 10,
        sortBy: 'create_date',
        descending: true,
      },
    }
  },
  computed: {
    headers() {
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
          text: 'ชื่อชุดแบบทดสอบ',
          value: 'title',
        },
        {
          text: 'เวลาทำ (นาที)',
          value: 'time',
        },
        {
          text: 'รหัสผ่าน',
          value: 'is_password',
        },
        {
          text: 'สถานะ',
          value: 'is_published',
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
          params: this.searchFrom,
        })
        this.items = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async deleteItem(item) {
      try {
        if (await this.$store.dispatch('confirm/showConfirmDialog')) {
          this.$loader.show()
          await this.$axios.delete(`/examset/${item.id}`)
          this.$toast.success('ลบข้อมูลสำเร็จ')
          const index = this.items.findIndex((i) => i.id === item.id)
          this.items.splice(index, 1)
        }
      } catch (err) {
      } finally {
        this.$loader.hide()
      }
    },
    async toggleIsPublished(item) {
      try {
        await this.$axios.patch(`/examset/${item.id}`, {
          is_published: !item.is_published,
        })
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        const index = this.items.findIndex((i) => i.id === item.id)
        this.items.splice(index, 1, {
          ...item,
          is_published: !item.is_published,
        })
      } catch (err) {
      } finally {
      }
    },
  },
}
</script>

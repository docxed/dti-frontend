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
            <v-select v-model="type" multiple :items="['ก่อน', 'หลัง']" label="ประเภท" clearable />
          </v-col>
          <v-col>
            <v-text-field v-model="searchText" label="ค้นหา" clearable />
          </v-col>
        </v-row>
      </template>
      <template v-slot:button>
        <v-col color="12" sm="12">
          <v-btn block color="success" @click="dialogCreate = true">
            <v-icon left>mdi-plus</v-icon>เพิ่มแบบสอบถาม
          </v-btn>
        </v-col>
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
          <v-btn icon small @click="deleteItem(item)"><v-icon>mdi-delete</v-icon></v-btn>
        </td>
      </template>
    </utils-base-report>
    <dialog-form :value.sync="dialogCreate" title="เพิ่มแบบสอบถาม">
      <review-form @on-create="search()" @close="dialogCreate = false" />
    </dialog-form>
    <dialog-form :value.sync="dialogUpdate" title="แก้ไขแบบสอบถาม">
      <review-form
        :item="updateItem"
        isUpdate
        @on-update="search()"
        @close="dialogUpdate = false"
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
    this.search()
  },
  data() {
    return {
      title: 'แบบสอบถามก่อน/หลัง',
      items: [],
      searchText: null,
      loading: false,
      dialogCreate: false,
      updateItem: null,
      dialogUpdate: false,
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
        const { data } = await this.$axios.get('/review', {
          params: {
            type: this.type,
          },
        })
        this.items = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async deleteItem(item) {
      if (await this.$store.dispatch('confirm/showConfirmDialog')) {
        try {
          this.$loader.show()
          await this.$axios.delete(`/review/${item._id}`)
          this.items.splice(this.items.indexOf(item), 1)
          this.$toast.success('ลบข้อมูลสำเร็จ')
        } catch (err) {
        } finally {
          this.$loader.hide()
        }
      }
    },
  },
}
</script>

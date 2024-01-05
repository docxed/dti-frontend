<template>
  <div>
    <v-autocomplete
      v-bind="$attrs"
      :value="data"
      @input="$emit('update:data', $event)"
      :items="itemsFiltered"
      item-text="name"
      item-value="id"
      chips
    >
      <template v-slot:append-outer>
        <v-btn fab color="primary" small @click="dialog = true"><v-icon>mdi-plus</v-icon></v-btn>
      </template>
    </v-autocomplete>
    <v-dialog v-model="dialog" scrollable width="500" persistent>
      <dialog-crud-card
        ref="crudCard"
        :titlePage="`แท็ก`"
        :loading="loading"
        :items="items"
        @on-create="create($event)"
        @on-update="update($event)"
        @on-delete="deleteItem($event)"
        @on-restore="restore($event)"
        @close="dialog = false"
        v-if="dialog"
      />
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: String,
      default: null,
    },
  },
  mounted() {
    this.fetch()
  },
  data() {
    return {
      loading: false,
      dialog: false,
      items: [],
    }
  },
  computed: {
    itemsFiltered() {
      return this.items.filter((item) => !item.del_flag || item.id === this.data)
    },
  },
  methods: {
    async fetch() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/examsetitem-category')
        this.items = data
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async restore(id) {
      try {
        this.$loader.show()
        await this.$axios.put(`/examsetitem-category/${id}/restore`)
        const item = this.items.find((item) => item.id === id)
        item.del_flag = false
        this.$toast.success('กู้คืนข้อมูลสำเร็จ')
      } catch (err) {
      } finally {
        this.$loader.hide()
      }
    },
    async update({ id, name }) {
      try {
        this.loading = true
        await this.$axios.put(`/examsetitem-category/${id}`, { name })
        const item = this.items.find((item) => item.id === id)
        item.name = name
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$refs.crudCard.reset()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async deleteItem(id) {
      if (await this.$store.dispatch('confirm/showConfirmDialog')) {
        try {
          this.$loader.show()
          await this.$axios.delete(`/examsetitem-category/${id}`)
          const item = this.items.find((item) => item.id === id)
          item.del_flag = true
          this.$toast.success('ลบข้อมูลสำเร็จ')
        } catch (err) {
        } finally {
          this.$loader.hide()
        }
      }
    },
    async create(name) {
      try {
        this.loading = true
        const { data } = await this.$axios.post('/examsetitem-category', { name })
        this.items.push(data)
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$refs.crudCard.reset()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
